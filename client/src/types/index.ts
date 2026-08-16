/**
 * Shared domain types. These mirror the future backend (Node/Express/MongoDB)
 * models so services can be swapped for real HTTP calls without UI changes.
 */

export type FoodCategory =
  | "Salads"
  | "Starters & Appetizers"
  | "Soups"
  | "BBQ & Kabab"
  | "Karahi & Curries"
  | "Biryani & Rice"
  | "Mandi & Platters"
  | "Shawarma & Rolls"
  | "Fried Chicken & Wings"
  | "Burgers"
  | "Pizza"
  | "Chinese"
  | "Breads & Naan"
  | "Desserts"
  | "Beverages";

export interface Food {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  image: string;
  rating: number;
  available: boolean;
  /** Presentation extras — safe for the backend to omit. */
  tagline?: string | undefined;
  prepTime?: number | undefined;
  popular?: boolean | undefined;
  featured?: boolean | undefined;
}

export type UserRole = "customer" | "admin";

export interface Address {
  address: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  role: UserRole;
}

export type PaymentMethod = "cash" | "card" | "online";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderStatus =
  "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";

export type OrderSource = "website" | "whatsapp";

export interface OrderItem {
  foodId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: Pick<User, "id" | "name" | "email" | "phone">;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  deliveryAddress: Address;
  note?: string | undefined;
  createdAt: string;
  source: OrderSource;
}

export interface CartItem {
  foodId: string;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

/** Shape returned by the future POST /api/orders payload. */
export interface CreateOrderInput {
  items: OrderItem[];
  customer: { name: string; email: string; phone: string };
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  note?: string | undefined;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterInput extends AuthCredentials {
  name: string;
  phone: string;
}
