import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { formatPKR, getProduct } from "@/lib/products";
import { ProductImage } from "@/components/site/ProductImage";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { state, dispatch } = useStore();
  const { displayOnly } = useSiteSettings();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  if (displayOnly) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold">Shopping is currently disabled</h1>
        <p className="text-muted-foreground mt-2">The store is in display-only mode. Browse our products and contact us to order.</p>
        <Link to="/shop" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold">Browse Products</Link>
      </div>
    );
  }

  const items = state.cart.map((c) => ({ ...c, product: getProduct(c.id)! })).filter((c) => c.product);
  const subtotal = items.reduce((a, c) => a + c.product.price * c.qty, 0);
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "CH10") { setDiscount(Math.round(subtotal * 0.1)); toast.success("10% coupon applied"); }
    else { setDiscount(0); toast.error("Invalid coupon. Try CH10"); }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Start shopping to fill it up.</p>
        <Link to="/shop" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 grid lg:grid-cols-[1fr_380px] gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-card border rounded-2xl divide-y">
          {items.map((c) => (
            <div key={c.id} className="p-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0"><ProductImage category={c.product.category} size="sm" /></div>
              <div className="flex-1 min-w-0">
                <Link to="/product/$id" params={{ id: c.id }} className="font-semibold hover:text-primary truncate block">{c.product.name}</Link>
                <div className="text-sm text-muted-foreground">{formatPKR(c.product.price)}</div>
              </div>
              <div className="flex items-center border rounded-full">
                <button onClick={() => dispatch({ type: "SET_QTY", id: c.id, qty: c.qty - 1 })} className="p-2"><Minus className="w-3 h-3" /></button>
                <div className="w-8 text-center text-sm font-semibold">{c.qty}</div>
                <button onClick={() => dispatch({ type: "SET_QTY", id: c.id, qty: c.qty + 1 })} className="p-2"><Plus className="w-3 h-3" /></button>
              </div>
              <div className="w-24 text-right font-semibold">{formatPKR(c.product.price * c.qty)}</div>
              <button onClick={() => dispatch({ type: "REMOVE", id: c.id })} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <aside className="bg-card border rounded-2xl p-6 h-fit sticky top-28">
        <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex gap-2 mb-4">
          <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (try CH10)" className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
          <button onClick={applyCoupon} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Apply</button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPKR(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPKR(discount)}</span></div>}
          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{formatPKR(total)}</span></div>
        </div>
        <Link to="/checkout" className="mt-6 block text-center bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:opacity-90 transition">Proceed to Checkout</Link>
        <Link to="/shop" className="mt-2 block text-center text-sm text-muted-foreground hover:text-primary">Continue shopping</Link>
      </aside>
    </div>
  );
}