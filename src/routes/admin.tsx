import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Boxes, LayoutDashboard, ListOrdered, Tag, Ticket, Users, Loader2, Percent } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/discounts", label: "Discounts", icon: Percent },
  { to: "/admin/orders", label: "Orders", icon: ListOrdered },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/users", label: "Users", icon: Users },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-card border rounded-2xl p-4 h-fit lg:sticky lg:top-24">
          <div className="px-2 pb-3 mb-3 border-b">
            <div className="font-display text-lg font-bold">Admin Panel</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <nav className="space-y-1">
            {links.map((l) => {
              const active = l.exact ? path === l.to : path.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <l.icon className="w-4 h-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0"><Outlet /></main>
      </div>
    </div>
  );
}