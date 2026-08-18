import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / Privacy" title="Privacy Policy" />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground">Last updated: May 2026</p>
        {["Data We Collect", "How We Use Data", "Cookies", "Third-Party Services", "Your Rights"].map((h) => (
          <section key={h} className="mt-8">
            <h2 className="font-display text-xl font-bold">{h}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">CH TRADERS respects your privacy. We only collect the data necessary to fulfil your orders and improve your shopping experience.</p>
          </section>
        ))}
      </div>
    </div>
  );
}