import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";
import { PAYMENT_OPTIONS } from "@/services/paymentService";
import type { PaymentMethod } from "@/types";
import { formatPrice } from "@/utils/format";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  phone: z.string().trim().min(7, { message: "Enter a contact number" }).max(24),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  address: z.string().trim().min(6, { message: "Enter your delivery address" }).max(200),
  city: z.string().trim().min(2, { message: "Enter your city" }).max(80),
  postalCode: z.string().trim().min(3, { message: "Enter your postal code" }).max(12),
});

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Meridian" },
      { name: "description", content: "Confirm your details and place your Meridian order." },
      { property: "og:title", content: "Checkout — Meridian" },
      { property: "og:description", content: "Confirm your details and place your order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    note: "",
  });
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setValues((prev) => ({
      ...prev,
      name: prev.name || user.name,
      phone: prev.phone || user.phone,
      email: prev.email || user.email,
      address: prev.address || user.address.address,
      city: prev.city || user.address.city,
      postalCode: prev.postalCode || user.address.postalCode,
    }));
  }, [user]);

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    if (!cart.lines.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (cart.hasUnavailableItems) {
      toast.error("Remove unavailable items before ordering");
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      toast.error("Check the highlighted fields");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      const order = await createOrder({
        items: cart.toOrderItems(),
        customer: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
        },
        deliveryAddress: {
          address: parsed.data.address,
          city: parsed.data.city,
          postalCode: parsed.data.postalCode,
        },
        paymentMethod: method,
        ...(values.note.trim() ? { note: values.note.trim() } : {}),
      });
      cart.clearCart();
      toast.success("Order placed", { description: `Reference ${order.id}` });
      navigate({ to: "/orders/$id", params: { id: order.id }, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order");
    } finally {
      setPending(false);
    }
  }

  if (cart.isHydrated && !cart.lines.length) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Your cart is empty, so there's nothing to pay for yet."
          action={
            <Button asChild className="rounded-full">
              <Link to="/menu">Browse the menu</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const fields = [
    { id: "name", label: "Full name", type: "text" },
    { id: "phone", label: "Phone number", type: "tel" },
    { id: "email", label: "Email", type: "email" },
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        description="Confirm where we're delivering and how you'd like to pay. Final totals are recalculated by the kitchen when the order is accepted."
      />

      <form className="container-page grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]" onSubmit={placeOrder} noValidate>
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl text-foreground">1 · Customer information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.id} className={field.id === "email" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    maxLength={255}
                    value={values[field.id]}
                    onChange={(event) =>
                      setValues({ ...values, [field.id]: event.target.value })
                    }
                    className="mt-2 h-11"
                  />
                  {errors[field.id] ? (
                    <p className="mt-2 text-xs text-destructive">{errors[field.id]}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl text-foreground">2 · Delivery information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  maxLength={200}
                  value={values.address}
                  onChange={(event) => setValues({ ...values, address: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["address"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["address"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  maxLength={80}
                  value={values.city}
                  onChange={(event) => setValues({ ...values, city: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["city"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["city"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  maxLength={12}
                  value={values.postalCode}
                  onChange={(event) =>
                    setValues({ ...values, postalCode: event.target.value })
                  }
                  className="mt-2 h-11"
                />
                {errors["postalCode"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["postalCode"]}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="note">Delivery note (optional)</Label>
                <Textarea
                  id="note"
                  rows={3}
                  maxLength={300}
                  value={values.note}
                  onChange={(event) => setValues({ ...values, note: event.target.value })}
                  className="mt-2"
                  placeholder="Buzzer code, gate instructions…"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl text-foreground">3 · Payment method</h2>
            <RadioGroup
              value={method}
              onValueChange={(value) => setMethod(value as PaymentMethod)}
              className="mt-5 space-y-3"
            >
              {PAYMENT_OPTIONS.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={`pay-${option.id}`}
                  className="flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 has-data-[state=checked]:border-primary"
                >
                  <RadioGroupItem id={`pay-${option.id}`} value={option.id} className="mt-1" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {option.description}
                    </span>
                    {option.note ? (
                      <span className="mt-2 block text-xs text-primary">{option.note}</span>
                    ) : null}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="lg:sticky lg:top-23 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl text-foreground">Order summary</h2>
            <ul className="mt-5 space-y-4">
              {cart.lines.map((line) => (
                <li key={line.food.id} className="flex items-center gap-3">
                  <img
                    src={line.food.image}
                    alt=""
                    loading="lazy"
                    width={100}
                    height={100}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">
                      {line.food.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {line.quantity} × {formatPrice(line.food.price)}
                    </span>
                  </span>
                  <span className="text-sm tabular-nums text-foreground">
                    {formatPrice(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="tabular-nums">
                  {cart.deliveryFee === 0 ? "Free" : formatPrice(cart.deliveryFee)}
                </dd>
              </div>
              {cart.discount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
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
            <Button
              type="submit"
              size="lg"
              className="mt-6 h-12 w-full rounded-full"
              disabled={pending}
            >
              {pending ? "Placing order…" : "Place order"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No payment is captured in this preview build.
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}
