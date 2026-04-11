import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
}

export default function CategoryFilter({ categories, active, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {["Todos", ...categories].map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat === "Todos" ? "" : cat)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            (cat === "Todos" && active === "") || cat === active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-border"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
