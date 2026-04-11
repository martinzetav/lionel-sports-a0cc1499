import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAdd, index }: ProductCardProps) {
  const images = [product.Img1, product.Img2, product.Img3].filter(Boolean);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group relative overflow-hidden rounded-lg bg-card shadow-card transition-shadow hover:shadow-card-hover"
    >
      {product.Destacado === "SI" && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          DESTACADO
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={product.Nombre}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:scale-105 ${i === current ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.Marca}
        </p>
        <h3 className="mt-1 font-body text-sm font-semibold leading-snug text-foreground line-clamp-2">
          {product.Nombre}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="font-display text-xl text-primary">
              {formatPrice(product.Precio)}
            </span>
            <p className="text-[10px] font-semibold text-accent">10% OFF Efectivo/Transf.</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onAdd(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
