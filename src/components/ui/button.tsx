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
          "bg-[#202124] text-white font-body font-semibold hover:bg-black",
        outline: "border-[#d7dbe2] bg-white text-paper hover:bg-smoke",
        secondary:
          "bg-smoke text-paper hover:bg-ash rounded-xl font-body font-semibold",
        ghost: "text-paper-dim hover:bg-smoke hover:text-paper",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        link: "text-blood underline-offset-4 hover:underline",
        vip: "bg-smoke text-paper font-body font-semibold hover:bg-ash",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-md text-sm",
        sm: "h-9 px-4 rounded-md text-sm",
        lg: "h-[52px] px-8 rounded-md text-base",
        icon: "size-10 rounded-md",
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
