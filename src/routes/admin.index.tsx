import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Boxes, ListOrdered, Users, DollarSign, Eye, ShoppingCart } from "lucide-react";
import { formatPKR } from "@/lib/products";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [displayOnly, setDisplayOnly] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, o, u, r, s] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("site_settings").select("id, display_only").limit(1).maybeSingle(),
      ]);
      const revenue = (r.data ?? []).reduce((a: number, x: any) => a + Number(x.total || 0), 0);
      setStats({ products: p.count ?? 0, orders: o.count ?? 0, users: u.count ?? 0, revenue });
      if (s.data) { setSettingId(s.data.id); setDisplayOnly(!!s.data.display_only); }
    })();
  }, []);

  const toggleDisplayOnly = async (val: boolean) => {
    setSaving(true);
    const prev = displayOnly;
    setDisplayOnly(val);
    let error;
    if (settingId) {
      ({ error } = await supabase.from("site_settings").update({ display_only: val }).eq("id", settingId));
    } else {
      const res = await supabase.from("site_settings").insert({ display_only: val }).select("id").single();
      error = res.error;
      if (res.data) setSettingId(res.data.id);
    }
    setSaving(false);
    if (error) { setDisplayOnly(prev); toast.error(error.message); }
    else toast.success(val ? "Display-only mode enabled" : "Shop mode enabled");
  };

  const cards = [
    { label: "Products", value: stats.products, Icon: Boxes, color: "from-blue-500 to-indigo-600" },
    { label: "Orders", value: stats.orders, Icon: ListOrdered, color: "from-amber-500 to-orange-600" },
    { label: "Customers", value: stats.users, Icon: Users, color: "from-emerald-500 to-teal-600" },
    { label: "Revenue", value: formatPKR(stats.revenue), Icon: DollarSign, color: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's an overview of your store.</p>
      </div>
      <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayOnly ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
          {displayOnly ? <Eye className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{displayOnly ? "Display-only mode" : "Full shop mode"}</div>
          <div className="text-sm text-muted-foreground">
            {displayOnly
              ? "Cart, checkout, and wishlist are hidden. Visitors can browse products only."
              : "Cart, checkout, coupons, and wishlist are all active."}
          </div>
        </div>
        <Switch checked={displayOnly} onCheckedChange={toggleDisplayOnly} disabled={saving} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.color} opacity-20`} />
            <c.Icon className="w-6 h-6 text-primary mb-3" />
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}