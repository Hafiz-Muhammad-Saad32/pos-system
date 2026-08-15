const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // NOTE: the strict enum constraint was intentionally removed (see PROGRESS.md) —
    // category is now free-form data instead of a fixed code-level list. Validation
    // for POS writes still happens in foodRoutes.js's Zod schema (unchanged).
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    available: { type: Boolean, default: true },
    // null = unlimited stock; frontend ignores this extra field
    stock: { type: Number, default: null },

    // --- Website-facing display fields (additive) ---
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    tagline: { type: String, default: "" },
    prepTime: { type: Number, default: null },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
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

// The website frontend expects a field called `image`; the existing field
// (read by POS code) stays `imageUrl` and is untouched. This virtual just
// mirrors it under a second name in serialized output.
foodSchema.virtual("image").get(function getImage() {
  return this.imageUrl;
});

module.exports = mongoose.model("Food", foodSchema);
