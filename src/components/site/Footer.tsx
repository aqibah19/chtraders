import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-primary rounded-lg w-10 h-10 flex items-center justify-center font-display font-bold text-lg">CH</div>
            <div>
              <div className="font-display text-lg font-bold">CH TRADERS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">Electronics & Crockery</div>
            </div>
          </div>
          <p className="text-sm opacity-80 mb-4">Premium electronics and crockery, delivered with care across Pakistan.</p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gold">Shop</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/track">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gold">Company</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gold">Contact</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Railway Road, Gujrat, Pakistan</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> 0306 6294012</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> Chhamza00024@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs opacity-80 text-center sm:text-left">
          <div className="text-center sm:text-left">
            <div>Designed And Developed By <span className="text-gold font-semibold">Aqib Ahmed</span></div>
            <div className="text-[11px] opacity-90 mt-0.5">Contact: <a href="mailto:aqibah50@gmail.com" className="hover:text-gold transition">aqibah50@gmail.com</a></div>
          </div>
          <span className="text-center sm:text-right">© {new Date().getFullYear()} CH TRADERS. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}