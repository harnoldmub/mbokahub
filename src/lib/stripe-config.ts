import {
  formatEuro,
  PRICE_BOOST_EUR,
  PRICE_PRO_EUR,
} from "@/lib/marketing-data";

// Le pass VIP Fan a été retiré (fans 100% gratuits). On ne conserve plus que
// les libellés des produits actifs : badge Pro et Boost.
export const PRICE_LABELS = {
  pro: formatEuro(PRICE_PRO_EUR),
  boost: formatEuro(PRICE_BOOST_EUR),
};

/**
 * Durée des avantages payants, comptée à partir de l'achat.
 *
 * Ces échéances étaient auparavant figées au 31 mai 2026, la fin de
 * l'événement pour lequel le site avait été conçu. Cette date étant passée, un
 * achat effectué aujourd'hui — si `PAYMENTS_ENABLED` repassait à `true` —
 * accorderait un avantage déjà expiré : le client paierait pour rien.
 *
 * La durée du boost (7 jours) est celle déjà annoncée à l'acheteur sur la page
 * de confirmation. Celle du badge Premium n'était annoncée nulle part : 30
 * jours est une valeur par défaut à confirmer côté produit avant toute
 * réactivation des paiements.
 */
export const BOOST_DURATION_DAYS = 7;
export const PREMIUM_DURATION_DAYS = 30;

function addDays(from: Date, days: number): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + days);
  return end;
}

/** Échéance d'un boost acheté maintenant. */
export function boostEndsAt(from: Date = new Date()): Date {
  return addDays(from, BOOST_DURATION_DAYS);
}

/** Échéance d'une mise en avant Premium achetée maintenant. */
export function premiumEndsAt(from: Date = new Date()): Date {
  return addDays(from, PREMIUM_DURATION_DAYS);
}
