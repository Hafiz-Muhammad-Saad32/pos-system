import crypto from "crypto";

function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 hex chars
  return `MRD-${datePart}-${randomPart}`;
}

export { generateOrderNumber };
