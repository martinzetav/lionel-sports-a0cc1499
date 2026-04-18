import { useState, useCallback } from "react";
import type { Product, CartItem } from "@/types/product";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.ID === product.ID && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.ID === product.ID && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, size }];
    });
  }, []);

  const removeItem = useCallback((productId: number, size?: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.ID === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number, size?: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.ID === productId && i.size === size
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  // NxM promo helper: every `groupSize` units, pay only the most expensive
  // NxM promo helper: por cada `groupSize` unidades COMPLETAS, se paga solo la más cara
  // y se regalan las (groupSize - 1) más baratas. Los sobrantes incompletos se pagan todos.
  const computePromo = (promoItems: CartItem[], groupSize: number) => {
    const units: number[] = [];
    promoItems.forEach((i) => {
      const price = i.product["Precio Oferta"] || i.product.Precio;
      for (let q = 0; q < i.quantity; q++) units.push(price);
    });
    // Ordenar descendente para que cada grupo completo cobre el más caro
    units.sort((a, b) => b - a);

    const fullTotal = units.reduce((s, p) => s + p, 0);
    const completeGroups = Math.floor(units.length / groupSize);

    let savings = 0;
    // Para cada grupo completo, descontar las (groupSize - 1) unidades más baratas del grupo
    for (let g = 0; g < completeGroups; g++) {
      const groupStart = g * groupSize;
      // El más caro del grupo está en groupStart (por orden desc); descontamos los siguientes
      for (let k = 1; k < groupSize; k++) {
        savings += units[groupStart + k];
      }
    }

    return { promoTotal: fullTotal - savings, savings };
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
