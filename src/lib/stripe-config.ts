import {
  PRICE_BOOST_EUR,
  PRICE_PRO_EUR,
  formatEuro,
} from "@/lib/marketing-data";

// Fin théorique de la fenêtre concert — sert encore de butoir pour les
// activations Premium / Boost (cf. webhook Stripe).
export const EVENT_END = new Date("2026-05-31T23:59:59+02:00");

// Le pass VIP Fan a été retiré (fans 100% gratuits). On ne conserve plus que
// les libellés des produits actifs : badge Pro et Boost.
export const PRICE_LABELS = {
  pro: formatEuro(PRICE_PRO_EUR),
  boost: formatEuro(PRICE_BOOST_EUR),
};
