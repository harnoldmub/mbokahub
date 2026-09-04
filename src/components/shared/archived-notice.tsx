import { History } from "lucide-react";

import { timeAgoLabel } from "@/lib/content-lifecycle";

type ArchivedNoticeProps = {
  /** Date de l'événement passé. */
  date: Date;
  /** Ce qui est archivé, tel qu'on le nomme à l'écran : « Ce trajet ». */
  subject: string;
  /** Où aller ensuite. */
  href: string;
  linkLabel: string;
};

/** Bandeau affiché en tête d'une fiche dont la date est passée. Il remplace les
 *  actions (contacter, réserver) plutôt que de les laisser cliquables. */
export function ArchivedNotice({
  date,
  subject,
  href,
  linkLabel,
}: ArchivedNoticeProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <History
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-amber-500"
        />
        <div>
          <p className="font-medium text-foreground text-sm">
            {subject} est terminé
          </p>
          <p className="mt-0.5 text-muted-foreground text-sm">
            La date est passée ({timeAgoLabel(date)}). Cette page reste
            consultable pour mémoire, mais il n&apos;est plus possible d&apos;y
            répondre.
          </p>
        </div>
      </div>
      <a
        className="shrink-0 rounded-full border border-amber-500/40 px-4 py-2 text-center font-mono text-[10px] text-amber-600 uppercase tracking-[0.15em] transition-colors hover:bg-amber-500/10 dark:text-amber-400"
        href={href}
      >
        {linkLabel}
      </a>
    </div>
  );
}
