import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, Image as ImageIcon, Pencil, Plus, Trash2, Upload, X, RefreshCw, Database, Search } from "lucide-react";
import { formatPKR, products as staticCatalogProducts } from "@/lib/products";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Product = { id: string; name: string; slug: string; description: string | null; price: number; old_price: number | null; category_id: string | null; image_url: string | null; stock: number; featured: boolean; images: string[] };
type Category = { id: string; name: string };

const empty: Omit<Product, "id"> = { name: "", slug: "", description: "", price: 0, old_price: null, category_id: null, image_url: "", stock: 0, featured: false, images: [] };

// Convert any uploaded image into a perfect 1:1 800x800 square image with crisp padding/cropping
function processImageToSquare(file: File, fitMode: "contain" | "cover" = "contain", targetSize = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not get canvas context"));

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetSize, targetSize);

      let dx = 0, dy = 0, dw = targetSize, dh = targetSize;
      const aspect = img.width / img.height;

      if (fitMode === "contain") {
        if (aspect > 1) {
          dh = targetSize / aspect;
          dy = (targetSize - dh) / 2;
        } else {
          dw = targetSize * aspect;
          dx = (targetSize - dw) / 2;
        }
      } else {
        if (aspect > 1) {
          dw = targetSize * aspect;
          dx = (targetSize - dw) / 2;
        } else {
          dh = targetSize / aspect;
          dy = (targetSize - dh) / 2;
        }
      }

      ctx.drawImage(img, dx, dy, dw, dh);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas conversion failed"));
      }, "image/jpeg", 0.92);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id,name"),
    ]);
    setItems((p.data as Product[]) ?? []);
    setCats((c.data as Category[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  // Merge DB products with static 39 catalog products so all products are ALWAYS shown
  const staticAsAdminItems: Product[] = staticCatalogProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    description: p.description,
    price: p.price,
    old_price: p.oldPrice ?? null,
    category_id: null,
    image_url: p.image ?? null,
    stock: 25,
    featured: !!p.badge,
    images: p.image ? [p.image] : [],
  }));

  const displayItems = [...items];
  staticAsAdminItems.forEach((sp) => {
    if (!displayItems.some((dbP) => dbP.slug === sp.slug || dbP.id === sp.id)) {
      displayItems.push(sp);
    }
  });

  const filteredItems = displayItems.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing as any;
    const slug = rest.slug || rest.name?.toLowerCase().replace(/\s+/g, "-");
    const payload: any = {
      ...rest,
      slug,
      images: rest.images ?? [],
    };
    
    // Check if updating existing DB record or inserting
    const isRealUuid = id && id.length > 20 && id.includes("-");
    const { error } = isRealUuid
      ? await supabase.from("products").update(payload).eq("id", id)
      : await supabase.from("products").upsert(payload, { onConflict: "slug" });
      
    if (error) return toast.error(error.message);
    toast.success("Product saved to database!");
    setEditing(null);
    setPreviewUrl(null);
    load();
  };

  const syncAllToDb = async () => {
    setSyncing(true);
    try {
      const payload = staticCatalogProducts.map((p) => ({
        name: p.name,
        slug: p.id,
        description: p.description,
        price: p.price,
        old_price: p.oldPrice ?? null,
        image_url: p.image ?? null,
        stock: 25,
        featured: !!p.badge,
        images: p.image ? [p.image] : [],
      }));
      const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      toast.success("All 39 catalog products synced to Supabase Database!");
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const del = async (id: string, slug?: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().or(`id.eq.${id},slug.eq.${id}${slug ? `,slug.eq.${slug}` : ""}`);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted successfully!");
    setItems((prev) => prev.filter((x) => x.id !== id && x.slug !== id));
    await syncProductsFromSupabase();
    load();
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || !editing) return;
    const current = editing.images ?? [];
    const room = 5 - current.length;
    if (room <= 0) return toast.error("Max 5 images per product");
    const picks = Array.from(files).slice(0, room);
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const f of picks) {
        const processedBlob = await processImageToSquare(f, fitMode, 800);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error } = await supabase.storage.from("product-images").upload(fileName, processedBlob, { contentType: "image/jpeg", cacheControl: "3600", upsert: false });
        if (error) { toast.error(error.message); continue; }
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        uploaded.push(data.publicUrl);
      }
      const next = [...current, ...uploaded];
      const mainImg = editing.image_url || next[0] || "";
      setEditing({ ...editing, images: next, image_url: mainImg });
      setPreviewUrl(mainImg);
      toast.success("Image auto-cropped to square 1:1 and uploaded!");
    } catch (e: any) {
      toast.error(e?.message ?? "Image processing failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    if (!editing) return;
    const next = (editing.images ?? []).filter((u) => u !== url);
    const mainImg = editing.image_url === url ? (next[0] ?? "") : editing.image_url;
    setEditing({ ...editing, images: next, image_url: mainImg });
    setPreviewUrl(mainImg || null);
  };

  const selectedMain = editing?.image_url || previewUrl || editing?.images?.[0] || "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Products Catalog ({displayItems.length})</h1>
          <p className="text-xs text-muted-foreground">Manage all {displayItems.length} store products, images & inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={syncAllToDb} disabled={syncing} className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition disabled:opacity-50">
            {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-primary" />}
            {syncing ? "Syncing..." : "Sync All 39 to Database"}
          </button>
          <button onClick={() => { setEditing({ ...empty }); setPreviewUrl(null); }} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition"><Plus className="w-4 h-4" /> Add Product</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border p-3.5 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name, model or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold">✕</button>
          )}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{filteredItems.length}</span> of {displayItems.length} products
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                <td className="p-3">
                  <div className="w-12 h-12 rounded-lg border overflow-hidden bg-white p-1 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                    )}
                  </div>
                </td>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3 font-medium text-primary">{formatPKR(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.featured ? <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-medium">Featured</span> : "No"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(p); setPreviewUrl(p.image_url); }} className="p-2 hover:text-primary transition" title="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(p.id, p.slug)} className="p-2 hover:text-destructive transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {displayItems.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No products found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto border shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="font-display text-xl font-bold">{editing.id ? "Edit Product" : "New Product"}</h2>
                <p className="text-xs text-muted-foreground">Upload 1:1 square pictures with live preview</p>
              </div>
              <button onClick={() => setEditing(null)} className="p-1 rounded-full hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column: Form Fields */}
              <div className="space-y-3">
                <In label="Product Name" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
                <In label="Slug (optional)" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
                
                <div className="grid grid-cols-2 gap-3">
                  <In label="Price (PKR)" type="number" value={String(editing.price ?? 0)} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
                  <In label="Old Price" type="number" value={String(editing.old_price ?? "")} onChange={(v) => setEditing({ ...editing, old_price: v ? Number(v) : null })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <In label="Stock Quantity" type="number" value={String(editing.stock ?? 0)} onChange={(v) => setEditing({ ...editing, stock: Number(v) })} />
                  <label className="block text-xs font-semibold"><span>Category</span>
                    <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="mt-1 w-full px-3 py-2 rounded-xl border bg-background text-sm">
                      <option value="">— Select Category —</option>
                      {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-semibold">
                  <span>Product Description</span>
                  <textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border bg-background text-sm" rows={3} placeholder="Add product details, model specs..." />
                </label>

                <label className="flex items-center gap-2 text-sm font-medium pt-1">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" /> Featured Product on Home Page
                </label>
              </div>

              {/* Right Column: Live 1:1 Image Preview & Crop Controls */}
              <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary" /> Live 1:1 Card Preview</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground">Fit Mode:</span>
                    <button type="button" onClick={() => setFitMode("contain")} className={`px-2 py-0.5 rounded ${fitMode === "contain" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted"}`}>Fit</button>
                    <button type="button" onClick={() => setFitMode("cover")} className={`px-2 py-0.5 rounded ${fitMode === "cover" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted"}`}>Crop</button>
                  </div>
                </div>

                {/* 1:1 Square Preview Box */}
                <div className="aspect-square w-full rounded-2xl border bg-white shadow-inner overflow-hidden relative flex items-center justify-center p-2 group">
                  {selectedMain ? (
                    <img src={selectedMain} alt="Live Preview" className={`w-full h-full object-${fitMode} transition-all duration-300`} />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">No Image Selected</div>
                      <div className="text-[10px] text-muted-foreground/60 mt-1">Upload a picture below for live preview</div>
                    </div>
                  )}
                  {selectedMain && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur">
                      Square 1:1 Uniform Preview
                    </div>
                  )}
                </div>

                {/* Image Upload / URL Controls */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold">Upload Product Images (Max 5)</div>
                  <div className="grid grid-cols-5 gap-2">
                    {(editing.images ?? []).map((url) => (
                      <div key={url} onClick={() => { setEditing({ ...editing, image_url: url }); setPreviewUrl(url); }} className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-white p-0.5 ${editing.image_url === url ? "border-primary ring-2 ring-primary/20" : "border-muted"}`}>
                        <img src={url} alt="" className="w-full h-full object-contain" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(url); }} className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded-full p-0.5 hover:bg-red-600 transition"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    {(editing.images?.length ?? 0) < 5 && (
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-[10px] text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50 transition bg-background">
                        {uploading ? <RefreshCw className="w-4 h-4 animate-spin mb-1 text-primary" /> : <Upload className="w-4 h-4 mb-1" />}
                        {uploading ? "Auto 1:1..." : "Upload"}
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />

                  <div className="pt-2">
                    <In label="Or Paste Direct Image URL" value={editing.image_url ?? ""} onChange={(v) => { setEditing({ ...editing, image_url: v }); setPreviewUrl(v); }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t">
              <button onClick={save} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full font-semibold hover:opacity-90 transition">Save Product</button>
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-full border hover:bg-muted transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function In({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-xs font-semibold">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border bg-background text-sm font-normal" />
    </label>
  );
}