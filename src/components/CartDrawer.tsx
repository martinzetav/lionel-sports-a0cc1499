import { X, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { CartItem } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ⚠️ CAMBIÁ ESTE NÚMERO POR EL TUYO
const WHATSAPP_NUMBER = "5493804565772";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  total: number;
  promoSavings: number;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  total,
  promoSavings,
}: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientName, setClientName] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const isFormValid = clientName.trim() !== "" && deliveryMethod !== "" && paymentMethod !== "";

  const handleCheckout = () => {
    if (items.length === 0 || !isFormValid) return;

    const lines = items.map(
      (i) =>
        `• ${i.product.Nombre} x${i.quantity} — ${formatPrice(i.product.Precio * i.quantity)}`
    );
    const msg = encodeURIComponent(
      `¡Hola! Quiero hacer un pedido:\n\n` +
      `👤 *Cliente:* ${clientName.trim()}\n` +
      `🚚 *Entrega:* ${deliveryMethod}\n` +
      `💳 *Pago:* ${paymentMethod}\n\n` +
      `${lines.join("\n")}\n\n` +
      `*Total: ${formatPrice(total)}*`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setShowCheckout(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-2xl tracking-wide">MI CARRITO</h2>
              <button onClick={onClose} className="text-muted-foreground transition hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  Tu carrito está vacío
                </p>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.ID}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="flex gap-3 rounded-lg border border-border p-3"
                      >
                        <img
                          src={item.product.Img1}
                          alt={item.product.Nombre}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                              {item.product.Nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.product.Marca}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onUpdateQty(item.product.ID, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-muted"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(item.product.ID, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-muted"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-lg text-primary">
                                {formatPrice((item.product["Precio Oferta"] || item.product.Precio) * item.quantity)}
                              </span>
                              <button
                                onClick={() => onRemove(item.product.ID)}
                                className="text-muted-foreground transition hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                {promoSavings > 0 && (
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-orange-500">Descuento 3x1</span>
                    <span className="font-semibold text-orange-500">-{formatPrice(promoSavings)}</span>
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCheckout(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Continuar con el pedido
                </motion.button>
              </div>
            )}
          </motion.aside>

          {/* Checkout Dialog */}
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="z-[60] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Datos del pedido</DialogTitle>
                <DialogDescription>Completá tus datos para finalizar la compra.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Cliente</Label>
                  <Input
                    id="clientName"
                    placeholder="Apellido y nombre"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Entrega</Label>
                  <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná un método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retiro por local">Retiro por local</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pago</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná un método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                disabled={!isFormValid}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(142,70%,40%)] py-3.5 font-semibold text-[hsl(0,0%,100%)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-5 w-5" />
                Finalizar por WhatsApp
              </motion.button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}