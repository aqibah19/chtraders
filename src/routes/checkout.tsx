import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Truck, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPKR, getProduct } from "@/lib/products";
import { PageHeader } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSiteSettings } from "@/lib/site-settings";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { state, dispatch } = useStore();
  const { user } = useAuth();
  const { displayOnly } = useSiteSettings();
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  const items = state.cart.map((c) => ({ ...c, product: getProduct(c.id)! })).filter((c) => c.product);
  const subtotal = items.reduce((a, c) => a + c.product.price * c.qty, 0);
  const shipping = subtotal > 10000 ? 0 : 350;
  const total = subtotal + shipping;

  if (displayOnly) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Checkout is disabled</h1>
        <p className="text-muted-foreground mt-2">The store is in display-only mode. Please contact us to place an order.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader breadcrumb="Home / Checkout" title="Checkout" subtitle="Just one more step away from delivery." />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (items.length === 0) return;
          setSubmitting(true);
          const { data, error } = await supabase.from("orders").insert({
            user_id: user?.id ?? null,
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            shipping_address: `${form.address}, ${form.city} ${form.postal}`,
            items: items.map((i) => ({ id: i.id, name: i.product.name, qty: i.qty, price: i.product.price })),
            subtotal,
            total,
            payment_method: method,
            status: "pending",
          }).select("id").single();
          setSubmitting(false);
          if (error) { toast.error(error.message); return; }
          dispatch({ type: "CLEAR" });
          navigate({ to: "/thank-you", search: { order: data.id.slice(0, 8).toUpperCase() } });
        }}
        className="container mx-auto px-4 py-12 grid lg:grid-cols-[1fr_380px] gap-8"
      >
        <div className="space-y-6">
          <Section title="Contact Information">
            <Field label="Full Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Phone" type="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </Section>
          <Section title="Shipping Address">
            <Field label="Address" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="Postal Code" required value={form.postal} onChange={(v) => setForm({ ...form, postal: v })} />
            </div>
          </Section>
          <Section title="Payment Method">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "cod", Icon: Truck, label: "Cash on Delivery" },
                { id: "card", Icon: CreditCard, label: "Credit / Debit Card" },
                { id: "wallet", Icon: Wallet, label: "JazzCash / Easypaisa" },
              ].map((m) => (
                <label key={m.id} className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center gap-2 transition ${method === m.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
                  <input type="radio" name="pm" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                  <m.Icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-center">{m.label}</span>
                </label>
              ))}
            </div>
          </Section>
        </div>
        <aside className="bg-card border rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-64 overflow-auto mb-4">
            {items.map((c) => (
              <div key={c.id} className="flex justify-between text-sm">
                <span className="truncate pr-2">{c.product.name} × {c.qty}</span>
                <span className="font-semibold whitespace-nowrap">{formatPKR(c.product.price * c.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-primary">{formatPKR(total)}</span></div>
          </div>
          <button disabled={items.length === 0 || submitting} className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold disabled:opacity-50 hover:opacity-90 transition">{submitting ? "Placing..." : "Place Order"}</button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-2xl p-6">
      <h3 className="font-display text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, type = "text", required = false, value, onChange }: { label: string; type?: string; required?: boolean; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}</span>
      <input type={type} required={required} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" />
    </label>
  );
}