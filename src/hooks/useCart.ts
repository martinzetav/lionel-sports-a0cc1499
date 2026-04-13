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

  // 3x1 promo: every 3 units among 3x1 products, pay only the most expensive
  const { total, promoSavings } = (() => {
    const normalItems = items.filter((i) => i.product["3x1"] !== "Activo");
    const promoItems = items.filter((i) => i.product["3x1"] === "Activo");

    const normalTotal = normalItems.reduce(
      (sum, i) => sum + (i.product["Precio Oferta"] || i.product.Precio) * i.quantity,
      0
    );

    // Expand promo items into individual units sorted by price desc
    const units: number[] = [];
    promoItems.forEach((i) => {
      const price = i.product["Precio Oferta"] || i.product.Precio;
      for (let q = 0; q < i.quantity; q++) units.push(price);
    });
    units.sort((a, b) => b - a);

    let promoTotal = 0;
    let fullTotal = 0;
    for (let i = 0; i < units.length; i++) {
      fullTotal += units[i];
      const posInGroup = i % 3;
      if (posInGroup === 0) {
        // most expensive in the group — charge it
        promoTotal += units[i];
      }
      // positions 1 and 2 in each group of 3 are free
    }
    // Units that don't complete a group of 3 pay normal price
    const remainder = units.length % 3;
    if (remainder > 0) {
      // Undo the grouping for the last incomplete group
      const lastGroupStart = units.length - remainder;
      let lastGroupPromo = 0;
      let lastGroupFull = 0;
      for (let i = lastGroupStart; i < units.length; i++) {
        lastGroupFull += units[i];
        if (i === lastGroupStart) lastGroupPromo += units[i];
      }
      promoTotal = promoTotal - lastGroupPromo + lastGroupFull;
    }

    return {
      total: normalTotal + promoTotal,
      promoSavings: fullTotal - promoTotal,
    };
  })();

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
    promoSavings,
    clearCart,
  };
}
