import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useSiteSettings } from "@/lib/site-settings";
import { formatPKR, type Product } from "@/lib/products";
import { ProductImage } from "./ProductImage";
import { useProductImage } from "@/lib/product-images";

export function ProductCard({ product, i = 0 }: { product: Product; i?: number }) {
  const { state, dispatch } = useStore();
  const { displayOnly } = useSiteSettings();
  const wished = state.wishlist.includes(product.id);
  const dbImg = useProductImage(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
      className="group relative bg-card rounded-2xl border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="aspect-square relative overflow-hidden">
          <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
            <ProductImage category={product.category} size="lg" src={dbImg} />
          </div>
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          {!displayOnly && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: "TOGGLE_WISH", id: product.id });
                  toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition ${wished ? "text-red-500" : "text-foreground hover:text-red-500"}`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
              </button>
              <div className="absolute inset-x-3 bottom-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "ADD", id: product.id });
                    toast.success(`Added ${product.name} to cart`);
                  }}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.category.replace(/-/g, " ")}</div>
          <h3 className="mt-1 font-semibold text-sm line-clamp-1">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
            ))}
            <span className="text-muted-foreground ml-1">({product.reviews})</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPKR(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatPKR(product.oldPrice)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}