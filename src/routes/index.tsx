import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, Headphones, Sparkles, Star, Truck, ShieldCheck, Timer } from "lucide-react";
import * as Icons from "lucide-react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Counter } from "@/components/site/Counter";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({ component: HomePage });

const slides = [
  { eyebrow: "Premium Kitchen Series", title: "Crafted for the\nmodern kitchen.", sub: "Discover juicers, blenders & cookware engineered for everyday brilliance.", cta: "Shop the Edit" },
  { eyebrow: "Flash Sale Live", title: "Up to 30% off\nelectric kettles.", sub: "Limited stock on Panasonic, Kenwood and STC steel kettles.", cta: "Grab the Deal" },
  { eyebrow: "Just Landed", title: "Sound Proof\nCommercial Blender.", sub: "Whisper-quiet power for professional cafés and juice bars.", cta: "Discover Now" },
];

function ProductTile({ slug }: { slug: string }) {
  const meta = categories.find((c) => c.slug === slug);
  const Icon = (Icons[(meta?.icon ?? "Package") as keyof typeof Icons] ?? Icons.Package) as any;
  return (
    <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
      <Icon className="w-20 h-20 text-white/90" strokeWidth={1.2} />
    </div>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 brand-gradient" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.12 85 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.5 0.2 270 / 0.4), transparent 40%)" }} />
      <div className="relative container mx-auto px-4 py-20 md:py-32 grid lg:grid-cols-2 gap-12 items-center text-white">
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs uppercase tracking-[0.2em] text-gold mb-6">
            <Sparkles className="w-3 h-3" /> {s.eyebrow}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] whitespace-pre-line">{s.title}</h1>
          <p className="mt-5 text-lg text-white/80 max-w-md">{s.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="group inline-flex items-center gap-2 bg-gold text-primary px-6 py-3.5 rounded-full font-semibold hover:scale-105 transition">
              {s.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/categories" className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-full font-semibold hover:bg-white/20 transition">Browse Categories</Link>
          </div>
          <div className="mt-10 flex gap-2">
            {slides.map((_, k) => (
              <button key={k} onClick={() => setI(k)} className={`h-1 rounded-full transition-all ${k === i ? "w-10 bg-gold" : "w-4 bg-white/30"}`} />
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative h-[420px] hidden lg:block">
          <div className="absolute inset-0 grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p, k) => (
              <motion.div key={p.id} animate={{ y: [0, k % 2 ? -10 : 10, 0] }} transition={{ duration: 4 + k, repeat: Infinity, ease: "easeInOut" }} className="glass rounded-3xl overflow-hidden">
                <div className="aspect-square"><ProductTile slug={p.category} /></div>
                <div className="p-3 text-xs">
                  <div className="font-semibold truncate text-white">{p.name}</div>
                  <div className="text-gold">Rs {p.price.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{eyebrow}</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      {link && <Link to={link} className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="w-4 h-4" /></Link>}
    </div>
  );
}

function HomePage() {
  const [dbCats, setDbCats] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from("categories").select("slug,image_url").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((c: any) => { if (c.image_url) map[c.slug] = c.image_url; });
      setDbCats(map);
    });
  }, []);

  const featured = products.filter((p) => p.badge === "Premium" || p.badge === "Best Seller").slice(0, 8);
  const trending = products.slice(4, 12);
  const bestsellers = products.filter((p) => p.badge === "Best Seller");
  const flash = products.filter((p) => p.badge === "Flash Sale");

  return (
    <div>
      <Hero />

      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck, t: "Free Delivery", s: "On orders over Rs 10,000" },
            { Icon: ShieldCheck, t: "1-Year Warranty", s: "On all electronics" },
            { Icon: Headphones, t: "24/7 Support", s: "WhatsApp: 0306 6294012" },
            { Icon: Award, t: "Trusted in Gujrat", s: "Since 2015" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>
              <div>
                <div className="font-semibold text-sm">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <SectionHeader eyebrow="Shop by Category" title="Explore our world" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
          {categories.map((c, i) => {
            const Icon = (Icons[c.icon as keyof typeof Icons] ?? Icons.Package) as any;
            const img = dbCats[c.slug];
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link to="/categories/$slug" params={{ slug: c.slug }} className="group block p-5 bg-card rounded-2xl border hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                  <div className="mx-auto w-14 h-14 rounded-xl brand-gradient flex items-center justify-center text-white mb-3 group-hover:scale-110 transition overflow-hidden">
                    {img ? <img src={img} alt={c.name} className="w-full h-full object-cover" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="font-semibold text-sm">{c.name}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <SectionHeader eyebrow="Editor's Pick" title="Featured Products" link="/shop" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 md:mt-10">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="rounded-3xl brand-gradient p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold mb-3"><Timer className="w-3 h-3" /> Flash Sale</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Steel Kettles<br/>at Rs 1,000 only.</h2>
              <p className="mt-4 text-white/80 text-sm sm:text-base">Limited-time pricing on Panasonic, Kenwood and STC. While stocks last.</p>
              <Link to="/categories/$slug" params={{ slug: "kettles" }} className="mt-6 inline-flex items-center gap-2 bg-gold text-primary px-6 py-3 rounded-full font-semibold hover:scale-105 transition">Shop Kettles <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {flash.slice(0, 3).map((p) => (
                <div key={p.id} className="glass rounded-2xl overflow-hidden">
                  <div className="aspect-square"><ProductTile slug={p.category} /></div>
                  <div className="p-3 text-xs">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-gold font-bold">Rs {p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <SectionHeader eyebrow="What's Hot" title="Trending Now" link="/shop" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 md:mt-10">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <SectionHeader eyebrow="Customer Favorites" title="Best Sellers" link="/shop" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 md:mt-10">
          {bestsellers.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: 12500, s: "+", l: "Happy Customers" },
            { n: 350, s: "+", l: "Products" },
            { n: 50, s: "+", l: "Brands" },
            { n: 10, s: " yrs", l: "Of Trust" },
          ].map((c) => (
            <div key={c.l}>
              <div className="font-display text-4xl md:text-5xl font-bold text-gold"><Counter to={c.n} suffix={c.s} /></div>
              <div className="mt-2 text-sm opacity-80">{c.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <SectionHeader eyebrow="Reviews" title="Loved by thousands" />
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { n: "Ayesha K.", c: "Lahore", t: "The 3-in-1 juicer is fantastic. Smooth delivery and the staff guided me on WhatsApp." },
            { n: "Hamza R.", c: "Gujrat", t: "Best prices on cookware in the city. Quality matches international brands." },
            { n: "Sara M.", c: "Karachi", t: "Air fryer arrived in perfect condition. Packaging was beautiful." },
          ].map((r, i) => (
            <motion.div key={r.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-card border rounded-2xl">
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-muted-foreground">"{r.t}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full brand-gradient text-white flex items-center justify-center font-bold">{r.n[0]}</div>
                <div>
                  <div className="font-semibold text-sm">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/40 overflow-hidden">
        <div className="container mx-auto px-4 py-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {["Panasonic", "Kenwood", "Reona", "Dynasty", "HAA", "STC"].map((b) => (
            <div key={b} className="font-display text-2xl md:text-3xl font-bold text-muted-foreground/60 hover:text-primary transition cursor-default">{b}</div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl bg-card border p-10 md:p-14 text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Stay in the loop</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Get 10% off your first order</h2>
          <p className="mt-3 text-muted-foreground">Sign up for new arrivals, flash sales and Gujrat-only promos.</p>
          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" required placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-full border bg-background" />
            <button className="px-6 py-3 rounded-full brand-gradient text-white font-semibold hover:opacity-90 transition">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}