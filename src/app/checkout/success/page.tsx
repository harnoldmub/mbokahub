import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Paiement confirmé · Mboka Hub",
};

type Search = Promise<{ type?: string; session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const { type } = await searchParams;

  const messages: Record<string, { title: string; body: string; cta: string; href: string }> = {
    vip: {
      title: "Bienvenue dans la Famille Mboka VIP",
      body: "Ton statut VIP est en cours d'activation. Tu peux dès maintenant accéder à la Famille Mboka privée et débloquer les contacts pros.",
      cta: "Aller au tableau de bord",
      href: "/dashboard",
    },
    pro: {
      title: "Inscription pro confirmée",
      body: "Ton paiement de 19,99 € est validé. Tu peux compléter ton profil pro et il sera publié après validation par l'équipe.",
      cta: "Compléter mon profil pro",
      href: "/dashboard/profil-pro",
    },
    boost: {
      title: "Boost activé",
      body: "Ton annonce ou ton profil va apparaître en tête de liste pendant 7 jours.",
      cta: "Retour au tableau de bord",
      href: "/dashboard",
    },
  };

  const m = messages[type ?? ""] ?? {
    title: "Paiement reçu",
    body: "Merci pour ton soutien à la Famille Mboka.",
    cta: "Retour à l'accueil",
    href: "/",
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-green-500/15 text-green-300">
        <CheckCircle2 aria-hidden className="size-10" />
      </div>
      <h1 className="mt-8 font-display text-4xl text-foreground md:text-5xl">
        {m.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground text-lg leading-8">
        {m.body}
      </p>
      <Link
        className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90"
        href={m.href}
      >
        {m.cta}
      </Link>
      <p className="mt-6 text-muted-foreground text-xs">
        Un email de confirmation va t'arriver dans quelques minutes.
      </p>
    </div>
  );
}
