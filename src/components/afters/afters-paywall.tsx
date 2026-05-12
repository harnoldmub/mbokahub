/**
 * Conservé pour compat. avec les anciens imports.
 * Nevent est désormais 100% gratuit pour les fans : plus de paywall.
 * Ce composant ne rend plus rien.
 */
type Props = {
  totalCount?: number;
  isAuthenticated?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AftersPaywall(_props: Props) {
  return null;
}
