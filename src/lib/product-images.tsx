import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Ctx = { map: Record<string, string>; gallery: Record<string, string[]>; loading: boolean };
const ProductImagesCtx = createContext<Ctx>({ map: {}, gallery: {}, loading: true });

export function ProductImagesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("products").select("slug,image_url,images");
      const m: Record<string, string> = {};
      const g: Record<string, string[]> = {};
      (data ?? []).forEach((p: any) => {
        if (!p.slug) return;
        const imgs: string[] = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
        const main = p.image_url || imgs[0];
        if (main) m[p.slug] = main;
        const all = Array.from(new Set([main, ...imgs].filter(Boolean))) as string[];
        if (all.length) g[p.slug] = all;
      });
      setMap(m);
      setGallery(g);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel("products_image_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return <ProductImagesCtx.Provider value={{ map, gallery, loading }}>{children}</ProductImagesCtx.Provider>;
}

export const useProductImage = (slug: string) => useContext(ProductImagesCtx).map[slug];
export const useProductGallery = (slug: string) => useContext(ProductImagesCtx).gallery[slug] ?? [];
