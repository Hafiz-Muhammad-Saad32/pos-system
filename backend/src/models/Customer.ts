import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: Date | null;

  // --- Website auth fields (additive; WhatsApp-created records won't have these) ---
  email?: string;
  password?: string;
  city: string;
  postalCode: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  favorites: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: { type: Date, default: null },

    // --- Website auth fields (additive; WhatsApp-created records won't have these) ---
    email: {
      type: String,
      unique: true,
      sparse: true, // allows many docs with no email at all
      lowercase: true,
      trim: true,
      default: undefined,
    },
    password: { type: String, select: false },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food", default: [] }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        delete ret._id;
        delete ret.__v;
        // never leak auth secrets even if a query explicitly selected them
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
      },
    },
  }
);

customerSchema.pre("save", async function hashPasswordIfModified(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

customerSchema.methods.comparePassword = function comparePassword(
  this: ICustomer,
  candidate: string
): Promise<boolean> {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<ICustomer>("Customer", customerSchema);
