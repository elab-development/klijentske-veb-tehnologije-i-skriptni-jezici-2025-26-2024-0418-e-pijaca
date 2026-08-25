import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Cart } from '../models/Cart';
import type { ICartItem } from '../models/interfaces';
import { getProductById, effectivePrice } from '../services/productService';

interface CartContextValue {
  items: ICartItem[];
  count: number;
  subtotal: number;
  total: number;
  discountAmount: number;
  discountCode: string | null;
  addItem: (productId: number, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  applyDiscount: (code: string) => boolean;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<ICartItem[]>('epijaca-cart-items', []);
  const [discountCode, setDiscountCode] = useLocalStorage<string | null>('epijaca-cart-code', null);

  const cart = useMemo(() => new Cart(items, discountCode), [items, discountCode]);
  const priceOf = (id: number) => effectivePrice(getProductById(id));
  const subtotal = cart.getSubtotal(priceOf);
  const total = cart.getDiscountedTotal(priceOf);
  const discountAmount = cart.getDiscountAmount(priceOf);

  const value: CartContextValue = {
    items: cart.items,
    count: cart.getItemCount(),
    subtotal,
    total,
    discountAmount,
    discountCode: cart.discountCode,
    addItem: (productId, qty = 1) => {
      const c = new Cart([...items], discountCode);
      c.addItem(productId, qty);
      setItems(c.items);
    },
    removeItem: (productId) => {
      const c = new Cart([...items], discountCode);
      c.removeItem(productId);
      setItems(c.items);
    },
    updateQty: (productId, qty) => {
      const c = new Cart([...items], discountCode);
      c.updateQuantity(productId, qty);
      setItems(c.items);
    },
    applyDiscount: (code) => {
      const c = new Cart([...items], discountCode);
      const ok = c.applyDiscount(code);
      if (ok) {
        setItems(c.items);
        setDiscountCode(c.discountCode);
      }
      return ok;
    },
    clear: () => {
      setItems([]);
      setDiscountCode(null);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart mora biti korišćen unutar CartProvider');
  return ctx;
}
