import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 brand-gradient opacity-95" />
      <div className="relative container mx-auto px-4 py-16 md:py-20 text-white">
        {breadcrumb && <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">{breadcrumb}</div>}
        <h1 className="font-display text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-3 text-white/80 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}