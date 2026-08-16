import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { priceOrder } from "@/services/orderService";
import type { CartItem, Food, OrderItem } from "@/types";
import { formatPrice } from "@/utils/format";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/utils/storage";

// Delivery config — will come from backend settings endpoint later.
// For now keep it here so the number is in one place.
export const DELIVERY_FEE = 3.9;
export const FREE_DELIVERY_THRESHOLD = 45;

interface CartLine extends CartItem {
  food: Food;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  isHydrated: boolean;
  promoCode: string | null;
  promoDiscount: number; // 0–1, e.g. 0.1 = 10%
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  hasUnavailableItems: boolean;
  addItem: (food: Food, quantity?: number) => void;
  setQuantity: (foodId: string, quantity: number) => void;
  removeItem: (foodId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string, discountRate: number) => void;
  clearPromo: () => void;
  toOrderItems: () => OrderItem[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [foodCache, setFoodCache] = useState<Record<string, Food>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore cart from localStorage
  useEffect(() => {
    const stored = readStorage<{
      items: CartItem[];
      promoCode: string | null;
      promoDiscount: number;
    }>(STORAGE_KEYS.cart, { items: [], promoCode: null, promoDiscount: 0 });
    setItems(stored.items ?? []);
    setPromoCode(stored.promoCode ?? null);
    setPromoDiscount(stored.promoDiscount ?? 0);
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.cart, { items, promoCode, promoDiscount });
  }, [items, promoCode, promoDiscount, isHydrated]);

  /**
   * Register a food object into local cache so CartLines can resolve them.
   * Called by FoodCard / FoodDetail whenever a food is added.
   */
  const registerFood = useCallback((food: Food) => {
    setFoodCache((prev) => (prev[food.id] ? prev : { ...prev, [food.id]: food }));
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((item) => {
          const food = foodCache[item.foodId];
          if (!food) return null;
          return { ...item, food, lineTotal: food.price * item.quantity };
        })
        .filter((line): line is CartLine => Boolean(line)),
    [items, foodCache],
  );

  const totals = useMemo(
    () =>
      priceOrder(
        lines.map((line) => ({
          foodId: line.food.id,
          name: line.food.name,
          image: line.food.image,
          price: line.food.price,
          quantity: line.quantity,
        })),
        promoDiscount,
        DELIVERY_FEE,
        FREE_DELIVERY_THRESHOLD,
      ),
    [lines, promoDiscount],
  );

  const addItem = useCallback(
    (food: Food, quantity = 1) => {
      if (!food.available) {
        toast.error(`${food.name} is currently unavailable`);
        return;
      }
      registerFood(food);
      setItems((prev) => {
        const existing = prev.find((item) => item.foodId === food.id);
        if (existing) {
          return prev.map((item) =>
            item.foodId === food.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, 20) }
              : item,
          );
        }
        return [...prev, { foodId: food.id, quantity }];
      });
      toast.success(`${food.name} added to cart`, {
        description: `${quantity} × ${formatPrice(food.price)}`,
      });
    },
    [registerFood],
  );

  const setQuantity = useCallback((foodId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.foodId !== foodId)
        : prev.map((item) =>
            item.foodId === foodId ? { ...item, quantity: Math.min(quantity, 20) } : item,
          ),
    );
  }, []);

  const removeItem = useCallback((foodId: string) => {
    setItems((prev) => prev.filter((item) => item.foodId !== foodId));
    toast.success("Removed from cart");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
    setPromoDiscount(0);
  }, []);

  /**
   * Called after the backend validates the promo code.
   * Pass the discount rate returned by POST /api/promo/validate.
   */
  const applyPromo = useCallback((code: string, discountRate: number) => {
    setPromoCode(code.trim().toUpperCase());
    setPromoDiscount(discountRate);
  }, []);

  const clearPromo = useCallback(() => {
    setPromoCode(null);
    setPromoDiscount(0);
  }, []);

  const toOrderItems = useCallback(
    () =>
      lines.map((line) => ({
        foodId: line.food.id,
        name: line.food.name,
        image: line.food.image,
        price: line.food.price,
        quantity: line.quantity,
      })),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      isHydrated,
      promoCode,
      promoDiscount,
      ...totals,
      hasUnavailableItems: lines.some((line) => !line.food.available),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      clearPromo,
      toOrderItems,
    }),
    [
      items,
      lines,
      isHydrated,
      promoCode,
      promoDiscount,
      totals,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      clearPromo,
      toOrderItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
