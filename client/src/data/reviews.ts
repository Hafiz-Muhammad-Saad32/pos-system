import type { Review } from "@/types";

export const REVIEWS: Review[] = [
  {
    id: "rv-1",
    name: "Amara Diallo",
    role: "Regular since 2021",
    rating: 5,
    quote:
      "The signature burger arrives thirty minutes after I tap order and still tastes like it left the grill seconds ago. Nothing else in the city is this consistent.",
  },
  {
    id: "rv-2",
    name: "Julian Reyes",
    role: "Food writer",
    rating: 5,
    quote:
      "Meridian treats delivery like service. Warm plates, precise packing, and a kitchen that clearly refuses to cut corners after 9pm.",
  },
  {
    id: "rv-3",
    name: "Priya Raman",
    role: "Weekly orders",
    rating: 4,
    quote:
      "Tracking is genuinely useful — I know when to set the table. The harissa chicken has become a Friday ritual for the whole household.",
  },
];

export const OPENING_HOURS = [
  { day: "Monday — Thursday", hours: "12:00 — 23:00" },
  { day: "Friday — Saturday", hours: "12:00 — 01:00" },
  { day: "Sunday", hours: "13:00 — 22:00" },
];
