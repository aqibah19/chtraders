import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / Terms" title="Terms & Conditions" />
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-sm">
        <p className="text-muted-foreground">Last updated: May 2026</p>
        {["Use of Site", "Orders & Payment", "Shipping & Delivery", "Returns & Warranty", "Limitation of Liability", "Governing Law"].map((h) => (
          <section key={h} className="mt-8">
            <h2 className="font-display text-xl font-bold">{h}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">By accessing CH TRADERS you agree to abide by our policies relating to {h.toLowerCase()}. All transactions are subject to applicable laws of the Islamic Republic of Pakistan.</p>
          </section>
        ))}
      </div>
    </div>
  );
}