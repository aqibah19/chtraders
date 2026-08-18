import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId =
  | "light"
  | "cream"
  | "mint"
  | "sky"
  | "dark"
  | "midnight"
  | "sepia"
  | "forest"
  | "rose";

export const themes: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "light", label: "Light (Royal)", swatch: "#fafbfc" },
  { id: "cream", label: "Cream", swatch: "#f7f1e6" },
  { id: "mint", label: "Mint Fresh", swatch: "#e6f5ee" },
  { id: "sky", label: "Sky", swatch: "#e6f1fb" },
  { id: "dark", label: "Dark", swatch: "#0f172a" },
  { id: "midnight", label: "Midnight Indigo", swatch: "#1e1e5a" },
  { id: "sepia", label: "Warm Sepia", swatch: "#c9a877" },
  { id: "forest", label: "Forest", swatch: "#1a3c2a" },
  { id: "rose", label: "Rose Bloom", swatch: "#c44569" },
];

const STORAGE_KEY = "ch-theme";
const Ctx = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void }>({
  theme: "light",
  setTheme: () => {},
});

function applyTheme(t: ThemeId) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  // Single attribute swap is faster than toggling many classes.
  el.setAttribute("data-theme", t);
  // Keep class for backward compat, but do it in one pass.
  const next = `theme-${t}`;
  if (!el.classList.contains(next)) {
    for (let i = el.classList.length - 1; i >= 0; i--) {
      const c = el.classList[i];
      if (c.startsWith("theme-")) el.classList.remove(c);
    }
    el.classList.add(next);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("light");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as ThemeId | null;
    const initial: ThemeId = saved && themes.some((t) => t.id === saved) ? saved : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (t: ThemeId) => {
    // Apply to DOM first for instant visual feedback.
    applyTheme(t);
    setThemeState(t);
    // Defer storage write so it doesn't block the click.
    const persist = () => { try { localStorage.setItem(STORAGE_KEY, t); } catch {} };
    if (typeof requestIdleCallback !== "undefined") requestIdleCallback(persist);
    else setTimeout(persist, 0);
  };

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);