import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GIFTS } from "@/constants/gifts";

export interface WalletTransaction {
  id: string;
  type: "gift_received" | "cashout" | "refund";
  amount: number;
  currency: string;
  giftId?: string;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  description: string;
  fee?: number;
}

export interface CashoutRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  method: "card" | "mtn-momo" | "paypal";
  status: "pending" | "processing" | "completed" | "rejected";
  timestamp: Date;
  paymentDetails?: {
    accountNumber?: string;
    email?: string;
    cardLastFour?: string;
  };
}

const CASHOUT_FEE_PERCENTAGE = 0.30;
const MIN_CASHOUT_AMOUNT = 10;

export const [WalletProvider, useWallet] = createContextHook(() => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [cashoutRequests, setCashoutRequests] = useState<CashoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const balanceData = await AsyncStorage.getItem("wallet_balance");
      const transactionsData = await AsyncStorage.getItem("wallet_transactions");
      const cashoutData = await AsyncStorage.getItem("wallet_cashouts");

      if (balanceData) {
        setBalance(parseFloat(balanceData));
      }

      if (transactionsData) {
        const parsed = JSON.parse(transactionsData);
        setTransactions(
          parsed.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          }))
        );
      }

      if (cashoutData) {
        const parsed = JSON.parse(cashoutData);
        setCashoutRequests(
          parsed.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          }))
        );
      }
    } catch (error) {
      console.log("Error loading wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWalletData = async (
    newBalance: number,
    newTransactions: WalletTransaction[]
  ) => {
    try {
      await AsyncStorage.setItem("wallet_balance", newBalance.toString());
      await AsyncStorage.setItem(
        "wallet_transactions",
        JSON.stringify(newTransactions)
      );
    } catch (error) {
      console.log("Error saving wallet data:", error);
    }
  };

  const saveCashoutRequests = async (requests: CashoutRequest[]) => {
    try {
      await AsyncStorage.setItem("wallet_cashouts", JSON.stringify(requests));
    } catch (error) {
      console.log("Error saving cashout requests:", error);
    }
  };

  const addGiftIncome = (giftId: string, senderId: string) => {
    const gift = GIFTS.find((g) => g.id === giftId);
    if (!gift) return;

    const newTransaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: "gift_received",
      amount: gift.price,
      currency: gift.currency,
      giftId: gift.id,
      status: "completed",
      timestamp: new Date(),
      description: `Received ${gift.name} from viewer`,
    };

    const newBalance = balance + gift.price;
    const newTransactions = [newTransaction, ...transactions];

    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWalletData(newBalance, newTransactions);

    console.log(`Added ${gift.price} ${gift.currency} to wallet. New balance: ${newBalance}`);
  };

  const calculateCashoutFee = (amount: number): number => {
    return parseFloat((amount * CASHOUT_FEE_PERCENTAGE).toFixed(2));
  };

  const requestCashout = async (
    amount: number,
    method: "card" | "mtn-momo" | "paypal",
    paymentDetails: {
      accountNumber?: string;
      email?: string;
      cardLastFour?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    if (amount < MIN_CASHOUT_AMOUNT) {
      return {
        success: false,
        error: `Minimum cashout amount is ${MIN_CASHOUT_AMOUNT}`,
      };
    }

    if (amount > balance) {
      return {
        success: false,
        error: "Insufficient balance",
      };
    }

    const fee = calculateCashoutFee(amount);
    const netAmount = amount - fee;

    const cashoutRequest: CashoutRequest = {
      id: `cashout-${Date.now()}`,
      userId: "current-user",
      amount,
      currency: "USD",
      fee,
      netAmount,
      method,
      status: "completed",
      timestamp: new Date(),
      paymentDetails,
    };

    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: "cashout",
      amount: -amount,
      currency: "USD",
      status: "completed",
      timestamp: new Date(),
      description: `Cashout via ${method} (30% fee applied)`,
      fee,
    };

    const newBalance = balance - amount;
    const newTransactions = [transaction, ...transactions];
    const newCashouts = [cashoutRequest, ...cashoutRequests];

    setBalance(newBalance);
    setTransactions(newTransactions);
    setCashoutRequests(newCashouts);

    await saveWalletData(newBalance, newTransactions);
    await saveCashoutRequests(newCashouts);

    console.log(`Cashout completed automatically: ${netAmount.toFixed(2)} (after 30% fee)`);

    return { success: true };
  };

  const getPendingCashouts = () => {
    return cashoutRequests.filter((c) => c.status === "pending");
  };

  const getCompletedCashouts = () => {
    return cashoutRequests.filter((c) => c.status === "completed");
  };

  return {
    balance,
    transactions,
    cashoutRequests,
    isLoading,
    addGiftIncome,
    requestCashout,
    calculateCashoutFee,
    getPendingCashouts,
    getCompletedCashouts,
    minCashoutAmount: MIN_CASHOUT_AMOUNT,
    cashoutFeePercentage: CASHOUT_FEE_PERCENTAGE * 100,
  };
});
