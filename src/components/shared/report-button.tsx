"use client";

import { useState } from "react";

type ReportTargetType =
  | "TRAJET"
  | "PRO_PROFILE"
  | "AFTER"
  | "USER"
  | "MERCH_PRODUCT";

const REASONS = [
  { value: "ARNAQUE", label: "Arnaque / fraude" },
  { value: "FAUX_PROFIL", label: "Faux profil" },
  { value: "SPAM", label: "Spam" },
  { value: "CONTENU_INAPPROPRIE", label: "Contenu inapproprié" },
  { value: "PRIX_ABUSIF", label: "Prix abusif" },
  { value: "CONTACT_NON_REPONSE", label: "Pas de réponse au contact" },
  { value: "AUTRE", label: "Autre" },
] as const;

export function ReportButton({
  targetType,
  targetId,
  className,
  variant = "link",
}: {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
  variant?: "link" | "button";
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("ARNAQUE");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, description, email }),
      });
      if (!res.ok) throw new Error("Erreur");
      setStatus("ok");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setDescription("");
        setEmail("");
      }, 1500);
    } catch {
      setStatus("error");
    }
  }

  const triggerClass =
    variant === "button"
      ? "rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300 text-xs hover:bg-red-500/20"
      : "text-muted-foreground text-xs underline hover:text-red-300";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? triggerClass}
      >
        ⚠ Signaler
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-foreground text-xl">Signaler ce contenu</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Aide-nous à protéger la communauté Mboka Hub. Votre signalement reste confidentiel.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">Motif</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm"
                  required
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Décrivez le problème
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Détails (capture d'écran, échanges WhatsApp, etc.)"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Votre email (optionnel)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pour qu'on puisse vous recontacter"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">Une erreur s'est produite. Réessayez.</p>
              )}
              {status === "ok" && (
                <p className="text-green-400 text-sm">Merci, signalement envoyé !</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/20 px-4 py-2 text-foreground text-sm hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {status === "loading" ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
