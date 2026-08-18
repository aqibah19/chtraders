import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, getByCategory } from "@/lib/products";
import * as Icons from "lucide-react";
import { PageHeader } from "@/components/site/Layout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({ component: CategoriesPage });

function CategoriesPage() {
  const [dbCats, setDbCats] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from("categories").select("slug,image_url").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((c: any) => { if (c.image_url) map[c.slug] = c.image_url; });
      setDbCats(map);
    });
  }, []);
  return (
    <div>
      <PageHeader breadcrumb="Home / Categories" title="Shop by Category" subtitle="Find exactly what your kitchen needs." />
      <div className="container mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c, i) => {
          const Icon = (Icons[c.icon as keyof typeof Icons] ?? Icons.Package) as any;
          const count = getByCategory(c.slug).length;
          const img = dbCats[c.slug];
          return (
            <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to="/categories/$slug" params={{ slug: c.slug }} className="group block p-6 bg-card border rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl brand-gradient text-white flex items-center justify-center group-hover:scale-110 transition overflow-hidden">
                    {img ? <img src={img} alt={c.name} className="w-full h-full object-cover" /> : <Icon className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{count} products</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}