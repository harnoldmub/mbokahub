"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";

type ProInfo = {
  id: string;
  displayName: string;
  ownerEmail: string | null;
};

export function AdminAsProBannerSticky({ isAdmin }: { isAdmin: boolean }) {
  const sp = useSearchParams();
  const proId = sp?.get("as") ?? null;
  const [info, setInfo] = useState<ProInfo | null>(null);

  useEffect(() => {
    if (!isAdmin || !proId) {
      setInfo(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/admin/pros/${proId}/light`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && data.id) setInfo(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAdmin, proId]);

  if (!isAdmin || !proId) return null;

  return (
    <div className="sticky top-0 z-40 -mx-6 mb-4 border-b-2 border-amber-600 bg-amber-500 px-6 py-3 text-black shadow-md lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest">
              Mode admin — Tu agis au nom d&apos;un prestataire
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {info?.displayName ?? `Pro ${proId.slice(0, 8)}…`}
              {info?.ownerEmail ? (
                <span className="ml-2 font-mono text-xs font-normal opacity-80">
                  ({info.ownerEmail})
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
            Quitter le mode admin
          </Link>
        </div>
      </div>
    </div>
  );
}
