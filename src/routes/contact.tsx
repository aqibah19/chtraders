import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / Contact" title="Get in Touch" subtitle="We'd love to help. Reach us by phone, email or visit the showroom." />
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[
            { Icon: MapPin, t: "Visit Us", s: "Railway Road, Gujrat, Pakistan" },
            { Icon: Phone, t: "Call Us", s: "0306 6294012" },
            { Icon: Mail, t: "Email Us", s: "Chhamza00024@gmail.com" },
          ].map((c) => (
            <div key={c.t} className="p-5 bg-card border rounded-2xl flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl brand-gradient text-white flex items-center justify-center"><c.Icon className="w-5 h-5" /></div>
              <div>
                <div className="font-bold">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.s}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl overflow-hidden border h-64">
            <iframe title="Map" className="w-full h-full" src="https://www.google.com/maps?q=Railway+Road+Gujrat+Pakistan&output=embed" loading="lazy" />
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent!"); }} className="bg-card border rounded-2xl p-6 space-y-4 h-fit">
          <h3 className="font-display text-xl font-bold">Send us a message</h3>
          <label className="block"><span className="text-sm font-medium">Name</span><input required className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Email</span><input type="email" required className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <label className="block"><span className="text-sm font-medium">Message</span><textarea required rows={5} className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold">Send Message</button>
        </form>
      </div>
    </div>
  );
}