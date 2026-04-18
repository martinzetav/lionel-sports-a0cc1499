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

  // NxM promo helper: every `groupSize` units, pay only the most expensive
  const computePromo = (promoItems: CartItem[], groupSize: number) => {
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
      if (i % groupSize === 0) promoTotal += units[i];
    }
    const remainder = units.length % groupSize;
    if (remainder > 0) {
      const lastGroupStart = units.length - remainder;
      let lastGroupPromo = 0;
      let lastGroupFull = 0;
      for (let i = lastGroupStart; i < units.length; i++) {
        lastGroupFull += units[i];
        if (i === lastGroupStart) lastGroupPromo += units[i];
      }
      promoTotal = promoTotal - lastGroupPromo + lastGroupFull;
    }
    return { promoTotal, savings: fullTotal - promoTotal };
  };

  const { total, promoSavings, promo2x1Savings, promo3x1Savings } = (() => {
    const promo3Items = items.filter((i) => i.product["3x1"] === "Activo");
    const promo2Items = items.filter(
      (i) => i.product["2x1"] === "Activo" && i.product["3x1"] !== "Activo"
    );
    const normalItems = items.filter(
      (i) => i.product["3x1"] !== "Activo" && i.product["2x1"] !== "Activo"
    );

    const normalTotal = normalItems.reduce(
      (sum, i) => sum + (i.product["Precio Oferta"] || i.product.Precio) * i.quantity,
      0
    );

    const r3 = computePromo(promo3Items, 3);
    const r2 = computePromo(promo2Items, 2);

    return {
      total: normalTotal + r3.promoTotal + r2.promoTotal,
      promoSavings: r3.savings + r2.savings,
      promo3x1Savings: r3.savings,
      promo2x1Savings: r2.savings,
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
    promo3x1Savings,
    promo2x1Savings,
    clearCart,
  };
}
