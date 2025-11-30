import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { useWallet } from "@/contexts/WalletContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LightColors, DarkColors } from "@/constants/colors";

type CashoutStep = "method" | "details" | "confirm" | "success";
type CashoutMethod = "card" | "mtn-momo" | "paypal";

export default function CashoutScreen() {
  const { balance, requestCashout, calculateCashoutFee, minCashoutAmount, cashoutFeePercentage } = useWallet();
  const { isDark } = useTheme();
  const Colors = isDark ? DarkColors : LightColors;

  const [step, setStep] = useState<CashoutStep>("method");
  const [selectedMethod, setSelectedMethod] = useState<CashoutMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [amount, setAmount] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSelectMethod = (method: CashoutMethod) => {
    if (balance < minCashoutAmount) {
      Alert.alert(
        "Insufficient Balance",
        `Minimum cashout amount is $${minCashoutAmount}. Your balance: $${balance.toFixed(2)}`
      );
      return;
    }

    setSelectedMethod(method);
    setStep("details");
  };

  const handleContinue = () => {
    const cashoutAmount = parseFloat(amount);

    if (!cashoutAmount || cashoutAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (cashoutAmount < minCashoutAmount) {
      Alert.alert("Amount Too Low", `Minimum cashout amount is $${minCashoutAmount}`);
      return;
    }

    if (cashoutAmount > balance) {
      Alert.alert("Insufficient Balance", `Your balance is only $${balance.toFixed(2)}`);
      return;
    }

    if (selectedMethod === "card" && (!cardNumber || !cardName)) {
      Alert.alert("Missing Details", "Please fill in all card details");
      return;
    }

    if (selectedMethod === "mtn-momo" && !momoNumber) {
      Alert.alert("Missing Details", "Please enter your MTN MoMo number");
      return;
    }

    if (selectedMethod === "paypal" && !paypalEmail) {
      Alert.alert("Missing Details", "Please enter your PayPal email");
      return;
    }

    setStep("confirm");
  };

  const handleProcessCashout = async () => {
    setIsProcessing(true);

    const cashoutAmount = parseFloat(amount);
    const paymentDetails: any = {};

    if (selectedMethod === "card") {
      paymentDetails.cardLastFour = cardNumber.slice(-4);
    } else if (selectedMethod === "mtn-momo") {
      paymentDetails.accountNumber = momoNumber;
    } else if (selectedMethod === "paypal") {
      paymentDetails.email = paypalEmail;
    }

    const result = await requestCashout(cashoutAmount, selectedMethod!, paymentDetails);

    setTimeout(() => {
      setIsProcessing(false);

      if (result.success) {
        setStep("success");
      } else {
        Alert.alert("Cashout Failed", result.error || "Please try again");
      }
    }, 1500);
  };

  const renderMethodSelection = () => (
    <View style={styles.content}>
      <Text style={[styles.title, { color: Colors.textPrimary }]}>Cash Out</Text>
      <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
        Select withdrawal method
      </Text>

      <View style={[styles.balanceCard, { backgroundColor: isDark ? "#2D4A2D" : "#E8F5E9" }]}>
        <Text style={[styles.balanceLabel, { color: Colors.textSecondary }]}>Available Balance</Text>
        <Text style={[styles.balanceAmount, { color: Colors.green }]}>
          ${balance.toFixed(2)}
        </Text>
        <Text style={[styles.balanceNote, { color: Colors.textSecondary }]}>
          Min. withdrawal: ${minCashoutAmount} • Fee: {cashoutFeePercentage}%
        </Text>
      </View>

      <View style={styles.methodsContainer}>
        <TouchableOpacity
          style={[styles.methodCard, { backgroundColor: Colors.cardBackground }]}
          onPress={() => handleSelectMethod("card")}
          activeOpacity={0.7}
        >
          <View style={[styles.methodIcon, { backgroundColor: isDark ? "#4D2020" : Colors.coralLight }]}>
            <CreditCard color={Colors.coral} size={28} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: Colors.textPrimary }]}>Bank Card</Text>
            <Text style={[styles.methodSubtitle, { color: Colors.textSecondary }]}>
              Withdraw to card
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, { backgroundColor: Colors.cardBackground }]}
          onPress={() => handleSelectMethod("mtn-momo")}
          activeOpacity={0.7}
        >
          <View style={[styles.methodIcon, { backgroundColor: "#FFF9E6" }]}>
            <Smartphone color="#FFCC00" size={28} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: Colors.textPrimary }]}>MTN MoMo</Text>
            <Text style={[styles.methodSubtitle, { color: Colors.textSecondary }]}>
              Mobile Money
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, { backgroundColor: Colors.cardBackground }]}
          onPress={() => handleSelectMethod("paypal")}
          activeOpacity={0.7}
        >
          <View style={[styles.methodIcon, { backgroundColor: "#E3F2FD" }]}>
            <DollarSign color="#0070BA" size={28} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: Colors.textPrimary }]}>PayPal</Text>
            <Text style={[styles.methodSubtitle, { color: Colors.textSecondary }]}>
              Fast & secure
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetailsForm = () => {
    const cashoutAmount = parseFloat(amount || "0");
    const fee = calculateCashoutFee(cashoutAmount);
    const netAmount = cashoutAmount - fee;

    return (
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.textPrimary }]}>Enter Details</Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          {selectedMethod === "card" && "Bank card details"}
          {selectedMethod === "mtn-momo" && "MTN Mobile Money"}
          {selectedMethod === "paypal" && "PayPal account"}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: Colors.textPrimary }]}>Amount to withdraw</Text>
          <TextInput
            style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary, borderColor: Colors.border }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="decimal-pad"
          />
          {cashoutAmount > 0 && (
            <View style={[styles.feeBreakdown, { backgroundColor: isDark ? "#3D2A2A" : "#FFF9E6" }]}>
              <View style={styles.feeRow}>
                <Text style={[styles.feeLabel, { color: Colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.feeValue, { color: Colors.textPrimary }]}>
                  ${cashoutAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={[styles.feeLabel, { color: Colors.textSecondary }]}>
                  Fee ({cashoutFeePercentage}%)
                </Text>
                <Text style={[styles.feeValue, { color: Colors.coral }]}>
                  -${fee.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.feeRow, styles.feeRowTotal]}>
                <Text style={[styles.feeLabelTotal, { color: Colors.textPrimary }]}>You receive</Text>
                <Text style={[styles.feeValueTotal, { color: Colors.green }]}>
                  ${netAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {selectedMethod === "card" && (
          <>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors.textPrimary }]}>Cardholder Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary, borderColor: Colors.border }]}
                value={cardName}
                onChangeText={setCardName}
                placeholder="John Doe"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors.textPrimary }]}>Card Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary, borderColor: Colors.border }]}
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </>
        )}

        {selectedMethod === "mtn-momo" && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors.textPrimary }]}>MTN MoMo Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary, borderColor: Colors.border }]}
              value={momoNumber}
              onChangeText={setMomoNumber}
              placeholder="97 XX XX XX XX"
              keyboardType="phone-pad"
              maxLength={15}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        )}

        {selectedMethod === "paypal" && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: Colors.textPrimary }]}>PayPal Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary, borderColor: Colors.border }]}
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: Colors.coral }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderConfirmation = () => {
    const cashoutAmount = parseFloat(amount);
    const fee = calculateCashoutFee(cashoutAmount);
    const netAmount = cashoutAmount - fee;

    return (
      <View style={styles.content}>
        <View style={styles.confirmIcon}>
          <AlertCircle color={Colors.coral} size={64} />
        </View>
        
        <Text style={[styles.confirmTitle, { color: Colors.textPrimary }]}>Confirm Cashout</Text>
        <Text style={[styles.confirmSubtitle, { color: Colors.textSecondary }]}>
          Please review your withdrawal details
        </Text>

        <View style={[styles.confirmCard, { backgroundColor: Colors.cardBackground }]}>
          <View style={styles.confirmRow}>
            <Text style={[styles.confirmLabel, { color: Colors.textSecondary }]}>Method</Text>
            <Text style={[styles.confirmValue, { color: Colors.textPrimary }]}>
              {selectedMethod === "card" && "Bank Card"}
              {selectedMethod === "mtn-momo" && "MTN MoMo"}
              {selectedMethod === "paypal" && "PayPal"}
            </Text>
          </View>

          <View style={styles.confirmRow}>
            <Text style={[styles.confirmLabel, { color: Colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.confirmValue, { color: Colors.textPrimary }]}>
              ${cashoutAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.confirmRow}>
            <Text style={[styles.confirmLabel, { color: Colors.textSecondary }]}>Fee</Text>
            <Text style={[styles.confirmValue, { color: Colors.coral }]}>
              -${fee.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.confirmRow, styles.confirmRowTotal]}>
            <Text style={[styles.confirmLabelTotal, { color: Colors.textPrimary }]}>You Receive</Text>
            <Text style={[styles.confirmValueTotal, { color: Colors.green }]}>
              ${netAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.noteCard, { backgroundColor: isDark ? "#3D2A2A" : "#FFF9E6" }]}>
          <Text style={[styles.noteText, { color: Colors.textSecondary }]}>
            Instant processing with 30% fee • No admin approval needed
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: Colors.coral }, isProcessing && styles.buttonDisabled]}
          onPress={handleProcessCashout}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isProcessing ? "Processing..." : "Confirm Cashout"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSuccess = () => (
    <View style={styles.content}>
      <View style={styles.successIcon}>
        <CheckCircle color={Colors.green} size={80} fill={isDark ? "#2D4A2D" : "#E8F5E9"} />
      </View>
      
      <Text style={[styles.successTitle, { color: Colors.textPrimary }]}>Cashout Requested!</Text>
      <Text style={[styles.successText, { color: Colors.textSecondary }]}>
        Your withdrawal has been processed instantly! The funds will be transferred shortly.
      </Text>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: Colors.coral }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {step !== "success" && (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: Colors.cardBackground }]}
          onPress={() => {
            if (step === "method") {
              router.back();
            } else if (step === "details") {
              setStep("method");
              setSelectedMethod(null);
            } else if (step === "confirm") {
              setStep("details");
            }
          }}
        >
          <ArrowLeft color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === "method" && renderMethodSelection()}
        {step === "details" && renderDetailsForm()}
        {step === "confirm" && renderConfirmation()}
        {step === "success" && renderSuccess()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute" as const,
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "700" as const,
    marginBottom: 8,
  },
  balanceNote: {
    fontSize: 13,
  },
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  feeBreakdown: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  feeRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feeRowTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  feeLabel: {
    fontSize: 14,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  feeLabelTotal: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  feeValueTotal: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  continueButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  confirmIcon: {
    alignItems: "center",
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    textAlign: "center" as const,
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 16,
    textAlign: "center" as const,
    marginBottom: 32,
  },
  confirmCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  confirmRowTotal: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  confirmLabel: {
    fontSize: 15,
  },
  confirmValue: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  confirmLabelTotal: {
    fontSize: 17,
    fontWeight: "600" as const,
  },
  confirmValueTotal: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 14,
    textAlign: "center" as const,
  },
  successIcon: {
    alignItems: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    textAlign: "center" as const,
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    textAlign: "center" as const,
    marginBottom: 40,
  },
});
