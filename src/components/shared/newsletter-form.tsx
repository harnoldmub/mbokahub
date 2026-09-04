"use client";

import { useState } from "react";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setStatus("ok");
      setMessage("Merci ! Tu es inscrit·e.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blood">
          Newsletter Nevent
        </p>
        <p className="mt-2 text-sm text-paper">
          Reçois les{" "}
          <strong className="text-paper">
            nouveaux événements, alertes billetterie et bons plans utiles
          </strong>{" "}
          (trajets, services et afters) — 1 à 2 emails maximum par semaine,
          jamais de spam.
        </p>
        <p className="mt-1 text-[11px] text-paper-dim">
          Ce n&apos;est pas un compte : ton adresse sert uniquement à recevoir
          ces informations.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          aria-label="Email pour la newsletter"
          className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:border-blood/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-blood px-6 py-3 font-medium text-paper text-sm hover:bg-blood/90 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Recevoir la newsletter"}
        </button>
      </div>
      {message && (
        <p
          className={`text-xs ${status === "ok" ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
