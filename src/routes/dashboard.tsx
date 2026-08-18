import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Package, Settings, ShoppingBag, User } from "lucide-react";
import { PageHeader } from "@/components/site/Layout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { state } = useStore();
  const stats = [
    { Icon: ShoppingBag, label: "Cart Items", value: state.cart.reduce((a, c) => a + c.qty, 0) },
    { Icon: Heart, label: "Wishlist", value: state.wishlist.length },
    { Icon: Package, label: "Orders", value: 3 },
    { Icon: User, label: "Loyalty Points", value: 240 },
  ];
  return (
    <div>
      <PageHeader breadcrumb="Home / Dashboard" title="My Account" subtitle="Welcome back, Hamza." />
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="bg-card border rounded-2xl p-4 h-fit">
          {[
            { to: "/dashboard", label: "Dashboard", Icon: User },
            { to: "/account", label: "My Account", Icon: Settings },
            { to: "/wishlist", label: "Wishlist", Icon: Heart },
            { to: "/cart", label: "Cart", Icon: ShoppingBag },
            { to: "/track", label: "Orders", Icon: Package },
          ].map((n) => (
            <Link key={n.to} to={n.to} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium">
              <n.Icon className="w-4 h-4 text-primary" /> {n.label}
            </Link>
          ))}
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium w-full text-left"><Settings className="w-4 h-4 text-primary" /> Settings</button>
        </aside>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border rounded-2xl p-5">
                <s.Icon className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4">Recent Orders</h3>
            <div className="divide-y text-sm">
              {[
                { id: "CH482910", date: "May 14, 2026", total: "Rs 9,300", status: "Delivered" },
                { id: "CH482156", date: "Apr 28, 2026", total: "Rs 3,100", status: "Delivered" },
                { id: "CH481903", date: "Apr 12, 2026", total: "Rs 15,500", status: "Delivered" },
              ].map((o) => (
                <div key={o.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">#{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{o.total}</div>
                    <div className="text-xs text-green-600">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}