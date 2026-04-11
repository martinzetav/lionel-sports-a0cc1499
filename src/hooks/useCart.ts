import { useState, useCallback } from "react";
import type { Product, CartItem } from "@/types/product";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.ID === product.ID);
      if (existing) {
        return prev.map((i) =>
          i.product.ID === product.ID ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.ID !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.ID === productId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const total = items.reduce(
    (sum, i) => sum + i.product.Precio * i.quantity,
    0
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const clearCart = useCallback(() => setItems([]), []);

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    total,
    totalItems,
    clearCart,
  };
}
