import type { PaymentMethod } from "@/types";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  note?: string;
}

/**
 * Payment selection is frontend-only for now. A real provider will be wired
 * through the backend later (create intent → confirm → webhook).
 */
export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cash",
    label: "Cash on delivery",
    description: "Pay the courier when your order arrives.",
  },
  {
    id: "card",
    label: "Card",
    description: "Visa, Mastercard and Amex accepted.",
    note: "Card capture is handled by the payment provider at checkout confirmation.",
  },
  {
    id: "online",
    label: "Online wallet",
    description: "Apple Pay, Google Pay and bank transfer.",
    note: "Redirect flow will be issued by the backend once payments go live.",
  },
];

export function getPaymentStatusForMethod(method: PaymentMethod) {
  // The backend will own the authoritative payment status.
  return method === "cash" ? "unpaid" : "paid";
}
