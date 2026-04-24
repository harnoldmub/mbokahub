import { PRICE_BOOST_EUR, PRICE_PRO_EUR, PRICE_VIP_EUR } from "@/lib/marketing-data";

export const PRICE_VIP_EARLY_BIRD_EUR = 7;

export const EARLY_BIRD_DEADLINE = new Date("2026-04-30T23:59:59+02:00");

export const EVENT_END = new Date("2026-05-31T23:59:59+02:00");

export function isEarlyBirdActive(now: Date = new Date()): boolean {
  return now.getTime() <= EARLY_BIRD_DEADLINE.getTime();
}

export function vipDisplayPrice(now: Date = new Date()): number {
  return isEarlyBirdActive(now) ? PRICE_VIP_EARLY_BIRD_EUR : PRICE_VIP_EUR;
}

export function vipPriceLabel(now: Date = new Date()): string {
  return `${vipDisplayPrice(now)} €`;
}

export const PRICE_LABELS = {
  vip: `${PRICE_VIP_EUR} €`,
  vipEarlyBird: `${PRICE_VIP_EARLY_BIRD_EUR} €`,
  pro: `${PRICE_PRO_EUR} €`,
  boost: `${PRICE_BOOST_EUR} €`,
};
