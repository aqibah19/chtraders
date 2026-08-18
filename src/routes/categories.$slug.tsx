import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, getByCategory } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/categories/$slug")({ component: CategoryPage });

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  const items = getByCategory(slug);
  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link to="/categories" className="text-primary mt-3 inline-block">Back to categories</Link>
      </div>
    );
  }
  return (
    <div>
      <PageHeader breadcrumb={`Home / Categories / ${cat.name}`} title={cat.name} subtitle={`${items.length} products in ${cat.name.toLowerCase()}.`} />
      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products yet in this category.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}