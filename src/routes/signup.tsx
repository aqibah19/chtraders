import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: form.full_name } },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }
    if (data.user && form.phone) {
      await supabase.from("profiles").update({ phone: form.phone, full_name: form.full_name }).eq("user_id", data.user.id);
    }
    setLoading(false);
    toast.success("Account created!");
    const emailLower = form.email.toLowerCase();
    const isAdminUser = emailLower.includes("admin") || emailLower === "chhamza00024@gmail.com";
    navigate({ to: isAdminUser ? "/admin" : "/dashboard" });
  };

  return (
    <div>
      <PageHeader breadcrumb="Home / Sign Up" title="Create Account" subtitle="Join CH TRADERS for exclusive offers." />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <form onSubmit={onSubmit} className="bg-card border rounded-2xl p-8 space-y-4">
          <label className="block"><span className="text-sm font-medium">Full Name</span><input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Email</span><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Phone</span><input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Password</span><input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold disabled:opacity-60">{loading ? "Creating..." : "Create Account"}</button>
          <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-semibold">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}