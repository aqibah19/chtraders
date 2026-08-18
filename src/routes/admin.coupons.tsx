import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({ component: AdminCoupons });

function AdminCoupons() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ code: "", discount_percent: 10 });

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.code) return;
    const { error } = await supabase.from("coupons").insert({ code: form.code.toUpperCase(), discount_percent: form.discount_percent, active: true });
    if (error) return toast.error(error.message);
    setForm({ code: "", discount_percent: 10 });
    toast.success("Added");
    load();
  };
  const toggle = async (c: any) => {
    await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Coupons</h1>
      <div className="bg-card border rounded-2xl p-4 grid sm:grid-cols-3 gap-2">
        <input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="px-3 py-2 rounded-lg border bg-background text-sm uppercase" />
        <input type="number" min={1} max={100} placeholder="% off" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} className="px-3 py-2 rounded-lg border bg-background text-sm" />
        <button onClick={add} className="bg-primary text-primary-foreground rounded-full text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Active</th><th className="p-3"></th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-mono font-bold">{c.code}</td>
                <td className="p-3">{c.discount_percent}%</td>
                <td className="p-3"><button onClick={() => toggle(c)} className={`px-2 py-1 rounded-full text-xs ${c.active ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{c.active ? "Active" : "Disabled"}</button></td>
                <td className="p-3 text-right"><button onClick={() => del(c.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}