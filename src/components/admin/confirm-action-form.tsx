"use client";

import { useState, useTransition, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  triggerLabel: ReactNode;
  triggerClassName?: string;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
};

const VARIANT_BTN: Record<NonNullable<ConfirmActionFormProps["variant"]>, string> = {
  danger:
    "bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-500/40",
  warning:
    "bg-amber-500 hover:bg-amber-600 text-black focus-visible:ring-amber-500/40",
  default:
    "bg-white text-black hover:bg-white/90 focus-visible:ring-white/40",
};

export function ConfirmActionForm({
  action,
  triggerLabel,
  triggerClassName,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
}: ConfirmActionFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await action(new FormData());
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      <Dialog open={open} onOpenChange={(v) => (!isPending ? setOpen(v) : null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground">{description}</div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-transparent px-4 text-sm text-foreground hover:bg-white/10 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_BTN[variant]}`}
            >
              {isPending ? "Traitement…" : confirmLabel}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
