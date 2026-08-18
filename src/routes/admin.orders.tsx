import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPKR } from "@/lib/products";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [open, setOpen] = useState<any | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Orders</h1>
      <div className="bg-card border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3"></th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-3">{o.customer_name}<div className="text-xs text-muted-foreground">{o.customer_phone}</div></td>
                <td className="p-3 font-semibold">{formatPKR(o.total)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => update(o.id, e.target.value)} className="px-2 py-1 rounded border bg-background text-xs">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-3"><button onClick={() => setOpen(o)} className="text-primary text-xs font-semibold">View</button></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="font-display text-xl font-bold mb-2">Order #{open.id.slice(0, 8).toUpperCase()}</h2>
            <div className="text-sm space-y-1 mb-4">
              <div><b>Customer:</b> {open.customer_name}</div>
              <div><b>Email:</b> {open.customer_email}</div>
              <div><b>Phone:</b> {open.customer_phone}</div>
              <div><b>Address:</b> {open.shipping_address}</div>
              <div><b>Payment:</b> {open.payment_method}</div>
            </div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-2 mb-4">
              {(open.items as any[]).map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-1">
                  <span>{i.name} × {i.qty}</span><span>{formatPKR(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>{formatPKR(open.total)}</span></div>
            <button onClick={() => setOpen(null)} className="mt-4 w-full py-2 rounded-full border">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}