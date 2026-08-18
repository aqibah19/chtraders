import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

type CartItem = { id: string; qty: number };
type State = { cart: CartItem[]; wishlist: string[] };
type Action =
  | { type: "ADD"; id: string; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "TOGGLE_WISH"; id: string }
  | { type: "HYDRATE"; state: State };

const initial: State = { cart: [], wishlist: [] };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "HYDRATE":
      return a.state;
    case "ADD": {
      const existing = s.cart.find((c) => c.id === a.id);
      const qty = a.qty ?? 1;
      return {
        ...s,
        cart: existing
          ? s.cart.map((c) => (c.id === a.id ? { ...c, qty: c.qty + qty } : c))
          : [...s.cart, { id: a.id, qty }],
      };
    }
    case "REMOVE":
      return { ...s, cart: s.cart.filter((c) => c.id !== a.id) };
    case "SET_QTY":
      return {
        ...s,
        cart: s.cart.map((c) => (c.id === a.id ? { ...c, qty: Math.max(1, a.qty) } : c)),
      };
    case "CLEAR":
      return { ...s, cart: [] };
    case "TOGGLE_WISH":
      return {
        ...s,
        wishlist: s.wishlist.includes(a.id)
          ? s.wishlist.filter((x) => x !== a.id)
          : [...s.wishlist, a.id],
      };
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ch-traders-store");
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ch-traders-store", JSON.stringify(state));
    } catch {}
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}