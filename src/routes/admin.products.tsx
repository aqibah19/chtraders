import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { formatPKR } from "@/lib/products";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Product = { id: string; name: string; slug: string; description: string | null; price: number; old_price: number | null; category_id: string | null; image_url: string | null; stock: number; featured: boolean; images: string[] };
type Category = { id: string; name: string };

const empty: Omit<Product, "id"> = { name: "", slug: "", description: "", price: 0, old_price: null, category_id: null, image_url: "", stock: 0, featured: false, images: [] };

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
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

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing as any;
    const payload: any = {
      ...rest,
      slug: rest.slug || rest.name?.toLowerCase().replace(/\s+/g, "-"),
      images: rest.images ?? [],
    };
    const { error } = id
      ? await supabase.from("products").update(payload).eq("id", id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
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
    for (const f of picks) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("product-images").upload(path, f, { cacheControl: "3600", upsert: false });
      if (error) { toast.error(error.message); continue; }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    const next = [...current, ...uploaded];
    setEditing({ ...editing, images: next, image_url: editing.image_url || next[0] || "" });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (url: string) => {
    if (!editing) return;
    const next = (editing.images ?? []).filter((u) => u !== url);
    setEditing({ ...editing, images: next, image_url: editing.image_url === url ? (next[0] ?? "") : editing.image_url });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      <div className="bg-card border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Featured</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{formatPKR(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.featured ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(p)} className="p-2 hover:text-primary"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(p.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No products yet. Add your first one.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="font-display text-xl font-bold mb-4">{editing.id ? "Edit Product" : "New Product"}</h2>
            <div className="space-y-3">
              <In label="Name" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
              <In label="Slug (optional)" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <div>
                <div className="text-sm font-medium mb-1">Product Images (max 5)</div>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {(editing.images ?? []).map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {(editing.images?.length ?? 0) < 5 && (
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50">
                      <Upload className="w-4 h-4 mb-1" />{uploading ? "..." : "Add"}
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
                <div className="text-xs text-muted-foreground">{(editing.images?.length ?? 0)}/5 uploaded. First image is the main display image.</div>
              </div>
              <In label="Or paste Main Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
              <label className="block text-sm"><span className="font-medium">Description</span><textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" rows={3} /></label>
              <div className="grid grid-cols-2 gap-3">
                <In label="Price (PKR)" type="number" value={String(editing.price ?? 0)} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
                <In label="Old Price" type="number" value={String(editing.old_price ?? "")} onChange={(v) => setEditing({ ...editing, old_price: v ? Number(v) : null })} />
                <In label="Stock" type="number" value={String(editing.stock ?? 0)} onChange={(v) => setEditing({ ...editing, stock: Number(v) })} />
                <label className="block text-sm"><span className="font-medium">Category</span>
                  <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background">
                    <option value="">— none —</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 bg-primary text-primary-foreground py-2 rounded-full font-semibold">Save</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function In({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" />
    </label>
  );
}