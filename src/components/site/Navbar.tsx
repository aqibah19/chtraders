import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, LogOut, Menu, Search, Shield, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useSiteSettings } from "@/lib/site-settings";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { state } = useStore();
  const { user, isAdmin, signOut } = useAuth();
  const { displayOnly } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = state.cart.reduce((a, c) => a + c.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto flex flex-wrap justify-between gap-2 px-4 py-2">
          <span>Free delivery on orders over Rs 10,000 • Railway Road Gujrat</span>
          <span className="hidden sm:inline">Call: 0306 6294012 • Chhamza00024@gmail.com</span>
        </div>
      </div>
      <motion.header
        initial={false}
        animate={{ paddingTop: scrolled ? 8 : 14, paddingBottom: scrolled ? 8 : 14 }}
        className={`sticky top-0 z-40 transition-colors ${scrolled ? "glass shadow-sm" : "bg-background"}`}
      >
        <div className="container mx-auto flex items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="brand-gradient text-white rounded-lg w-10 h-10 flex items-center justify-center font-display font-bold text-lg shadow-lg group-hover:scale-105 transition">CH</div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight">CH TRADERS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Electronics & Crockery</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-3 py-2 text-sm font-medium transition ${active ? "text-primary" : "text-foreground/80 hover:text-primary"}`}
                >
                  {n.label}
                  {active && <motion.span layoutId="navdot" className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1.5 h-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </nav>
          <div className="flex-1" />
          <Link to="/shop" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border bg-muted/40 hover:bg-muted transition text-sm text-muted-foreground w-64">
            <Search className="w-4 h-4" /> Search products...
          </Link>
          {!displayOnly && (
            <Link to="/wishlist" className="relative p-2 hover:text-primary transition" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {state.wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{state.wishlist.length}</span>}
            </Link>
          )}
          <ThemeSwitcher />
          {isAdmin && (
            <Link to="/admin" className="p-2 hover:text-primary transition hidden sm:flex items-center gap-1 text-xs font-semibold" aria-label="Admin"><Shield className="w-4 h-4" /></Link>
          )}
          {user ? (
            <>
              <Link to="/account" className="p-2 hover:text-primary transition hidden sm:block" aria-label="Account"><User className="w-5 h-5" /></Link>
              <button onClick={() => signOut()} className="p-2 hover:text-primary transition hidden sm:block" aria-label="Sign out"><LogOut className="w-5 h-5" /></button>
            </>
          ) : (
            <Link to="/login" className="p-2 hover:text-primary transition hidden sm:block" aria-label="Account"><User className="w-5 h-5" /></Link>
          )}
          {!displayOnly && (
            <Link to="/cart" className="relative p-2 hover:text-primary transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>}
            </Link>
          )}
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t">
              <div className="container mx-auto px-4 py-3 flex flex-col">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="py-2 text-sm font-medium border-b last:border-0">{n.label}</Link>
                ))}
                <div className="pt-3 mt-1 border-t flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link to="/account" className="py-2 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> My Account</Link>
                      <Link to="/dashboard" className="py-2 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Dashboard</Link>
                      {isAdmin && <Link to="/admin" className="py-2 text-sm font-medium flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Panel</Link>}
                      <button onClick={() => signOut()} className="py-2 text-sm font-medium flex items-center gap-2 text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="py-2 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Sign In</Link>
                      <Link to="/signup" className="py-2 text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Create Account</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}