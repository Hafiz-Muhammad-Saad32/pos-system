const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    // Additive: image snapshot at time of order, used by the customer-facing
    // order serializer. Never set by the WhatsApp webhook, defaults to "".
    image: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      // widened (additive) to also support the website's fuller lifecycle;
      // all 5 original values are still valid and unchanged
      enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    channel: {
      type: String,
      // widened (additive) to also allow website-originated orders
      enum: ["whatsapp", "counter", "phone", "website"],
      required: true,
    },
    note: { type: String, default: "" },

    // --- Website checkout fields (additive; POS/webhook code never sets these) ---
    orderNumber: { type: String, unique: true, sparse: true },
    deliveryFee: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["cash", "card", "online"] },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    // Nested address/customer snapshot used ONLY by the new customer-facing
    // serializer. The existing flat customerName/customerPhone/customerAddress
    // fields above are still populated on every order (POS code depends on them).
    deliveryAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
    customerSnapshot: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);
