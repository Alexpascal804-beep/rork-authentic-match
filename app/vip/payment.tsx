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
  CreditCard,
  Smartphone,
  DollarSign,
  Lock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react-native";
import { router } from "expo-router";
import { useVIP, PaymentMethod, VIP_PRICE, VIP_PRICE_XAF } from "@/contexts/VIPContext";
import Colors from "@/constants/colors";

type PaymentStep = "select" | "card" | "momo" | "paypal" | "success";

export default function PaymentScreen() {
  const { subscribe } = useVIP();
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");

  const [momoNumber, setMomoNumber] = useState("");

  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    switch (method) {
      case "card":
        setStep("card");
        break;
      case "mtn-momo":
        setStep("momo");
        break;
      case "paypal":
        setStep("paypal");
        break;
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        if (!selectedMethod) {
          Alert.alert("Error", "Please select a payment method");
          return;
        }

        await subscribe(selectedMethod);
        setIsProcessing(false);
        setStep("success");
      } catch {
        setIsProcessing(false);
        Alert.alert("Error", "Payment failed. Please try again.");
      }
    }, 2000);
  };

  const handleBackToHome = () => {
    router.replace("/(tabs)" as any);
  };

  const renderSelectMethod = () => (
    <View style={styles.methodsContainer}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.subtitle}>
        Select how you&apos;d like to pay for VIP access
      </Text>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleSelectMethod("card")}
        activeOpacity={0.7}
      >
        <View style={[styles.methodIcon, styles.iconCard]}>
          <CreditCard color={Colors.coral} size={28} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Credit / Debit Card</Text>
          <Text style={styles.methodSubtitle}>Visa, Mastercard, Amex</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleSelectMethod("mtn-momo")}
        activeOpacity={0.7}
      >
        <View style={[styles.methodIcon, styles.iconMomo]}>
          <Smartphone color="#FFCC00" size={28} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>MTN Mobile Money</Text>
          <Text style={styles.methodSubtitle}>Pay with MTN MoMo</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleSelectMethod("paypal")}
        activeOpacity={0.7}
      >
        <View style={[styles.methodIcon, styles.iconPaypal]}>
          <DollarSign color="#0070BA" size={28} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>PayPal</Text>
          <Text style={styles.methodSubtitle}>Fast & secure payments</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.securityNote}>
        <Lock color={Colors.mediumGray} size={16} />
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure
        </Text>
      </View>
    </View>
  );

  const renderCardForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Card Details</Text>
      <Text style={styles.subtitle}>
        Amount: {VIP_PRICE} ({VIP_PRICE_XAF})
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={cardName}
          onChangeText={setCardName}
          placeholder="John Doe"
          placeholderTextColor={Colors.mediumGray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
          placeholderTextColor={Colors.mediumGray}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={cardExpiry}
            onChangeText={setCardExpiry}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            placeholderTextColor={Colors.mediumGray}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cardCVV}
            onChangeText={setCardCVV}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            placeholderTextColor={Colors.mediumGray}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handleProcessPayment}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? "Processing..." : `Pay ${VIP_PRICE}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMomoForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>MTN Mobile Money</Text>
      <Text style={styles.subtitle}>
        Amount: {VIP_PRICE_XAF} ({VIP_PRICE})
      </Text>

      <View style={styles.momoInstructions}>
        <Text style={styles.instructionTitle}>How it works:</Text>
        <Text style={styles.instructionText}>
          1. Enter your MTN Mobile Money number{"\n"}
          2. You&apos;ll receive a prompt on your phone{"\n"}
          3. Enter your PIN to complete the payment
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>MTN MoMo Number</Text>
        <TextInput
          style={styles.input}
          value={momoNumber}
          onChangeText={setMomoNumber}
          placeholder="97 XX XX XX XX"
          keyboardType="phone-pad"
          maxLength={15}
          placeholderTextColor={Colors.mediumGray}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handleProcessPayment}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? "Processing..." : `Pay ${VIP_PRICE_XAF}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaypalForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>PayPal Payment</Text>
      <Text style={styles.subtitle}>
        Amount: {VIP_PRICE} ({VIP_PRICE_XAF})
      </Text>

      <View style={styles.momoInstructions}>
        <Text style={styles.instructionTitle}>Secure PayPal checkout</Text>
        <Text style={styles.instructionText}>
          You&apos;ll be redirected to PayPal to complete your payment securely
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PayPal Email</Text>
        <TextInput
          style={styles.input}
          value={paypalEmail}
          onChangeText={setPaypalEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.mediumGray}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handleProcessPayment}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? "Processing..." : `Continue to PayPal`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <CheckCircle color="#4CAF50" size={80} fill="#E8F5E9" />
      </View>
      <Text style={styles.successTitle}>Welcome to VIP!</Text>
      <Text style={styles.successText}>
        Your subscription is now active. Enjoy all the premium features!
      </Text>
      <TouchableOpacity
        style={styles.successButton}
        onPress={handleBackToHome}
        activeOpacity={0.8}
      >
        <Text style={styles.successButtonText}>Start Exploring</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {step !== "success" && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === "select") {
              router.back();
            } else {
              setStep("select");
              setSelectedMethod(null);
            }
          }}
        >
          <ArrowLeft color={Colors.warmGray} size={24} />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === "select" && renderSelectMethod()}
        {step === "card" && renderCardForm()}
        {step === "momo" && renderMomoForm()}
        {step === "paypal" && renderPaypalForm()}
        {step === "success" && renderSuccess()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  backButton: {
    position: "absolute" as const,
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
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
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
    marginBottom: 32,
  },
  methodsContainer: {
    flex: 1,
  },
  methodCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  iconCard: {
    backgroundColor: Colors.coralLight,
  },
  iconMomo: {
    backgroundColor: "#FFF9E6",
  },
  iconPaypal: {
    backgroundColor: "#E3F2FD",
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  securityNote: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 13,
    color: Colors.mediumGray,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.warmGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  row: {
    flexDirection: "row" as const,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  payButton: {
    backgroundColor: Colors.coral,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  momoInstructions: {
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FFCC00",
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.mediumGray,
    lineHeight: 22,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  successIcon: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  successText: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  successButton: {
    backgroundColor: Colors.coral,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
});
