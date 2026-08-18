import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/track")({ component: TrackPage });

function TrackPage() {
  const [id, setId] = useState("");
  const [show, setShow] = useState(false);

  const steps = [
    { t: "Order Placed", d: "May 20, 2026 • 10:24 AM", done: true },
    { t: "Payment Confirmed", d: "May 20, 2026 • 10:26 AM", done: true },
    { t: "Packed & Dispatched", d: "May 21, 2026 • 09:10 AM", done: true },
    { t: "Out for Delivery", d: "Estimated today", done: false, current: true },
    { t: "Delivered", d: "Pending", done: false },
  ];

  return (
    <div>
      <PageHeader breadcrumb="Home / Track Order" title="Track Your Order" subtitle="Enter your order ID to view live status." />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); setShow(true); }} className="flex gap-2">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID e.g. CH482910" required className="flex-1 px-4 py-3 rounded-full border bg-background" />
          <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">Track</button>
        </form>
        {show && (
          <div className="mt-10 bg-card border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <div className="font-bold">Order #{id}</div>
                <div className="text-xs text-muted-foreground">Expected delivery: Today</div>
              </div>
            </div>
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  {s.done ? <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> : <Circle className={`w-6 h-6 shrink-0 ${s.current ? "text-primary animate-pulse" : "text-muted-foreground/40"}`} />}
                  <div>
                    <div className={`font-semibold ${s.current ? "text-primary" : ""}`}>{s.t}</div>
                    <div className="text-xs text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}