import { MessageCircle } from "lucide-react";
import Link from "next/link";

type ContactLockProps = {
  value: string;
  /**
   * Conservé pour compat. avec les appels existants — n'a plus d'effet.
   * Nevent est désormais gratuit pour tous les fans : le contact est
   * toujours révélé.
   */
  unlocked?: boolean;
  rawValue?: string;
};

function whatsappLink(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export function ContactLock({ value, rawValue }: ContactLockProps) {
  const real = rawValue ?? value;
  return (
    <Link
      href={whatsappLink(real)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-mono text-foreground hover:text-primary transition-colors"
    >
      <MessageCircle aria-hidden className="size-4 text-primary" />
      <span>{real}</span>
    </Link>
  );
}
