import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PaymentMethod = "card" | "mtn-momo" | "paypal";

export interface VIPSubscription {
  isVIP: boolean;
  subscribedAt?: Date;
  expiresAt?: Date;
  paymentMethod?: PaymentMethod;
}

export const VIP_FEATURES = {
  unlimitedLikes: "Unlimited daily likes",
  advancedFilters: "Advanced matching filters",
  seeWhoLikedYou: "See who liked you",
  priorityVisibility: "Priority profile visibility",
  readReceipts: "Read receipts in messages",
  rewindPasses: "Undo accidental passes",
  boosts: "Monthly profile boosts",
  adFree: "Ad-free experience",
};

export const VIP_BASE_PRICE_USD = 5;

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number; format: (amount: number) => string }> = {
  USD: { symbol: "$", rate: 1, format: (amount) => `${amount.toFixed(2)}` },
  EUR: { symbol: "€", rate: 0.92, format: (amount) => `€${amount.toFixed(2)}` },
  GBP: { symbol: "£", rate: 0.79, format: (amount) => `£${amount.toFixed(2)}` },
  XAF: { symbol: "XAF", rate: 3100, format: (amount) => `${Math.round(amount).toLocaleString()} XAF` },
  NGN: { symbol: "₦", rate: 1550, format: (amount) => `₦${Math.round(amount).toLocaleString()}` },
  GHS: { symbol: "₵", rate: 15.5, format: (amount) => `₵${amount.toFixed(2)}` },
  ZAR: { symbol: "R", rate: 18.5, format: (amount) => `R${amount.toFixed(2)}` },
  KES: { symbol: "KSh", rate: 645, format: (amount) => `KSh${Math.round(amount).toLocaleString()}` },
  CAD: { symbol: "C$", rate: 1.36, format: (amount) => `C${amount.toFixed(2)}` },
  AUD: { symbol: "A$", rate: 1.53, format: (amount) => `A${amount.toFixed(2)}` },
  INR: { symbol: "₹", rate: 416, format: (amount) => `₹${Math.round(amount).toLocaleString()}` },
  JPY: { symbol: "¥", rate: 750, format: (amount) => `¥${Math.round(amount).toLocaleString()}` },
  CNY: { symbol: "¥", rate: 36, format: (amount) => `¥${amount.toFixed(2)}` },
  BRL: { symbol: "R$", rate: 5.0, format: (amount) => `R${amount.toFixed(2)}` },
  MXN: { symbol: "MX$", rate: 17, format: (amount) => `MX${amount.toFixed(2)}` },
  AED: { symbol: "AED", rate: 18.36, format: (amount) => `AED${amount.toFixed(2)}` },
};

export function getVIPPrice(currencyCode: string = "USD"): string {
  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
  const amount = VIP_BASE_PRICE_USD * currency.rate;
  return currency.format(amount);
}

export const VIP_PRICE = getVIPPrice("USD");
export const VIP_PRICE_XAF = getVIPPrice("XAF");

const VIP_STORAGE_KEY = "@benin_meet_vip";

export const [VIPProvider, useVIP] = createContextHook(() => {
  const [subscription, setSubscription] = useState<VIPSubscription>({
    isVIP: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const stored = await AsyncStorage.getItem(VIP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : undefined;
        
        if (expiresAt && expiresAt < new Date()) {
          setSubscription({ isVIP: false });
          await AsyncStorage.removeItem(VIP_STORAGE_KEY);
        } else {
          setSubscription({
            ...parsed,
            subscribedAt: parsed.subscribedAt ? new Date(parsed.subscribedAt) : undefined,
            expiresAt,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load VIP subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (paymentMethod: PaymentMethod) => {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const newSubscription: VIPSubscription = {
      isVIP: true,
      subscribedAt: now,
      expiresAt,
      paymentMethod,
    };

    setSubscription(newSubscription);
    
    await AsyncStorage.setItem(
      VIP_STORAGE_KEY,
      JSON.stringify({
        ...newSubscription,
        subscribedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      })
    );
  };

  const cancelSubscription = async () => {
    setSubscription({ isVIP: false });
    await AsyncStorage.removeItem(VIP_STORAGE_KEY);
  };

  return {
    subscription,
    isVIP: subscription.isVIP,
    isLoading,
    subscribe,
    cancelSubscription,
  };
});
