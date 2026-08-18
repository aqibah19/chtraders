import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Fingerprint } from "lucide-react";
import { getAuthenticationOptions, verifyAuthentication } from "@/lib/webauthn.functions";

import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const { loginAsDemoAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fpLoading, setFpLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Signed in!");
    const emailLower = data.user.email?.toLowerCase() ?? "";
    const isAdminUser = emailLower.includes("admin") || emailLower === "chhamza00024@gmail.com";
    navigate({ to: isAdminUser ? "/admin" : "/dashboard" });
  };

  const handleQuickAdmin = () => {
    loginAsDemoAdmin();
    navigate({ to: "/admin" });
  };

  const onFingerprint = async () => {
    if (!email) return toast.error("Enter your email first");
    setFpLoading(true);
    try {
      const { startAuthentication } = await import("@simplewebauthn/browser");
      const options = await getAuthenticationOptions({ email });
      const response = await startAuthentication({ optionsJSON: options as any });
      const { token_hash } = await verifyAuthentication({ email, response });
      const { error, data } = await supabase.auth.verifyOtp({ token_hash, type: "magiclink" });
      if (error || !data.user) throw new Error(error?.message ?? "Sign-in failed");
      toast.success("Signed in with fingerprint");
      const emailLower = data.user.email?.toLowerCase() ?? "";
      const isAdminUser = emailLower.includes("admin") || emailLower === "chhamza00024@gmail.com";
      navigate({ to: isAdminUser ? "/admin" : "/dashboard" });
    } catch (e: any) {
      toast.error(e?.message ?? "Fingerprint sign-in failed");
    } finally { setFpLoading(false); }
  };

  return (
    <div>
      <PageHeader breadcrumb="Home / Login" title="Welcome Back" subtitle="Sign in to your CH TRADERS account." />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <form onSubmit={onSubmit} className="bg-card border rounded-2xl p-8 space-y-4">
          <label className="block"><span className="text-sm font-medium">Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Password</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold disabled:opacity-60">{loading ? "Signing in..." : "Sign In"}</button>
          <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">or</span></div></div>
          <button type="button" onClick={onFingerprint} disabled={fpLoading} className="w-full border-2 border-primary text-primary py-3 rounded-full font-semibold disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition">
            <Fingerprint className="w-5 h-5" /> {fpLoading ? "Verifying..." : "Sign in with fingerprint"}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">Fingerprint works on devices where you've enabled it from My Account.</p>
          <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/signup" className="text-primary font-semibold">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
}