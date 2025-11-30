import { Gift } from "@/types";

export const GIFTS: Gift[] = [
  {
    id: "gift-1",
    name: "Rose",
    icon: "🌹",
    price: 0.99,
    currency: "USD",
  },
  {
    id: "gift-2",
    name: "Heart",
    icon: "❤️",
    price: 1.99,
    currency: "USD",
  },
  {
    id: "gift-3",
    name: "Diamond",
    icon: "💎",
    price: 4.99,
    currency: "USD",
  },
  {
    id: "gift-4",
    name: "Crown",
    icon: "👑",
    price: 9.99,
    currency: "USD",
  },
  {
    id: "gift-5",
    name: "Fire",
    icon: "🔥",
    price: 2.99,
    currency: "USD",
  },
  {
    id: "gift-6",
    name: "Star",
    icon: "⭐",
    price: 1.49,
    currency: "USD",
  },
  {
    id: "gift-7",
    name: "Champagne",
    icon: "🍾",
    price: 7.99,
    currency: "USD",
  },
  {
    id: "gift-8",
    name: "Rocket",
    icon: "🚀",
    price: 14.99,
    currency: "USD",
  },
];

export function formatGiftPrice(price: number, currency: string = "USD"): string {
  if (currency === "USD") {
    return `$${price.toFixed(2)}`;
  }
  return `${price.toFixed(2)} ${currency}`;
}
