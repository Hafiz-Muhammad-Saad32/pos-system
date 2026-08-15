import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled = false,
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface",
        disabled && "opacity-50",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:text-primary disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
