import type { IOrder } from "../models/Order.js";

// Builds the exact Order JSON shape the frontend's Order type requires:
// { id, customer, items, subtotal, deliveryFee, discount, total,
//   paymentMethod, paymentStatus, status, deliveryAddress, note?, createdAt, source }
function serializeCustomerOrder(order: IOrder) {
  // TODO: refine type — toJSON() output shape isn't captured by IOrder after transform
  const json: any = order.toJSON ? order.toJSON() : order;
  return {
    id: json.id,
    customer: {
      id: json.customerId ? json.customerId.toString() : "",
      name: json.customerSnapshot?.name || json.customerName,
      email: json.customerSnapshot?.email || "",
      phone: json.customerSnapshot?.phone || json.customerPhone,
    },
    items: (json.items || []).map((item: any) => ({
      foodId: item.foodId ? item.foodId.toString() : item.foodId,
      name: item.name,
      image: item.image || "",
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: json.subtotal,
    deliveryFee: json.deliveryFee || 0,
    discount: json.discount || 0,
    total: json.total,
    paymentMethod: json.paymentMethod,
    paymentStatus: json.paymentStatus,
    status: json.status,
    deliveryAddress: {
      address: json.deliveryAddress?.address || "",
      city: json.deliveryAddress?.city || "",
      postalCode: json.deliveryAddress?.postalCode || "",
    },
    note: json.note || undefined,
    createdAt: json.createdAt,
    // stored field is `channel` (POS code depends on that name); customer-
    // facing responses alias it to `source` at this serialization layer only.
    source: json.channel === "website" ? "website" : "whatsapp",
  };
}

export { serializeCustomerOrder };
