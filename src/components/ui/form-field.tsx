import type * as React from "react";

import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<"div"> {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormField({
  label,
  error,
  helperText,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("group flex flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute group-focus-within:text-blood transition-colors">
          {label}
        </span>
        {error && (
          <span className="font-mono text-[10px] uppercase text-blood animate-pulse">
            ! {error}
          </span>
        )}
      </div>

      <div className="relative">
        {children}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-blood transition-all duration-500 group-focus-within:w-full" />
      </div>

      {helperText && !error && (
        <p className="px-1 font-body text-[10px] text-paper-mute italic">
          {helperText}
        </p>
      )}
    </div>
  );
}
