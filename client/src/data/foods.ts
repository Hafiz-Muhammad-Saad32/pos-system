import type { Food, FoodCategory } from "@/types";

import heroDish from "@/assets/hero-dish.jpg";
import burgerBrisket from "@/assets/food-burger-brisket.jpg";
import pizzaTruffle from "@/assets/food-pizza-truffle.jpg";
import pizzaMargherita from "@/assets/food-pizza-margherita.jpg";
import chickenHarissa from "@/assets/food-chicken-harissa.jpg";
import chickenKatsu from "@/assets/food-chicken-katsu.jpg";
import fries from "@/assets/food-fries.jpg";
import broccolini from "@/assets/food-broccolini.jpg";
import spritz from "@/assets/food-spritz.jpg";
import coldBrew from "@/assets/food-coldbrew.jpg";
import chocolate from "@/assets/food-chocolate.jpg";
import cheesecake from "@/assets/food-cheesecake.jpg";

export const CATEGORIES: { name: FoodCategory; blurb: string }[] = [
  { name: "Burgers", blurb: "Dry-aged, charcoal-grilled" },
  { name: "Pizza", blurb: "72-hour fermented dough" },
  { name: "Chicken", blurb: "Free-range, fire-kissed" },
  { name: "Sides", blurb: "Small plates, big flavour" },
  { name: "Drinks", blurb: "Bar-grade pours" },
  { name: "Desserts", blurb: "Pastry counter classics" },
];

/**
 * Mock catalogue — replaced later by GET /api/foods.
 * Keep this the single source of truth for food data.
 */
export const FOODS: Food[] = [
  {
    id: "mrd-001",
    name: "Meridian Signature Burger",
    description:
      "Dry-aged beef, aged comté, shaved black truffle and truffle aioli in a toasted brioche bun.",
    tagline: "The house icon",
    category: "Burgers",
    price: 18.5,
    image: heroDish,
    rating: 4.9,
    available: true,
    prepTime: 18,
    featured: true,
    popular: true,
  },
  {
    id: "mrd-002",
    name: "Smoked Brisket Burger",
    description:
      "Twelve-hour smoked brisket, aged cheddar, pickled red onion and bourbon glaze.",
    tagline: "Low and slow",
    category: "Burgers",
    price: 16.9,
    image: burgerBrisket,
    rating: 4.7,
    available: true,
    prepTime: 20,
    featured: true,
    popular: true,
  },
  {
    id: "mrd-003",
    name: "Tartufo Bianco",
    description:
      "Fior di latte, truffle cream, wild mushroom and a finish of shaved black truffle.",
    tagline: "Wood-fired",
    category: "Pizza",
    price: 21,
    image: pizzaTruffle,
    rating: 4.8,
    available: true,
    prepTime: 16,
    featured: true,
  },
  {
    id: "mrd-004",
    name: "Margherita Reale",
    description:
      "San Marzano tomato, buffalo mozzarella, Genovese basil and Sicilian olive oil.",
    tagline: "Naples, exactly",
    category: "Pizza",
    price: 15.5,
    image: pizzaMargherita,
    rating: 4.6,
    available: true,
    prepTime: 14,
    popular: true,
  },
  {
    id: "mrd-005",
    name: "Charred Harissa Chicken",
    description:
      "Half free-range chicken, rose harissa, burnt lemon and coriander seed.",
    tagline: "Over open flame",
    category: "Chicken",
    price: 19.5,
    image: chickenHarissa,
    rating: 4.7,
    available: true,
    prepTime: 24,
    featured: true,
    popular: true,
  },
  {
    id: "mrd-006",
    name: "Buttermilk Chicken Katsu",
    description:
      "Panko-crusted buttermilk chicken with a house katsu reduction and shiso salt.",
    tagline: "Crisp, always",
    category: "Chicken",
    price: 17,
    image: chickenKatsu,
    rating: 4.5,
    available: false,
    prepTime: 20,
  },
  {
    id: "mrd-007",
    name: "Duck Fat Fries",
    description: "Triple-cooked in duck fat with rosemary salt and aioli.",
    tagline: "Never share these",
    category: "Sides",
    price: 7.5,
    image: fries,
    rating: 4.9,
    available: true,
    prepTime: 10,
    popular: true,
  },
  {
    id: "mrd-008",
    name: "Charred Broccolini",
    description: "Grilled broccolini, chilli crisp, toasted almond and lemon zest.",
    tagline: "Green and smoky",
    category: "Sides",
    price: 8.9,
    image: broccolini,
    rating: 4.4,
    available: true,
    prepTime: 9,
  },
  {
    id: "mrd-009",
    name: "Blood Orange Spritz",
    description: "Sicilian blood orange, bitter aperitivo and dry sparkling wine.",
    tagline: "Golden hour",
    category: "Drinks",
    price: 11,
    image: spritz,
    rating: 4.6,
    available: true,
    prepTime: 5,
    featured: true,
  },
  {
    id: "mrd-010",
    name: "Single-Origin Cold Brew",
    description: "Sixteen-hour steeped Ethiopian beans over clear block ice.",
    tagline: "Slow steeped",
    category: "Drinks",
    price: 5.5,
    image: coldBrew,
    rating: 4.5,
    available: true,
    prepTime: 4,
  },
  {
    id: "mrd-011",
    name: "Dark Chocolate Crémeux",
    description: "70% Valrhona crémeux, olive oil and Maldon sea salt.",
    tagline: "Pastry counter",
    category: "Desserts",
    price: 9.5,
    image: chocolate,
    rating: 4.8,
    available: true,
    prepTime: 8,
    popular: true,
  },
  {
    id: "mrd-012",
    name: "Burnt Basque Cheesecake",
    description: "Caramelised top, molten centre, finished with vanilla bean cream.",
    tagline: "San Sebastián",
    category: "Desserts",
    price: 8.5,
    image: cheesecake,
    rating: 4.7,
    available: false,
    prepTime: 6,
  },
];

export const DELIVERY_FEE = 3.9;
export const FREE_DELIVERY_THRESHOLD = 45;
export const PROMO_CODES: Record<string, number> = {
  MERIDIAN10: 0.1,
  WELCOME5: 0.05,
};
