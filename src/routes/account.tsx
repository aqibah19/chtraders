import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/Layout";
import { toast } from "sonner";
import { Loader2, User as UserIcon, KeyRound, Fingerprint, Trash2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getRegistrationOptions, verifyRegistration, listMyCredentials, deleteCredential } from "@/lib/webauthn.functions";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [creds, setCreds] = useState<{ id: string; created_at: string }[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const getOpts = useServerFn(getRegistrationOptions);
  const verifyReg = useServerFn(verifyRegistration);
  const listCreds = useServerFn(listMyCredentials);
  const delCred = useServerFn(deleteCredential);

  const loadCreds = async () => {
    try { setCreds(await listCreds({ data: {} as any })); } catch { /* noop */ }
  };
  useEffect(() => { if (user) loadCreds(); }, [user]);

  const enrollFingerprint = async () => {
    setEnrolling(true);
    try {
      const { startRegistration } = await import("@simplewebauthn/browser");
      const options = await getOpts({ data: {} as any });
      const response = await startRegistration({ optionsJSON: options as any });
      await verifyReg({ data: { response } });
      toast.success("Fingerprint enabled");
      loadCreds();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not enable fingerprint");
    } finally { setEnrolling(false); }
  };

  const removeCred = async (id: string) => {
    if (!window.confirm("Remove this fingerprint device?")) return;
    await delCred({ data: { id } });
    toast.success("Removed");
    loadCreds();
  };

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,phone,address").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setFullName(data.full_name ?? ""); setPhone(data.phone ?? ""); setAddress(data.address ?? ""); }
    });
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone, address }).eq("user_id", user.id);
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPwd(false);
    if (error) return toast.error(error.message);
    setPassword(""); setConfirm("");
    toast.success("Password updated");
  };

  if (loading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <PageHeader breadcrumb="Home / My Account" title="My Account" subtitle="Update your profile and security settings." />
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-6 max-w-4xl">
        <form onSubmit={saveProfile} className="bg-card border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2"><UserIcon className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-bold">Profile</h2></div>
          <Field label="Email"><input value={user.email ?? ""} disabled className="mt-1 w-full px-3 py-2 rounded-lg border bg-muted text-sm" /></Field>
          <Field label="Full Name"><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
          <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
          <Field label="Address"><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
          <button disabled={savingProfile} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold disabled:opacity-50">{savingProfile ? "Saving..." : "Save Profile"}</button>
        </form>

        <form onSubmit={savePassword} className="bg-card border rounded-2xl p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-2"><KeyRound className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-bold">Change Password</h2></div>
          <Field label="New Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
          <Field label="Confirm Password"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
          <button disabled={savingPwd} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold disabled:opacity-50">{savingPwd ? "Updating..." : "Update Password"}</button>
        </form>

        <div className="bg-card border rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-1"><Fingerprint className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-bold">Fingerprint Sign-In</h2></div>
          <p className="text-sm text-muted-foreground">Enable fingerprint, Face ID, or device PIN on this device. Next time you can sign in without typing your password.</p>
          <button onClick={enrollFingerprint} disabled={enrolling} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold disabled:opacity-50 inline-flex items-center gap-2">
            <Fingerprint className="w-4 h-4" /> {enrolling ? "Setting up..." : "Enable fingerprint on this device"}
          </button>
          {creds.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-sm font-medium">Enrolled devices</div>
              {creds.map((c) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
                  <span>Device added {new Date(c.created_at).toLocaleDateString()}</span>
                  <button onClick={() => removeCred(c.id)} className="text-destructive hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="font-medium">{label}</span>{children}</label>;
}