import {
  PRICE_BOOST_EUR,
  PRICE_PRO_EUR,
  PRICE_VIP_EUR,
  formatEuro,
} from "@/lib/marketing-data";

export const PRICE_VIP_EARLY_BIRD_EUR = 6.99;

export const EARLY_BIRD_DEADLINE = new Date("2026-04-28T23:59:59+02:00");

export const EVENT_END = new Date("2026-05-31T23:59:59+02:00");

export function isEarlyBirdActive(now: Date = new Date()): boolean {
  return now.getTime() <= EARLY_BIRD_DEADLINE.getTime();
}

export function vipDisplayPrice(now: Date = new Date()): number {
  return isEarlyBirdActive(now) ? PRICE_VIP_EARLY_BIRD_EUR : PRICE_VIP_EUR;
}

export function vipPriceLabel(now: Date = new Date()): string {
  return formatEuro(vipDisplayPrice(now));
}

export const PRICE_LABELS = {
  vip: formatEuro(PRICE_VIP_EUR),
  vipEarlyBird: formatEuro(PRICE_VIP_EARLY_BIRD_EUR),
  pro: formatEuro(PRICE_PRO_EUR),
  boost: formatEuro(PRICE_BOOST_EUR),
};
