import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] brand-gradient flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <div className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight">CH TRADERS</div>
            <div className="mt-2 text-white/80 text-xs uppercase tracking-[0.4em]">Electronics & Crockery</div>
            <div className="mt-8 w-48 h-0.5 bg-white/20 rounded mx-auto overflow-hidden">
              <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.2, ease: "easeInOut" }} className="h-full w-1/2 bg-gold" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}