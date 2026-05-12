"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: 24,
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#E50914",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Nevent · Erreur
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              margin: "16px 0 12px",
            }}
          >
            On a eu un souci
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "#bdbdbd",
              margin: "0 0 24px",
            }}
          >
            L&apos;application a rencontré une erreur inattendue. Tu peux
            recharger la page.
            {error.digest ? (
              <>
                <br />
                <span style={{ fontFamily: "monospace", fontSize: 11 }}>
                  Réf : {error.digest}
                </span>
              </>
            ) : null}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#E50914",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 999,
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
