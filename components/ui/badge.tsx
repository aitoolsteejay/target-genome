import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium tracking-label uppercase",
  {
    variants: {
      variant: {
        neutral: "border-border-strong text-slate bg-stone-100",
        accent: "border-accent/30 text-accent-strong bg-accent-soft",
        orange: "border-orange/30 text-orange bg-orange-soft",
        red: "border-red/30 text-red bg-red-soft",
        grey: "border-grey/30 text-grey bg-grey-soft",
        dark: "border-white/15 text-paper bg-white/10",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
