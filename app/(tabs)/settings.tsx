import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  User,
  Shield,
  Bell,
  Heart,
  Filter,
  ChevronRight,
  LogOut,
  Crown,
  Languages,
  Moon,
  Sun,
  Smartphone,
  Wallet,
} from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useVIP } from "@/contexts/VIPContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallet } from "@/contexts/WalletContext";
import { languages } from "@/lib/i18n";
import { LightColors, DarkColors } from "@/constants/colors";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isVIP } = useVIP();
  const { currentLanguage } = useLanguage();
  const { theme, isDark, setTheme } = useTheme();
  const { balance } = useWallet();
  const [notifications, setNotifications] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const currentLanguageName = languages.find(l => l.code === currentLanguage)?.nativeName || "English";
  const Colors = isDark ? DarkColors : LightColors;

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Smartphone },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: Colors.textPrimary }]}>{t("settings.title")}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!isVIP && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.vipPromoBanner}
              onPress={() => router.push("/vip/benefits" as any)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#FFD700", "#FFA500", "#FF6B6B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.vipPromoGradient}
              >
                <View style={styles.vipPromoContent}>
                  <Crown color="#FFF" size={32} fill="#FFF" />
                  <View style={styles.vipPromoText}>
                    <Text style={styles.vipPromoTitle}>{t("settings.vipUpgrade")}</Text>
                    <Text style={styles.vipPromoSubtitle}>
                      {t("settings.vipBenefits")}
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#FFF" size={24} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {isVIP && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.vipActiveBanner}
              onPress={() => router.push("/vip/benefits" as any)}
              activeOpacity={0.9}
            >
              <View style={styles.vipActiveContent}>
                <Crown color="#FFD700" size={28} fill="#FFD700" />
                <View style={styles.vipActiveText}>
                  <Text style={styles.vipActiveTitle}>{t("settings.vipActive")}</Text>
                  <Text style={styles.vipActiveSubtitle}>
                    {t("settings.vipActiveDesc")}
                  </Text>
                </View>
              </View>
              <ChevronRight color={Colors.mediumGray} size={24} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>Wallet</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/wallet/cashout" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? "#2D4A2D" : "#E8F5E9" }]}>
                <Wallet color={Colors.green} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingText, { color: Colors.textPrimary }]}>Cash Out</Text>
                <Text style={[styles.settingDescription, { color: Colors.textSecondary }]}>
                  Balance: ${balance.toFixed(2)}
                </Text>
              </View>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>{t("settings.account")}</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/edit-profile" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconPrimary]}>
                <User color={Colors.coral} size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.editProfile")}</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/preferences" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconPrimary]}>
                <Filter color={Colors.coral} size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.datingPreferences")}</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/verification" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconSuccess]}>
                <Shield color={Colors.green} size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.verification")}</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>{t("settings.appearance")}</Text>
          
          <View style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? "#3D2A6E" : "#E8DEFF" }]}>
                {theme === "light" && <Sun color="#8B5CF6" size={20} />}
                {theme === "dark" && <Moon color="#8B5CF6" size={20} />}
                {theme === "system" && <Smartphone color="#8B5CF6" size={20} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.theme")}</Text>
                <Text style={[styles.settingDescription, { color: Colors.textSecondary }]}>
                  {theme === "light" ? t("settings.themeLight") : theme === "dark" ? t("settings.themeDark") : t("settings.themeSystem")}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.themeSelector, { backgroundColor: Colors.cardBackground }]}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    { borderColor: Colors.border },
                    isSelected && { borderColor: Colors.coral, backgroundColor: isDark ? "#4D2020" : Colors.coralLight },
                  ]}
                  onPress={() => setTheme(option.value)}
                  activeOpacity={0.7}
                >
                  <Icon 
                    color={isSelected ? Colors.coral : Colors.mediumGray} 
                    size={24} 
                  />
                  <Text style={[
                    styles.themeOptionLabel,
                    { color: isSelected ? Colors.coral : Colors.textSecondary },
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>{t("settings.discovery")}</Text>
          
          <View style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconPrimary]}>
                <Heart color={Colors.coral} size={20} />
              </View>
              <View>
                <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.dailyLikeLimit")}</Text>
                <Text style={[styles.settingDescription, { color: Colors.textSecondary }]}>
                  {t("settings.dailyLikeLimitDesc")}
                </Text>
              </View>
            </View>
            <Switch
              value={dailyLimit}
              onValueChange={setDailyLimit}
              trackColor={{ false: Colors.lightGray, true: Colors.coralLight }}
              thumbColor={dailyLimit ? Colors.coral : Colors.white}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconSuccess]}>
                <Shield color={Colors.green} size={20} />
              </View>
              <View>
                <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.verifiedOnly")}</Text>
                <Text style={[styles.settingDescription, { color: Colors.textSecondary }]}>
                  {t("settings.verifiedOnlyDesc")}
                </Text>
              </View>
            </View>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ false: Colors.lightGray, true: Colors.coralLight }}
              thumbColor={verifiedOnly ? Colors.coral : Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>{t("settings.privacySafety")}</Text>
          
          <View style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconWarning]}>
                <Bell color="#FFA500" size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.notifications")}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.coralLight }}
              thumbColor={notifications ? Colors.coral : Colors.white}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/safety-center" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconSuccess]}>
                <Shield color={Colors.green} size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.safetyCenter")}</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/blocked-users" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconDanger]}>
                <User color={Colors.red} size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.blockedUsers")}</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/settings/language" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.iconWarning]}>
                <Languages color="#FFA500" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingText, { color: Colors.textPrimary }]}>{t("settings.language")}</Text>
                <Text style={[styles.settingDescription, { color: Colors.textSecondary }]}>
                  {currentLanguageName}
                </Text>
              </View>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.mediumGray }]}>Admin</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: Colors.cardBackground }]}
            onPress={() => router.push("/admin/login" as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? "#3D2A6E" : "#E8DEFF" }]}>
                <Shield color="#8B5CF6" size={20} />
              </View>
              <Text style={[styles.settingText, { color: Colors.textPrimary }]}>Admin Portal</Text>
            </View>
            <ChevronRight color={Colors.mediumGray} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: Colors.cardBackground, borderColor: Colors.red }]}>
            <LogOut color={Colors.red} size={20} />
            <Text style={styles.logoutText}>{t("settings.logout")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    minHeight: 64,
  },
  settingLeft: {
    flexDirection: "row" as const,
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPrimary: {
    backgroundColor: "#FFE5E5",
  },
  iconSuccess: {
    backgroundColor: "#E8F5E9",
  },
  iconWarning: {
    backgroundColor: "#FFF3E0",
  },
  iconDanger: {
    backgroundColor: "#FFEBEE",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
    maxWidth: 200,
  },
  logoutButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FF5252",
  },
  vipPromoBanner: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  vipPromoGradient: {
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  vipPromoContent: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  vipPromoText: {
    flex: 1,
  },
  vipPromoTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  vipPromoSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.95,
  },
  vipActiveBanner: {
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD700",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  vipActiveContent: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  vipActiveText: {
    flex: 1,
  },
  vipActiveTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#2D2D2D",
    marginBottom: 4,
  },
  vipActiveSubtitle: {
    fontSize: 13,
    color: "#6B6B6B",
  },
  themeSelector: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  themeOptionLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
});
