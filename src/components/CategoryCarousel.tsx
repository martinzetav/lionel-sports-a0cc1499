import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface CategoryCarouselProps {
  title: string;
  products: Product[];
  onAdd: (p: Product) => void;
  onOpenGallery: (p: Product) => void;
}

export default function CategoryCarousel({ title, products, onAdd, onOpenGallery }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-2xl tracking-wide text-foreground">{title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-border"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
      >
        {products.map((product, i) => (
          <div key={product.ID} className="w-44 flex-shrink-0 snap-start sm:w-52">
            <ProductCard product={product} onAdd={onAdd} index={i} onOpenGallery={onOpenGallery} />
          </div>
        ))}
      </div>
    </section>
  );
}
