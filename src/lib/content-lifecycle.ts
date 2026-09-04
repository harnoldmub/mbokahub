/**
 * Cycle de vie des contenus datés (trajets, afters).
 *
 * Les listes filtrent sur `date >= maintenant`, si bien qu'un contenu passé
 * disparaît sans un mot : c'est ce qui a vidé le site après l'événement de mai
 * 2026 sans que rien ne le signale. Les pages de détail, elles, restent
 * accessibles par lien direct ou par le référencement — elles doivent donc dire
 * qu'elles sont périmées plutôt que de proposer d'écrire au conducteur d'un
 * trajet parti depuis quatre mois.
 */

/** Un contenu daté reste d'actualité jusqu'à la fin de son jour. */
export function isPast(date: Date, now: Date = new Date()): boolean {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay.getTime() < now.getTime();
}

/** « il y a 4 mois », « hier » — pour situer un contenu archivé. */
export function timeAgoLabel(date: Date, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (days < 1) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(days / 365);
  return years === 1 ? "il y a un an" : `il y a ${years} ans`;
}
