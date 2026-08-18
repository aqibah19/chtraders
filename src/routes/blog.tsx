import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog")({ component: BlogPage });

const posts = [
  { t: "How to choose the right juicer for your home", c: "Juicers", d: "May 18, 2026", e: "From slow press to centrifugal — here's our quick guide." },
  { t: "5 cookware care tips that double its life", c: "Cookware", d: "May 10, 2026", e: "Small habits, big difference." },
  { t: "Why commercial blenders are worth the upgrade", c: "Blenders", d: "Apr 30, 2026", e: "If you run a café, this is for you." },
  { t: "Crockery trends 2026: bold colours are back", c: "Crockery", d: "Apr 22, 2026", e: "Our editors pick the styles to watch." },
  { t: "Air fryer recipes the whole family will love", c: "Air Fryers", d: "Apr 15, 2026", e: "Healthier, faster and tastier." },
  { t: "Steam iron vs. dry iron: which is best for you?", c: "Irons", d: "Apr 4, 2026", e: "A simple breakdown." },
];

function BlogPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / Blog" title="The CH TRADERS Journal" subtitle="Stories, guides and tips for the modern kitchen." />
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <motion.article key={p.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
            <div className="aspect-[16/10] brand-gradient relative">
              <span className="absolute top-3 left-3 bg-white text-primary text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide">{p.c}</span>
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">{p.d}</div>
              <h3 className="font-display text-lg font-bold mt-1">{p.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{p.e}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}