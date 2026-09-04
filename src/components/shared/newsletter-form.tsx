"use client";

import { useId, useState } from "react";

type NewsletterFormProps = {
  source?: string;
  /** "dark" pour les surfaces sombres (footer), "light" pour le reste du site. */
  tone?: "light" | "dark";
};

export function NewsletterForm({
  source = "footer",
  tone = "light",
}: NewsletterFormProps) {
  const inputId = useId();
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

  const isDark = tone === "dark";
  const inputClass = isDark
    ? "flex-1 rounded-full border border-white/[0.18] bg-white/[0.04] px-5 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-[#ff5252]/60 focus:outline-none focus:ring-2 focus:ring-[#ff5252]/30"
    : "flex-1 rounded-full border border-ash bg-white px-5 py-3 text-paper text-sm placeholder:text-paper-mute transition-colors focus:border-blood/50 focus:outline-none focus:ring-2 focus:ring-blood/20";
  const buttonClass = isDark
    ? "rounded-full bg-[#e31818] px-6 py-3 font-medium text-sm text-white transition-colors hover:bg-[#ff2d2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5252]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0f] disabled:opacity-50"
    : "rounded-full bg-blood px-6 py-3 font-medium text-sm text-white transition-colors hover:bg-blood-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood/40 disabled:opacity-50";
  const noteClass = isDark ? "text-white/40" : "text-paper-mute";
  const okClass = isDark ? "text-emerald-300" : "text-success";
  const errorClass = isDark ? "text-red-300" : "text-error";

  return (
    <form className="space-y-3" onSubmit={submit}>
      <label className="sr-only" htmlFor={inputId}>
        Adresse email pour la newsletter
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          autoComplete="email"
          className={inputClass}
          id={inputId}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          required
          type="email"
          value={email}
        />
        <button
          className={buttonClass}
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Envoi…" : "Je m’inscris"}
        </button>
      </div>
      <p className={`text-[11px] leading-relaxed ${noteClass}`}>
        1 à 2 emails par semaine maximum. Ce n’est pas un compte : ton adresse
        sert uniquement à recevoir ces informations, et tu peux te désinscrire à
        tout moment.
      </p>
      <output
        aria-live="polite"
        className={`block text-xs ${status === "ok" ? okClass : errorClass}`}
      >
        {message}
      </output>
    </form>
  );
}
