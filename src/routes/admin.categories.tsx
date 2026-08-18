import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

type Category = { id: string; name: string; slug: string; image_url: string | null };
const empty: Omit<Category, "id"> = { name: "", slug: "", image_url: "" };

function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setItems((data as Category[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name) return toast.error("Name is required");
    const { id, ...rest } = editing as any;
    const payload = { ...rest, slug: rest.slug || rest.name.toLowerCase().replace(/\s+/g, "-") };
    const { error } = id
      ? await supabase.from("categories").update(payload).eq("id", id)
      : await supabase.from("categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || !files[0] || !editing) return;
    const f = files[0];
    setUploading(true);
    const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, f, { cacheControl: "3600", upsert: false });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setEditing({ ...editing, image_url: data.publicUrl });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
      </div>

      <div className="bg-card border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">
                  {c.image_url
                    ? <img src={c.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                    : <div className="w-12 h-12 rounded-lg border bg-muted" />}
                </td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(c)} className="p-2 hover:text-primary"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(c.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <h2 className="font-display text-xl font-bold mb-4">{editing.id ? "Edit Category" : "New Category"}</h2>
            <div className="space-y-3">
              <label className="block text-sm"><span className="font-medium">Name</span>
                <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" />
              </label>
              <label className="block text-sm"><span className="font-medium">Slug (optional)</span>
                <input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" />
              </label>
              <div>
                <div className="text-sm font-medium mb-1">Category Image</div>
                <div className="flex items-center gap-3">
                  {editing.image_url ? (
                    <div className="relative">
                      <img src={editing.image_url} alt="" className="w-20 h-20 rounded-lg object-cover border" />
                      <button type="button" onClick={() => setEditing({ ...editing, image_url: "" })} className="absolute -top-1 -right-1 bg-black/70 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed bg-muted/30" />
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="border px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-2 disabled:opacity-50">
                    <Upload className="w-3 h-3" />{uploading ? "Uploading…" : "Upload Image"}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files)} />
              </div>
              <label className="block text-sm"><span className="font-medium">Or paste Image URL</span>
                <input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" />
              </label>
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