import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const DEMO_ADMIN_USER: User = {
  id: "demo-admin-id",
  email: "admin@chtraders.com",
  app_metadata: {},
  user_metadata: { full_name: "Aqib Ahmed (Admin)" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsDemoAdmin: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  loginAsDemoAdmin: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoUser, setDemoUser] = useState<User | null>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("ch_demo_admin") === "true") {
      return DEMO_ADMIN_USER;
    }
    return null;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginAsDemoAdmin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ch_demo_admin", "true");
    }
    setDemoUser(DEMO_ADMIN_USER);
    setIsAdmin(true);
    toast.success("Logged in as Admin!");
  };

  const checkAdmin = async (u: User) => {
    const emailLower = u.email?.toLowerCase() ?? "";
    if (emailLower.includes("admin") || emailLower === "chhamza00024@gmail.com" || u.id === "demo-admin-id") {
      setIsAdmin(true);
      return;
    }
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setDemoUser(null);
        if (typeof window !== "undefined") localStorage.removeItem("ch_demo_admin");
        setTimeout(() => checkAdmin(s.user), 0);
      } else if (!demoUser) {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        setDemoUser(null);
        if (typeof window !== "undefined") localStorage.removeItem("ch_demo_admin");
        await checkAdmin(s.user);
      } else if (typeof window !== "undefined" && localStorage.getItem("ch_demo_admin") === "true") {
        setDemoUser(DEMO_ADMIN_USER);
        setIsAdmin(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [demoUser]);

  const signOut = async () => {
    if (typeof window !== "undefined") localStorage.removeItem("ch_demo_admin");
    setDemoUser(null);
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  const activeUser = demoUser ?? session?.user ?? null;
  const activeIsAdmin = isAdmin || !!demoUser;

  return (
    <Ctx.Provider value={{ user: activeUser, session, isAdmin: activeIsAdmin, loading, signOut, loginAsDemoAdmin }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);