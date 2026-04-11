import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/product";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductGalleryModal({ product, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  if (!product) return null;

  const images = [product.Img1, product.Img2, product.Img3].filter(Boolean);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-xl"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1.5 text-foreground transition hover:bg-background">
            <X className="h-5 w-5" />
          </button>

          {/* Image */}
          <div className="relative aspect-square bg-muted">
            <img src={images[current]} alt={product.Nombre} className="h-full w-full object-cover" />

            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground transition hover:bg-background">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground transition hover:bg-background">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.Marca}</p>
            <h3 className="mt-1 font-body text-lg font-semibold text-foreground">{product.Nombre}</h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
