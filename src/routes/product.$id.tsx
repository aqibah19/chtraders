import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { formatPKR, getProduct, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { useSiteSettings } from "@/lib/site-settings";
import { useProductImage, useProductGallery } from "@/lib/product-images";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

export const Route = createFileRoute("/product/$id")({ component: ProductPage });

function ProductPage() {
  const { id } = Route.useParams();
  const p = getProduct(id);
  const { state, dispatch } = useStore();
  const { displayOnly } = useSiteSettings();
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const dbImg = useProductImage(id);
  const gallery = useProductGallery(id);
  const [activeIdx, setActiveIdx] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setActiveIdx(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (!p) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-primary mt-3 inline-block">Back to shop</Link>
      </div>
    );
  }
  const wished = state.wishlist.includes(p.id);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{p.name}</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          {gallery.length > 0 ? (
            <Carousel setApi={setApi} opts={{ loop: gallery.length > 1 }} className="w-full">
              <CarouselContent>
                {gallery.map((url) => (
                  <CarouselItem key={url}>
                    <div className="aspect-square rounded-3xl overflow-hidden border bg-muted" onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
                      <div className={`w-full h-full transition-transform duration-500 ${zoom ? "scale-110" : "scale-100"}`}>
                        <ProductImage category={p.category} size="lg" src={url} fit="contain" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="aspect-square rounded-3xl overflow-hidden border bg-muted" onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
              <div className={`w-full h-full transition-transform duration-500 ${zoom ? "scale-110" : "scale-100"}`}>
                <ProductImage category={p.category} size="lg" src={p.image || dbImg} fit="contain" />
              </div>
            </div>
          )}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((url, idx) => (
                <button
                  key={url}
                  onClick={() => api?.scrollTo(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${idx === activeIdx ? "border-primary" : "border-transparent hover:border-muted-foreground/30"}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-xs uppercase tracking-[0.2em] text-primary">{p.category.replace(/-/g, " ")}</div>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name}</h1>
            {p.model && <span className="bg-muted border text-foreground text-xs font-semibold px-3 py-1 rounded-full">Model: {p.model}</span>}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(p.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}</div>
            <span className="text-sm text-muted-foreground">{p.rating} ({p.reviews} reviews)</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">{formatPKR(p.price)}</span>
            {p.oldPrice && <span className="text-muted-foreground line-through">{formatPKR(p.oldPrice)}</span>}
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed">{p.description}</p>

          {displayOnly ? (
            <div className="mt-8 p-4 bg-muted/40 rounded-xl text-sm text-muted-foreground border">
              This product is displayed for catalog purposes. Contact us to inquire about availability.
            </div>
          ) : (
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-muted rounded-l-full"><Minus className="w-4 h-4" /></button>
              <div className="w-12 text-center font-semibold">{qty}</div>
              <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-muted rounded-r-full"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => { dispatch({ type: "ADD", id: p.id, qty }); toast.success("Added to cart"); }} className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => { dispatch({ type: "TOGGLE_WISH", id: p.id }); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }} className={`p-3 rounded-full border ${wished ? "text-red-500 border-red-500" : "hover:border-primary"}`} aria-label="Wishlist">
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl"><Truck className="w-4 h-4 text-primary mt-0.5" /> <div><div className="font-semibold">Free Delivery</div><div className="text-xs text-muted-foreground">Orders over Rs 10,000</div></div></div>
            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl"><ShieldCheck className="w-4 h-4 text-primary mt-0.5" /> <div><div className="font-semibold">1-Year Warranty</div><div className="text-xs text-muted-foreground">Manufacturer backed</div></div></div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((r, i) => <ProductCard key={r.id} product={r} i={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}