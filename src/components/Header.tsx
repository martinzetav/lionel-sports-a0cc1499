import { ShoppingCart, Search } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

interface HeaderProps {
  totalItems: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  totalItems,
  onCartClick,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Lionel Sports" className="h-10 w-10 rounded-full object-cover" />
          <h1 className="font-display text-3xl tracking-wide text-primary sm:text-4xl">
            LIONEL SPORTS
          </h1>
        </div>

        <div className="relative hidden flex-1 max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none ring-ring transition focus:ring-2"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onCartClick}
          className="relative rounded-lg bg-primary p-2.5 text-primary-foreground transition hover:opacity-90"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
            >
              {totalItems}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Mobile search */}
      <div className="container pb-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none ring-ring transition focus:ring-2"
          />
        </div>
      </div>
    </header>
  );
}
