import type { IOrder } from "../models/Order.js";

// Builds a plain-text receipt block for a given order document
function buildReceipt(order: IOrder): string {
  const RESTAURANT_NAME = "Meridian Restaurant";
  const lines: string[] = [];

  lines.push(RESTAURANT_NAME);
  lines.push("=".repeat(RESTAURANT_NAME.length));
  lines.push(`Order ID: ${order._id.toString()}`);
  lines.push(`Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}`);
  lines.push(`Customer: ${order.customerName} (${order.customerPhone})`);
  if (order.customerAddress) {
    lines.push(`Address: ${order.customerAddress}`);
  }
  lines.push("-".repeat(32));

  for (const item of order.items) {
    const lineTotal = (item.quantity * item.price).toFixed(2);
    lines.push(`${item.quantity} x ${item.name} @ ${item.price.toFixed(2)} = ${lineTotal}`);
  }

  lines.push("-".repeat(32));
  lines.push(`Subtotal: ${order.subtotal.toFixed(2)}`);
  if (order.discount) {
    lines.push(`Discount: -${order.discount.toFixed(2)}`);
  }
  lines.push(`Total: ${order.total.toFixed(2)}`);

  if (order.note) {
    lines.push("-".repeat(32));
    lines.push(`Note: ${order.note}`);
  }

  lines.push("=".repeat(RESTAURANT_NAME.length));
  lines.push("Thank you for your order!");

  return lines.join("\n");
}

export { buildReceipt };
