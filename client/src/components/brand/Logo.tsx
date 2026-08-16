import { Link } from "react-router-dom";

import mark from "@/assets/meridian-mark.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
}

const sizes = {
  sm: { mark: "h-6 w-6", text: "text-lg", sub: "text-[0.5rem]" },
  md: { mark: "h-8 w-8", text: "text-2xl", sub: "text-[0.55rem]" },
  lg: { mark: "h-12 w-12", text: "text-4xl", sub: "text-[0.65rem]" },
};

/** Brand lockup: chef-hat mark + Meridian wordmark. Works on light and dark. */
export function Logo({ className, size = "md", withWordmark = true }: LogoProps) {
  const s = sizes[size];
  return (
    <Link
      to="/"
      aria-label="Meridian — home"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <img
        src={mark}
        alt=""
        width={64}
        height={64}
        className={cn(s.mark, "transition-transform duration-300 group-hover:-translate-y-0.5")}
      />
      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn("font-display font-medium tracking-[0.14em] text-foreground", s.text)}
          >
            MERIDIAN
          </span>
          <span className={cn("mt-0.5 tracking-[0.34em] text-muted-foreground uppercase", s.sub)}>
            Kitchen & Bar
          </span>
        </span>
      ) : null}
    </Link>
  );
}
