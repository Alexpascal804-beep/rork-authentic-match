import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router, Stack } from "expo-router";
import { Heart, Shield, Sparkles } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Heart color={Colors.coral} size={64} fill={Colors.coral} />
        </View>

        <Text style={styles.title}>Welcome to Connect</Text>
        <Text style={styles.subtitle}>
          Find meaningful connections built on authenticity and shared values
        </Text>

        <View style={styles.features}>
          <FeatureCard
            icon={<Sparkles color={Colors.coral} size={24} />}
            title="Smart Matching"
            description="AI-powered algorithm suggests compatible matches based on your personality and values"
          />
          <FeatureCard
            icon={<Shield color={Colors.coral} size={24} />}
            title="Safety First"
            description="Verified profiles and built-in safety features keep you protected"
          />
          <FeatureCard
            icon={<Heart color={Colors.coral} size={20} />}
            title="Quality Over Quantity"
            description="Daily limits encourage intentional connections, not endless swiping"
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/onboarding/personality-quiz")}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.secondaryButtonText}>
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.coralLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  features: {
    width: "100%",
    gap: 20,
  },
  featureCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.coralLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.mediumGray,
    lineHeight: 18,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.mediumGray,
  },
});
