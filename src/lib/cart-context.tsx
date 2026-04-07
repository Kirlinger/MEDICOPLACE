'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { clampQuantity } from '@/lib/validation';

const MAX_ITEM_QUANTITY = 99;
const MAX_CART_ITEMS = 50;

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= MAX_ITEM_QUANTITY) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: clampQuantity(item.quantity + 1, 1, MAX_ITEM_QUANTITY) } : item
        );
      }
      if (prev.length >= MAX_CART_ITEMS) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    const clamped = clampQuantity(quantity, 1, MAX_ITEM_QUANTITY);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: clamped } : item))
    );
  }, []);

  const clearCart = useCallback(() => { setItems([]); }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
