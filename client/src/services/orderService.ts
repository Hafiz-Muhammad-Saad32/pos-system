import api from "@/lib/api";
import type { CreateOrderInput, Order, OrderItem } from "@/types";

/**
 * Order service — all calls go to the real backend.
 * GET   /api/orders
 * GET   /api/orders/:id
 * POST  /api/orders
 * PATCH /api/orders/:id/cancel
 */

/** Re-calculate totals on the client for display in cart/checkout.
 *  The backend always re-calculates authoritatively before saving. */
export function priceOrder(
  items: OrderItem[],
  discountRate = 0,
  deliveryFee = 3.9,
  freeDeliveryThreshold = 45,
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : deliveryFee;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal + fee - discount).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), deliveryFee: fee, discount, total };
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<{ orders: Order[] }>("/orders");
  return data.orders;
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await api.get<{ order: Order }>(`/orders/${id}`);
  return data.order;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data } = await api.post<{ order: Order }>("/orders", input);
  return data.order;
}

export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await api.patch<{ order: Order }>(`/orders/${id}/cancel`);
  return data.order;
}
