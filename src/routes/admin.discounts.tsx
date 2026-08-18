import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Percent, RotateCcw, Search } from "lucide-react";
import { formatPKR } from "@/lib/products";

export const Route = createFileRoute("/admin/discounts")({ component: AdminDiscounts });

type Product = { id: string; name: string; price: number; old_price: number | null };

function AdminDiscounts() {
  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [percent, setPercent] = useState<number>(10);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("products").select("id,name,price,old_price").order("name");
    if (error) return toast.error(error.message);
    setItems((data as Product[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const applyDiscount = async () => {
    if (selected.size === 0) return toast.error("Select at least one product");
    if (percent <= 0 || percent >= 100) return toast.error("Discount must be 1–99%");
    setBusy(true);
    let ok = 0, fail = 0;
    for (const id of selected) {
      const p = items.find((x) => x.id === id);
      if (!p) continue;
      const base = p.old_price ?? p.price;
      const newPrice = Math.round(base * (1 - percent / 100));
      const { error } = await supabase
        .from("products")
        .update({ old_price: base, price: newPrice })
        .eq("id", id);
      error ? fail++ : ok++;
    }
    setBusy(false);
    toast.success(`Discount applied to ${ok} product${ok === 1 ? "" : "s"}${fail ? ` (${fail} failed)` : ""}`);
    setSelected(new Set());
    load();
  };

  const removeDiscount = async () => {
    if (selected.size === 0) return toast.error("Select at least one product");
    setBusy(true);
    let ok = 0, fail = 0;
    for (const id of selected) {
      const p = items.find((x) => x.id === id);
      if (!p || p.old_price == null) continue;
      const { error } = await supabase
        .from("products")
        .update({ price: p.old_price, old_price: null })
        .eq("id", id);
      error ? fail++ : ok++;
    }
    setBusy(false);
    toast.success(`Reset ${ok} product${ok === 1 ? "" : "s"}${fail ? ` (${fail} failed)` : ""}`);
    setSelected(new Set());
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="font-display text-3xl font-bold">Discounts</h1>
        <div className="text-sm text-muted-foreground">{selected.size} selected</div>
      </div>

      <div className="bg-card border rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[140px]">
            <span className="text-xs font-medium text-muted-foreground">Discount %</span>
            <input
              type="number"
              min={1}
              max={99}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2 rounded-lg border bg-background"
            />
          </label>
          <button
            onClick={applyDiscount}
            disabled={busy}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Percent className="w-4 h-4" /> Apply Discount
          </button>
          <button
            onClick={removeDiscount}
            disabled={busy}
            className="border px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Original
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm"
          />
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Current</th>
              <th className="p-3">Original</th>
              <th className="p-3">Off</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const off = p.old_price && p.old_price > p.price
                ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
                : 0;
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{formatPKR(p.price)}</td>
                  <td className="p-3 text-muted-foreground">{p.old_price ? formatPKR(p.old_price) : "—"}</td>
                  <td className="p-3">{off ? <span className="text-primary font-semibold">{off}%</span> : "—"}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}