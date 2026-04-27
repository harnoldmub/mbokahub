import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

const FROM = process.env.RESEND_FROM_EMAIL || "Mboka Hub <hello@mbokahub.com>";

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "https://mbokahub.com");

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — email skipped:", to, subject);
    return { ok: false, skipped: true as const };
  }
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text,
    });
    if (result.error) {
      console.error("[email] resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (e) {
    console.error("[email] send threw:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "unknown",
    };
  }
}

function emailLayout(title: string, body: string) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:24px;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e5e5;">
    <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px;">
      <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.3em;color:#E50914;margin-bottom:24px;text-transform:uppercase;">
        Mboka Hub · Stade de France
      </div>
      ${body}
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0;" />
      <p style="font-size:12px;color:#888;margin:0;">
        Mboka Hub · Plateforme indépendante pour la diaspora<br/>
        <a href="${PUBLIC_URL}" style="color:#E50914;text-decoration:none;">${PUBLIC_URL.replace(/^https?:\/\//, "")}</a>
      </p>
    </div>
  </body>
</html>`;
}

export async function sendProValidatedEmail(args: {
  to: string;
  displayName: string;
  proId: string;
  category: string;
}) {
  const profileUrl = `${PUBLIC_URL}/pro/${args.proId}`;
  const annuaireUrl = `${PUBLIC_URL}/prestataires`;

  const body = `
    <h1 style="font-size:28px;font-weight:800;color:#fff;margin:0 0 16px;line-height:1.2;">
      Ton profil est en ligne ✅
    </h1>
    <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 24px;">
      Salut <strong style="color:#fff;">${escapeHtml(args.displayName)}</strong>,
    </p>
    <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 24px;">
      Bonne nouvelle : ton profil <strong style="color:#fff;">${escapeHtml(args.category)}</strong> vient d'être validé par notre équipe. Tu es désormais visible dans l'annuaire des prestataires Mboka Hub pour le week-end Fally Ipupa au Stade de France (2 & 3 mai 2026).
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${profileUrl}" style="display:inline-block;background:#E50914;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;">
        Voir mon profil public
      </a>
    </div>
    <h2 style="font-size:18px;font-weight:700;color:#fff;margin:32px 0 12px;">
      Maximise ta visibilité
    </h2>
    <ul style="font-size:14px;line-height:1.7;color:#c4c4c4;padding-left:20px;margin:0 0 24px;">
      <li>Partage le lien de ton profil sur tes réseaux : <a href="${profileUrl}" style="color:#E50914;">${profileUrl.replace(/^https?:\/\//, "")}</a></li>
      <li>Réponds vite aux WhatsApp pour gagner des étoiles ⭐</li>
      <li>Pense au pack <strong style="color:#fff;">Boost (8,99€)</strong> ou <strong style="color:#fff;">Premium (19,99€)</strong> pour passer en tête de l'annuaire</li>
    </ul>
    <p style="font-size:14px;line-height:1.6;color:#a4a4a4;margin:0;">
      Une question ? Réponds simplement à cet email, on te lit.<br/>
      <a href="${annuaireUrl}" style="color:#E50914;text-decoration:none;">Voir l'annuaire complet →</a>
    </p>
  `;

  return sendEmail({
    to: args.to,
    subject: "✅ Ton profil Mboka Hub est en ligne",
    html: emailLayout("Profil validé", body),
    text: `Salut ${args.displayName}, ton profil ${args.category} vient d'être validé sur Mboka Hub. Tu es visible ici : ${profileUrl}`,
  });
}

export async function sendTrajetPriceSuggestionEmail(args: {
  to: string;
  displayName: string | null;
  villeDepart: string;
  villeArrivee: string;
  prixPublie: number;
  perPlaceFair: number;
  perPlaceMax: number;
  trajetId: string;
}) {
  const dashboardUrl = `${PUBLIC_URL}/dashboard/annonces`;
  const greeting = args.displayName
    ? `Salut ${escapeHtml(args.displayName)}`
    : "Salut";

  const body = `
    <h1 style="font-size:26px;font-weight:800;color:#fff;margin:0 0 16px;line-height:1.2;">
      Ton prix semble un peu élevé 💸
    </h1>
    <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 16px;">
      ${greeting},
    </p>
    <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 24px;">
      Merci d'avoir publié ton trajet <strong style="color:#fff;">${escapeHtml(args.villeDepart)} → ${escapeHtml(args.villeArrivee)}</strong> pour le week-end Fally Ipupa au Stade de France.
    </p>
    <div style="background:#1a1a1a;border:1px solid rgba(229,9,20,0.25);border-radius:16px;padding:20px;margin:0 0 24px;">
      <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#E50914;margin:0 0 12px;text-transform:uppercase;">
        Notre estimation
      </div>
      <p style="font-size:15px;line-height:1.6;color:#d4d4d4;margin:0 0 8px;">
        Ton prix publié : <strong style="color:#fff;">${args.prixPublie} €</strong> par place
      </p>
      <p style="font-size:15px;line-height:1.6;color:#d4d4d4;margin:0;">
        Prix conseillé pour ce trajet : <strong style="color:#fff;">~${args.perPlaceFair} €</strong> par place (jusqu'à ${args.perPlaceMax} €)
      </p>
    </div>
    <p style="font-size:15px;line-height:1.6;color:#d4d4d4;margin:0 0 16px;">
      Notre estimation se base sur la distance, l'essence (~0,085 €/km) et les péages (~0,04 €/km), divisé par toi + tes passagers.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#d4d4d4;margin:0 0 24px;">
      Tu peux bien sûr garder ton prix, mais nos données montrent que les trajets dans la fourchette conseillée se remplissent <strong style="color:#fff;">2 à 3× plus vite</strong>. Si tu veux ajuster, tu peux modifier ton annonce en un clic depuis ton dashboard.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#E50914;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;">
        Modifier mon trajet
      </a>
    </div>
    <p style="font-size:14px;line-height:1.6;color:#a4a4a4;margin:0;">
      Une question ? Réponds simplement à ce mail, on te lit.
    </p>
  `;

  return sendEmail({
    to: args.to,
    subject: `💸 ${args.villeDepart} → ${args.villeArrivee} : ton prix est un peu au-dessus du conseillé`,
    html: emailLayout("Suggestion de prix", body),
    text: `${greeting}, ton trajet ${args.villeDepart} → ${args.villeArrivee} est publié à ${args.prixPublie}€/place. Le prix conseillé est ~${args.perPlaceFair}€ (jusqu'à ${args.perPlaceMax}€). Modifier : ${dashboardUrl}`,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
