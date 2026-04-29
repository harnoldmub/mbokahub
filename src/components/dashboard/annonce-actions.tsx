"use client";

import { Pencil, Power, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import {
  deleteTrajetAction,
  toggleTrajetStatusAction,
} from "@/lib/actions/annonces";
import { cn } from "@/lib/utils";

type AnnonceActionsProps = {
  id: string;
  isActive: boolean;
};

export function AnnonceActions({ id, isActive }: AnnonceActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/annonces/${id}/modifier`}
        className="size-10 rounded-xl flex items-center justify-center bg-paper/5 text-paper-mute hover:bg-paper/10 hover:text-paper transition-all"
        title="Modifier"
        aria-label="Modifier"
      >
        <Pencil className="size-4" />
      </Link>

      <button
        type="button"
        onClick={() => startTransition(() => toggleTrajetStatusAction(id))}
        disabled={isPending}
        className={cn(
          "size-10 rounded-xl flex items-center justify-center transition-all",
          isActive
            ? "bg-blood/10 text-blood hover:bg-blood hover:text-paper"
            : "bg-paper/5 text-paper-mute hover:bg-paper/10 hover:text-paper",
        )}
        title={isActive ? "Désactiver" : "Activer"}
      >
        <Power className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          if (confirm("Supprimer cette annonce définitivement ?")) {
            startTransition(() => deleteTrajetAction(id));
          }
        }}
        disabled={isPending}
        className="size-10 rounded-xl bg-paper/5 text-paper-mute hover:bg-error/10 hover:text-error transition-all"
        title="Supprimer"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
