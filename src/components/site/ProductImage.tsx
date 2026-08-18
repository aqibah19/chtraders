import * as Icons from "lucide-react";
import { categories } from "@/lib/products";
import type { LucideIcon } from "lucide-react";

const palettes: Record<string, string> = {
  juicers: "from-orange-200 via-amber-100 to-yellow-50",
  blenders: "from-sky-200 via-blue-100 to-indigo-50",
  choppers: "from-rose-200 via-pink-100 to-red-50",
  "sandwich-makers": "from-amber-200 via-yellow-100 to-orange-50",
  kettles: "from-slate-200 via-zinc-100 to-gray-50",
  irons: "from-violet-200 via-purple-100 to-fuchsia-50",
  "air-fryers": "from-red-200 via-orange-100 to-amber-50",
  "microwave-ovens": "from-zinc-300 via-slate-200 to-neutral-100",
  "electric-stoves": "from-stone-200 via-neutral-100 to-zinc-50",
  "cookware-sets": "from-emerald-200 via-teal-100 to-cyan-50",
  "crockery-items": "from-blue-100 via-indigo-50 to-violet-50",
  "kitchen-appliances": "from-lime-200 via-green-100 to-emerald-50",
};

export function ProductImage({ category, size = "md", src, fit = "cover" }: { category: string; size?: "sm" | "md" | "lg"; src?: string; fit?: "cover" | "contain" }) {
  if (src) {
    return (
      <div className="relative w-full h-full bg-muted overflow-hidden">
        <img src={src} alt="" className={`w-full h-full object-${fit}`} loading="lazy" />
      </div>
    );
  }
  const meta = categories.find((c) => c.slug === category);
  const Icon = (Icons[meta?.icon as keyof typeof Icons] ?? Icons.Package) as LucideIcon;
  const palette = palettes[category] ?? "from-slate-200 to-slate-50";
  const iconSize = size === "lg" ? "w-32 h-32" : size === "sm" ? "w-12 h-12" : "w-20 h-20";
  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${palette} overflow-hidden`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className={`${iconSize} text-primary/70 drop-shadow-lg`} strokeWidth={1.2} />
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
    </div>
  );
}