import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAdd, index }: ProductCardProps) {
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

      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.Img1}
          alt={product.Nombre}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.Marca}
        </p>
        <h3 className="mt-1 font-body text-sm font-semibold leading-snug text-foreground line-clamp-2">
          {product.Nombre}
        </h3>

        <div className="mt-2 rounded-md bg-accent/15 px-2 py-1 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
            10% OFF{" "}
          </span>
          <span className="text-[11px] text-accent/80">
            Efectivo / Transferencia
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display text-xl text-primary">
              {formatPrice(product.Precio)}
            </span>
            <span className="text-[11px] text-muted-foreground line-through">
              {formatPrice(Math.round(product.Precio / 0.9))}
            </span>
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
