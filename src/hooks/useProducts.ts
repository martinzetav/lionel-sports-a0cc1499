import { useState, useEffect } from "react";
import type { Product } from "@/types/product";

const API_URL =
  "https://script.google.com/macros/s/AKfycbz-nTFE46GdDHDIdl9001sS6cjtuPKDPbM6ysrH3WTi82eZ5-0OWXm6__N1JLYMiZTj4g/exec";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.Estado === "Activo"));
        setLoading(false);
      })
      .catch((err) => {
        setError("Error cargando productos");
        setLoading(false);
        console.error(err);
      });
  }, []);

  return { products, loading, error };
}
