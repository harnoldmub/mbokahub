"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mboka-hub-cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
};

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function save(consent: Omit<Consent, "necessary" | "acceptedAt">) {
    const value: Consent = {
      necessary: true,
      ...consent,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      document.cookie = `mboka_cookie_consent=${encodeURIComponent(
        JSON.stringify(value),
      )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#d7dbe2] bg-white p-4 shadow-[0_24px_80px_-45px_rgba(20,20,20,0.45)] sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-smoke text-base">
            •
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg">
              Cookies & vie privée
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Mboka Hub utilise des cookies pour faire fonctionner le site,
              mesurer l'audience et améliorer l'expérience. Tu choisis ce que tu
              acceptes.{" "}
              <Link
                href="/confidentialite"
                className="text-blood underline underline-offset-2 hover:text-blood-deep"
              >
                Politique de confidentialité
              </Link>
              .
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3 rounded-lg border border-[#d7dbe2] bg-smoke p-4 text-sm">
                <Row
                  label="Nécessaires"
                  description="Connexion, sécurité, préférences de langue. Toujours actifs."
                  checked={true}
                  disabled
                />
                <Row
                  label="Mesure d'audience"
                  description="Statistiques anonymes pour comprendre l'usage du site."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <Row
                  label="Marketing"
                  description="Personnalisation des annonces et partenariats."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="rounded-md border border-[#d7dbe2] px-4 py-2 text-foreground text-sm hover:bg-smoke"
          >
            {showDetails ? "Masquer" : "Personnaliser"}
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="rounded-md border border-[#d7dbe2] px-4 py-2 text-foreground text-sm hover:bg-smoke"
          >
            Refuser tout
          </button>
          {showDetails ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className="rounded-md bg-[#202124] px-4 py-2 text-sm text-white hover:bg-black"
            >
              Enregistrer mes choix
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
              className="rounded-md bg-[#202124] px-4 py-2 text-sm text-white hover:bg-black"
            >
              Tout accepter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-4 accent-blood"
      />
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-muted-foreground text-xs">{description}</div>
      </div>
    </label>
  );
}
