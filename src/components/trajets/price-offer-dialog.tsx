"use client";

import { useState } from "react";

type Props = {
  trajetId: string;
  prixPublie: number;
  villeDepart: string;
  villeArrivee: string;
  isSignedIn: boolean;
  suggestedPrice?: number | null;
};

export function PriceOfferDialog({
  trajetId,
  prixPublie,
  villeDepart,
  villeArrivee,
  isSignedIn,
  suggestedPrice = null,
}: Props) {
  const hasSuggestion = suggestedPrice !== null && suggestedPrice > 0;
  const initialPrix = hasSuggestion ? String(suggestedPrice) : "";

  const [open, setOpen] = useState(false);
  const [prix, setPrix] = useState<string>(initialPrix);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function reset() {
    setPrix(initialPrix);
    setMessage("");
    setName("");
    setEmail("");
    setWhatsapp("");
    setStatus("idle");
    setErrorMsg(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/trajets/${trajetId}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prixPropose: Number(prix),
          message: message || undefined,
          name: name || undefined,
          email: email || undefined,
          whatsapp: whatsapp || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data?.error ?? "Erreur, réessaie.");
        setStatus("error");
        return;
      }
      setStatus("ok");
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1800);
    } catch {
      setErrorMsg("Réseau indisponible, réessaie.");
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-[#E50914]/40 bg-[#E50914]/10 px-4 py-2 font-medium text-[#ff5a63] text-sm transition hover:border-[#E50914]/70 hover:bg-[#E50914]/20"
      >
        {hasSuggestion
          ? `💡 Suggérer le prix conseillé : ${suggestedPrice} €`
          : "💬 Proposer un autre prix"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setOpen(false);
            reset();
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-foreground text-xl">
              {hasSuggestion
                ? "Suggérer le prix conseillé"
                : "Proposer un autre prix"}
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Trajet <strong className="text-foreground">{villeDepart} → {villeArrivee}</strong>{" "}
              · prix actuel <strong className="text-foreground">{prixPublie} €</strong> / place.
              Le conducteur reçoit ta proposition par email.
            </p>

            {hasSuggestion && (
              <div className="mt-4 rounded-xl border border-[#E50914]/25 bg-[#E50914]/[0.06] p-4">
                <div className="font-mono text-[#ff5a63] text-[10px] tracking-[0.18em] uppercase">
                  Estimation Nevent
                </div>
                <p className="mt-2 text-foreground text-sm leading-relaxed">
                  Pour ce trajet, on estime un prix juste à{" "}
                  <strong className="text-foreground">~{suggestedPrice} € / place</strong>{" "}
                  (essence + péages divisés par toi + les autres passagers). Le
                  champ ci-dessous est pré-rempli, tu peux ajuster si tu veux.
                </p>
              </div>
            )}

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Ton prix proposé (€ / place) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min={1}
                  max={500}
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  placeholder="Ex : 25"
                  required
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Petit mot (optionnel)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Ex : Je suis flexible sur l'horaire, possible de partir 15min plus tôt ?"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>

              {!isSignedIn && (
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Ton prénom (optionnel)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    placeholder="Ex : Sarah"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {!isSignedIn && (
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Ton email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={120}
                    placeholder="pour qu'il puisse te répondre"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Ton WhatsApp (optionnel)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={30}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}
              {status === "ok" && (
                <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-300 text-sm">
                  ✓ Proposition envoyée au conducteur. Il te recontactera.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="rounded-md px-4 py-2 text-muted-foreground text-sm hover:text-foreground"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "ok"}
                  className="rounded-md bg-[#E50914] px-4 py-2 font-medium text-white text-sm transition hover:bg-[#b8070f] disabled:opacity-50"
                >
                  {status === "loading"
                    ? "Envoi..."
                    : hasSuggestion
                      ? "Envoyer la suggestion"
                      : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
