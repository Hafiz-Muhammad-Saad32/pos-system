import { cn } from "@/lib/utils";
import type { FoodCategory } from "@/types";

// Static category names — these are UI labels only, not data
const CATEGORY_NAMES: FoodCategory[] = [
   "Salads",
  "Starters & Appetizers",
  "Soups",
  "BBQ & Kabab",
  "Karahi & Curries",
  "Biryani & Rice",
  "Mandi & Platters",
  "Shawarma & Rolls",
  "Fried Chicken & Wings",
  "Burgers",
  "Pizza",
  "Chinese",
  "Breads & Naan",
  "Desserts",
  "Beverages"
];

interface CategoryFilterProps {
  value: FoodCategory | "All";
  onChange: (next: FoodCategory | "All") => void;
  className?: string;
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
  const options: (FoodCategory | "All")[] = ["All", ...CATEGORY_NAMES];

  return (
    <div
      className={cn("-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1", className)}
      role="tablist"
      aria-label="Food categories"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-2 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}


//import { CATEGORIES } from "@/data/foods";
// import { cn } from "@/lib/utils";
// import type { FoodCategory } from "@/types";

// interface CategoryFilterProps {
//   value: FoodCategory | "All";
//   onChange: (next: FoodCategory | "All") => void;
//   className?: string;
// }

// export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
//   const options: (FoodCategory | "All")[] = ["All", ...CATEGORIES.map((c) => c.name)];

//   return (
//     <div
//       className={cn("-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1", className)}
//       role="tablist"
//       aria-label="Food categories"
//     >
//       {options.map((option) => {
//         const active = option === value;
//         return (
//           <button
//             key={option}
//             type="button"
//             role="tab"
//             aria-selected={active}
//             onClick={() => onChange(option)}
//             className={cn(
//               "shrink-0 snap-start rounded-full border px-4 py-2 text-sm transition-colors",
//               active
//                 ? "border-primary bg-primary text-primary-foreground"
//                 : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
//             )}
//           >
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
