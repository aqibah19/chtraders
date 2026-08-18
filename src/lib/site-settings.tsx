import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Ctx = { displayOnly: boolean; loading: boolean; refresh: () => Promise<void> };
const SiteSettingsCtx = createContext<Ctx>({ displayOnly: false, loading: true, refresh: async () => {} });

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [displayOnly, setDisplayOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase.from("site_settings").select("display_only").limit(1).maybeSingle();
    setDisplayOnly(!!data?.display_only);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel("site_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return <SiteSettingsCtx.Provider value={{ displayOnly, loading, refresh }}>{children}</SiteSettingsCtx.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsCtx);