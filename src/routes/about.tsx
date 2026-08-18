import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / About" title="About CH TRADERS" subtitle="Bringing premium electronics and crockery to every kitchen in Pakistan." />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Founded on Railway Road, Gujrat, CH TRADERS has grown into one of the region's most-trusted destinations for premium electronics and crockery. We carefully curate every product we stock — from heavy-duty commercial blenders to elegant dinner sets — so that every customer takes home equipment built to last.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {[
            { Icon: Heart, t: "Family Owned", s: "Three generations of trust" },
            { Icon: ShieldCheck, t: "Quality Promise", s: "Every product tested" },
            { Icon: Users, t: "12,500+ Customers", s: "Across all of Pakistan" },
            { Icon: Award, t: "Award Winning", s: "Best regional retailer 2024" },
          ].map((v) => (
            <div key={v.t} className="p-5 bg-card border rounded-2xl">
              <v.Icon className="w-8 h-8 text-primary mb-3" />
              <div className="font-bold">{v.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{v.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}