import { Link } from "react-router-dom";

import { PageMeta } from "@/components/common/PageMeta";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart, FREE_DELIVERY_THRESHOLD } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import api from "@/lib/api";
import { formatPrice } from "@/utils/format";

export function CartPage() {
  const cart = useCart();
  const { toggleFavorite } = useFavorites();
  const [promo, setPromo] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const removalTarget = cart.lines.find((line) => line.food.id === pendingRemoval);

  async function handleApplyPromo() {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    try {
      const { data } = await api.post<{ discountRate: number }>("/promo/validate", { code });
      cart.applyPromo(code, data.discountRate);
      toast.success(`${code} applied — ${Math.round(data.discountRate * 100)}% off`);
      setPromo("");
    } catch {
      toast.error("That promo code isn't valid");
    } finally {
      setPromoLoading(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Your cart — Meridian"
        description="Review your Meridian order before checkout."
        ogDescription="Review your order before checkout."
      />
      <PageHeader
        eyebrow="Your order"
        title="Cart"
        description="Prices are confirmed by the kitchen at checkout — nothing is charged before you place the order."
      />

      <div className="container-page py-12">
        {!cart.lines.length ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Nothing here yet. Browse the menu and add something from the grill."
            action={
              <Button asChild className="rounded-full">
                <Link to="/menu">Explore the menu</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {cart.lines.map((line) => (
                  <motion.li
                    key={line.food.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl border border-border bg-card p-4 sm:p-5"
                  >
                    <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
                      <img
                        src={line.food.image}
                        alt={line.food.name}
                        loading="lazy"
                        width={200}
                        height={200}
                        className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/menu/${line.food.id}`}
                          className="block truncate text-base text-foreground hover:text-primary"
                        >
                          {line.food.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatPrice(line.food.price)} · {line.food.category}
                        </p>
                        {!line.food.available ? (
                          <p className="mt-1 text-xs text-destructive">
                            Unavailable — remove to continue
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <QuantityStepper
                            value={line.quantity}
                            onChange={(next) => cart.setQuantity(line.food.id, next)}
                            min={1}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-muted-foreground"
                            onClick={() => toggleFavorite(line.food)}
                          >
                            <Heart className="mr-1.5 h-4 w-4" /> Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-muted-foreground hover:text-destructive"
                            onClick={() => setPendingRemoval(line.food.id)}
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
                          </Button>
                        </div>
                      </div>
                      <p className="col-span-2 text-right font-display text-2xl text-foreground sm:col-span-1">
                        {formatPrice(line.lineTotal)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <aside className="lg:sticky lg:top-23 lg:h-fit">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl text-foreground">Order summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums text-foreground">{formatPrice(cart.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="tabular-nums text-foreground">
                      {cart.deliveryFee === 0 ? "Free" : formatPrice(cart.deliveryFee)}
                    </dd>
                  </div>
                  {cart.discount > 0 ? (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Discount {cart.promoCode ? `(${cart.promoCode})` : null}
                      </dt>
                      <dd className="tabular-nums text-success">−{formatPrice(cart.discount)}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-border pt-4">
                    <dt className="text-foreground">Total</dt>
                    <dd className="font-display text-2xl tabular-nums text-foreground">
                      {formatPrice(cart.total)}
                    </dd>
                  </div>
                </dl>

                {cart.subtotal < FREE_DELIVERY_THRESHOLD ? (
                  <p className="mt-4 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
                    Add {formatPrice(FREE_DELIVERY_THRESHOLD - cart.subtotal)} more for free
                    delivery.
                  </p>
                ) : null}

                <div className="mt-5 flex gap-2">
                  <Input
                    value={promo}
                    onChange={(event) => setPromo(event.target.value)}
                    placeholder="Promo code"
                    aria-label="Promo code"
                    maxLength={24}
                    className="h-11"
                  />
                  <Button
                    variant="outline"
                    className="h-11 rounded-full"
                    disabled={promoLoading}
                    onClick={handleApplyPromo}
                  >
                    {promoLoading ? "…" : "Apply"}
                  </Button>
                </div>

                <Button
                  asChild={cart.lines.length > 0 && !cart.hasUnavailableItems}
                  size="lg"
                  className="mt-6 h-12 w-full rounded-full"
                  disabled={cart.hasUnavailableItems}
                >
                  {cart.hasUnavailableItems ? (
                    <span>Remove unavailable items</span>
                  ) : (
                    <Link to="/checkout">Proceed to checkout</Link>
                  )}
                </Button>
                <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
                  <Link to="/menu">Continue shopping</Link>
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(pendingRemoval)}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              {removalTarget?.food.name} will be taken out of your cart. You can add it again from
              the menu at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full"
              onClick={() => {
                if (pendingRemoval) cart.removeItem(pendingRemoval);
                setPendingRemoval(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
