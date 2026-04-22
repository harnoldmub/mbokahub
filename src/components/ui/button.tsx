import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent whitespace-nowrap transition-all outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 font-body",
  {
    variants: {
      variant: {
        default:
          "bg-blood text-paper font-display uppercase tracking-tight hover:bg-flame hover:shadow-glow-blood",
        outline: "border-white/10 bg-transparent text-paper hover:bg-smoke",
        secondary:
          "bg-smoke text-paper hover:bg-ash rounded-xl font-body font-semibold",
        ghost: "text-paper-dim hover:bg-smoke hover:text-paper",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        link: "text-blood underline-offset-4 hover:underline",
        vip: "bg-gold text-ink font-display uppercase tracking-tight hover:bg-gold-soft hover:shadow-[0_0_30px_rgba(242,183,5,0.3)]",
      },
      size: {
        default: "h-12 px-8 py-3 rounded-full text-base",
        sm: "h-9 px-4 rounded-full text-sm",
        lg: "h-14 px-10 rounded-full text-lg",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
