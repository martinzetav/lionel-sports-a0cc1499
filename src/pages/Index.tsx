import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import CategoryFilter from "@/components/CategoryFilter";
import CompetitionLogos from "@/components/CompetitionLogos";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { products, loading, error } = useProducts();
  const cart = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [competition, setCompetition] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.Categoria1) set.add(p.Categoria1);
    });
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === "" ||
        p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.Marca.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "" || p.Categoria1 === category;
      const matchComp = competition === "" || p.Categoria3 === competition;
      return matchSearch && matchCat && matchComp;
    });
  }, [products, search, category, competition]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        totalItems={cart.totalItems}
        onCartClick={() => cart.setIsOpen(true)}
        searchQuery={search}
        onSearchChange={setSearch}
      />

      <main className="container py-6">
        {/* Hero banner */}
        <section
          className="mb-8 overflow-hidden rounded-xl p-8 sm:p-12"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="font-display text-4xl tracking-wide text-primary-foreground sm:text-5xl">
            LO ÚLTIMO EN DEPORTE
          </h2>
          <p className="mt-2 max-w-lg text-sm text-primary-foreground/80">
            Encontrá camisetas, botines y todo lo que necesitás para la cancha. Hacé tu pedido y te lo llevamos.
          </p>
        </section>

        {/* Competition logos */}
        <section className="mb-6">
          <h3 className="mb-3 text-center font-display text-xl tracking-wide text-foreground">
            COMPETICIONES
          </h3>
          <CompetitionLogos active={competition} onSelect={setCompetition} />
        </section>

        {/* Filters */}
        <div className="mb-6">
          <CategoryFilter categories={categories} active={category} onSelect={setCategory} />
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="py-20 text-center text-destructive">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No se encontraron productos</p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.ID} product={product} onAdd={cart.addItem} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Deportes Shop — Todos los derechos reservados
      </footer>

      {/* Cart */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        onUpdateQty={cart.updateQuantity}
        onRemove={cart.removeItem}
        total={cart.total}
      />
    </div>
  );
}
