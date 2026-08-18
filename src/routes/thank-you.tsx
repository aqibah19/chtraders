import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, Package } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
  validateSearch: z.object({ order: z.string().optional() }),
});

function ThankYouPage() {
  const { order } = Route.useSearch();
  const orderId = order ?? "CH" + Math.floor(Math.random() * 900000 + 100000);
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 mx-auto rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h1 className="font-display text-4xl font-bold mt-6">Thank you for your order!</h1>
      <p className="text-muted-foreground mt-3">Your order <span className="font-bold text-primary">#{orderId}</span> has been placed successfully. We'll WhatsApp you a confirmation shortly.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/track" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold"><Package className="w-4 h-4" /> Track Order</Link>
        <button className="inline-flex items-center gap-2 border px-6 py-3 rounded-full font-semibold hover:bg-muted"><Download className="w-4 h-4" /> Download Invoice</button>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-muted-foreground hover:text-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}