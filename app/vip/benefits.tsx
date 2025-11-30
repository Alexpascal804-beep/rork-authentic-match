import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Crown,
  Heart,
  Eye,
  Zap,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  Ban,
  X,
  MapPin,
} from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useVIP, VIP_FEATURES, VIP_PRICE, VIP_PRICE_XAF } from "@/contexts/VIPContext";
import Colors from "@/constants/colors";

const FEATURE_ICONS: Record<string, any> = {
  unlimitedLikes: Heart,
  advancedFilters: Zap,
  distanceControl: MapPin,
  seeWhoLikedYou: Eye,
  priorityVisibility: TrendingUp,
  readReceipts: CheckCircle2,
  rewindPasses: RotateCcw,
  boosts: TrendingUp,
  adFree: Ban,
};

export default function VIPBenefitsScreen() {
  const { isVIP, subscription } = useVIP();

  const handleSubscribe = () => {
    router.push("/vip/payment" as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <X color={Colors.warmGray} size={24} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={["#FFD700", "#FFA500", "#FF6B6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.crownContainer}>
            <Crown color="#FFF" size={64} fill="#FFF" />
          </View>
          <Text style={styles.heroTitle}>Benin-Meet VIP</Text>
          <Text style={styles.heroSubtitle}>
            Unlock premium features and find your match faster
          </Text>
        </LinearGradient>

        {isVIP ? (
          <View style={styles.activeSubscriptionCard}>
            <View style={styles.activeHeader}>
              <Crown color="#FFD700" size={24} fill="#FFD700" />
              <Text style={styles.activeTitle}>VIP Active</Text>
            </View>
            <Text style={styles.activeText}>
              Your subscription is active until{" "}
              {subscription.expiresAt?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.activePaymentMethod}>
              Payment method: {subscription.paymentMethod?.toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>{VIP_PRICE}/month</Text>
            <Text style={styles.priceXAF}>{VIP_PRICE_XAF}/month</Text>
            <Text style={styles.priceSubtext}>
              Cancel anytime • Auto-renews monthly
            </Text>
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          
          {Object.entries(VIP_FEATURES).map(([key, feature]) => {
            const Icon = FEATURE_ICONS[key] || CheckCircle2;
            return (
              <View key={key} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Icon color="#FFD700" size={24} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What VIP Members Say</Text>
          
          <View style={styles.testimonial}>
            <Text style={styles.testimonialText}>
              &ldquo;The unlimited likes helped me find my perfect match in just 2 weeks!&rdquo;
            </Text>
            <Text style={styles.testimonialAuthor}>- Sarah, Lagos</Text>
          </View>

          <View style={styles.testimonial}>
            <Text style={styles.testimonialText}>
              &ldquo;Being able to see who liked me made everything so much easier.&rdquo;
            </Text>
            <Text style={styles.testimonialAuthor}>- David, Cotonou</Text>
          </View>
        </View>

        {!isVIP && (
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscribeGradient}
            >
              <Crown color="#FFF" size={24} fill="#FFF" />
              <Text style={styles.subscribeText}>Get VIP Access</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure payment • Cancel anytime
          </Text>
          <Text style={styles.footerSubtext}>
            Terms apply. Subscription auto-renews monthly.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  closeButton: {
    position: "absolute" as const,
    top: Platform.OS === "ios" ? 60 : 40,
    right: 20,
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
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  crownContainer: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center" as const,
    opacity: 0.95,
  },
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: "800" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  priceXAF: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
    marginBottom: 8,
  },
  priceSubtext: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  activeSubscriptionCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  activeHeader: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  activeText: {
    fontSize: 16,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  activePaymentMethod: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.warmGray,
    flex: 1,
  },
  testimonialsSection: {
    marginBottom: 32,
  },
  testimonial: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  testimonialText: {
    fontSize: 15,
    color: Colors.warmGray,
    fontStyle: "italic" as const,
    marginBottom: 8,
    lineHeight: 22,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeGradient: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.mediumGray,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: "center" as const,
  },
});
