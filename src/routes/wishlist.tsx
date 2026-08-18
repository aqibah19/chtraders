import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const { state } = useStore();
  const items = state.wishlist.map((id) => getProduct(id)!).filter(Boolean);

  return (
    <div>
      <PageHeader breadcrumb="Home / Wishlist" title="Your Wishlist" subtitle="The items you love, all in one place." />
      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your wishlist is empty.</p>
            <Link to="/shop" className="mt-4 inline-block text-primary font-semibold">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}