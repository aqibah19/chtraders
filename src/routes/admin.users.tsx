import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, ShieldOff, Ban, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    setUsers((profiles ?? []).map((p: any) => ({ ...p, roles: roleMap.get(p.user_id) ?? [] })));
  };
  useEffect(() => { load(); }, []);

  const toggleBan = async (u: any) => {
    await supabase.from("profiles").update({ banned: !u.banned }).eq("id", u.id);
    toast.success(u.banned ? "Unbanned" : "Banned");
    load();
  };
  const toggleAdmin = async (u: any) => {
    if (u.roles.includes("admin")) {
      await supabase.from("user_roles").delete().eq("user_id", u.user_id).eq("role", "admin");
      toast.success("Demoted");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: u.user_id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Promoted to admin");
    }
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <div className="bg-card border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Roles</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.full_name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone || "—"}</td>
                <td className="p-3">{u.roles.join(", ") || "customer"}</td>
                <td className="p-3">{u.banned ? <span className="text-destructive text-xs">Banned</span> : <span className="text-emerald-600 text-xs">Active</span>}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => toggleAdmin(u)} className="p-2 hover:text-primary" title={u.roles.includes("admin") ? "Demote" : "Promote to admin"}>
                    {u.roles.includes("admin") ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toggleBan(u)} className="p-2 hover:text-destructive" title={u.banned ? "Unban" : "Ban"}>
                    {u.banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}