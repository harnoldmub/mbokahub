import { LockKeyhole, MessageCircle } from "lucide-react";
import Link from "next/link";

type ContactLockProps = {
  value: string;
  unlocked?: boolean;
  rawValue?: string;
};

function whatsappLink(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export function ContactLock({ value, unlocked, rawValue }: ContactLockProps) {
  if (unlocked) {
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

  return (
    <Link
      href="/vip"
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      title="Devenir VIP pour débloquer"
    >
      <LockKeyhole aria-hidden className="size-4 text-primary" />
      <span className="select-none blur-sm">{value}</span>
    </Link>
  );
}
