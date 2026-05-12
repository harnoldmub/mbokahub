import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

type Props = {
  proId: string;
  proDisplayName: string;
  ownerEmail?: string | null;
};

export function AdminAsProBanner({ proId, proDisplayName, ownerEmail }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-amber-500 bg-amber-500 p-4 text-black shadow-lg">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest">
            Mode admin — Tu agis au nom d&apos;un prestataire
          </p>
          <p className="mt-1 text-sm font-semibold">
            {proDisplayName}
            {ownerEmail ? (
              <span className="ml-2 font-mono text-xs font-normal opacity-80">
                ({ownerEmail})
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/pro/${proId}?from=admin`}
          className="inline-flex items-center rounded-md border border-black/30 bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
        >
          Voir la fiche publique
        </Link>
        <Link
          href="/admin/pros"
          className="inline-flex items-center gap-1 rounded-md border border-black/30 bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/80"
        >
          <ArrowLeft className="size-3.5" />
          Retour à l&apos;admin
        </Link>
      </div>
    </div>
  );
}
