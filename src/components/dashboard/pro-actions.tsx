"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteProProfileAction } from "@/lib/actions/annonces";

export function ProActions() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        if (
          confirm(
            "Supprimer ton profil professionnel ? Cette action est irréversible.",
          )
        ) {
          startTransition(() => deleteProProfileAction());
        }
      }}
      disabled={isPending}
      className="size-10 rounded-xl bg-paper/5 text-paper-mute hover:bg-error/10 hover:text-error transition-all flex items-center justify-center"
      title="Supprimer le profil pro"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
