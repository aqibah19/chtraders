import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({ component: FAQPage });

const faqs = [
  { q: "Do you deliver outside Gujrat?", a: "Yes — we deliver across Pakistan via our courier partners, usually within 2–4 business days." },
  { q: "What is your return policy?", a: "Electronics carry a 7-day return window for unopened items, and a 1-year warranty on manufacturing defects." },
  { q: "Which payment methods do you accept?", a: "Cash on Delivery, JazzCash, Easypaisa, and major credit / debit cards." },
  { q: "How do I track my order?", a: "Use our Track Order page or message us on WhatsApp at 0306 6294012." },
  { q: "Do you offer wholesale pricing?", a: "Yes — contact us directly for commercial / wholesale enquiries." },
];

function FAQPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / FAQ" title="Frequently Asked" subtitle="Everything you need to know about ordering from CH TRADERS." />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Accordion type="single" collapsible className="bg-card border rounded-2xl divide-y">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="px-5">
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}