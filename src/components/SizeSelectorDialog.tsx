import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface SizeSelectorDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, size: string) => void;
}

export default function SizeSelectorDialog({ product, open, onClose, onConfirm }: SizeSelectorDialogProps) {
  const sizes = (product?.Talle || "")
    .split(/[,;|/]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (open) setSelected("");
  }, [open, product?.ID]);

  if (!product) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(product, selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide">Elegí tu talle</DialogTitle>
          <DialogDescription>
            Seleccioná un talle para <span className="font-semibold text-foreground">{product.Nombre}</span> antes de agregarlo al carrito.
          </DialogDescription>
        </DialogHeader>

        {sizes.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Este producto no tiene talles disponibles.
          </p>
        ) : (
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="grid grid-cols-3 gap-2 py-2 sm:grid-cols-4"
          >
            {sizes.map((size) => (
              <Label
                key={size}
                htmlFor={`size-${size}`}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  selected === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                {size}
              </Label>
            ))}
          </RadioGroup>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full font-display text-base tracking-wide"
          size="lg"
        >
          Agregar al carrito
        </Button>
      </DialogContent>
    </Dialog>
  );
}
