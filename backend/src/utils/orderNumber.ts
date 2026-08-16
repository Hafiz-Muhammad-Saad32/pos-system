import Order from "../models/Order.js";

// e.g. "MRD-LZ3K9F-482" — timestamp-derived + random suffix, checked for
// uniqueness against existing orders (extremely unlikely to collide, but we
// verify anyway since the field has a unique index).
async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const stamp = Date.now().toString(36).toUpperCase();
    const suffix = Math.floor(Math.random() * 900 + 100); // 3-digit
    const candidate = `MRD-${stamp}-${suffix}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) return candidate;
  }
  // Fall back to something guaranteed-unique-enough if we somehow collided 5 times.
  return `MRD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export { generateOrderNumber };
