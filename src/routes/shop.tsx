import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHeader } from "@/components/site/Layout";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/shop")({ component: ShopPage });

function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [max, setMax] = useState(40000);
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      p.price <= max &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [q, cat, max, sort]);

  return (
    <div>
      <PageHeader breadcrumb="Home / Shop" title="Shop All Products" subtitle="Browse the full CH TRADERS catalog of electronics & crockery." />
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="p-5 bg-card border rounded-2xl">
            <div className="font-semibold mb-3 flex items-center gap-2"><Search className="w-4 h-4" /> Search</div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
          </div>
          <div className="p-5 bg-card border rounded-2xl">
            <div className="font-semibold mb-3 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Category</div>
            <div className="space-y-1.5 text-sm">
              <button onClick={() => setCat("all")} className={`block w-full text-left px-2 py-1.5 rounded ${cat === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>All Products</button>
              {categories.map((c) => (
                <button key={c.slug} onClick={() => setCat(c.slug)} className={`block w-full text-left px-2 py-1.5 rounded ${cat === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{c.name}</button>
              ))}
            </div>
          </div>
          <div className="p-5 bg-card border rounded-2xl">
            <div className="font-semibold mb-3">Price: Up to Rs {max.toLocaleString()}</div>
            <input type="range" min={1000} max={40000} step={500} value={max} onChange={(e) => setMax(+e.target.value)} className="w-full accent-primary" />
          </div>
        </aside>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-sm text-muted-foreground">{list.length} products</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {list.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}