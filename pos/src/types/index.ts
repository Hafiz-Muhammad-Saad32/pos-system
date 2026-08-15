export type Role = "admin" | "cashier";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
}

export type FoodCategory =
    "Salads"
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
  | "Beverages"

export interface Food {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  channel: "whatsapp" | "counter" | "phone";
  createdAt: string;
  updatedAt: string;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  availableFoods: number;
  ordersDelta: number;
  revenueDelta: number;
}

export interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface PopularFood {
  foodId: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

export type AnalyticsRange = "daily" | "weekly" | "monthly";
