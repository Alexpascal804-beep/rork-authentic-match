import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Check, ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/lib/i18n";
import Colors from "@/constants/colors";

export default function LanguageSelectionScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleSelectLanguage = async (languageCode: string) => {
    await changeLanguage(languageCode);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color={Colors.warmGray} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings.selectLanguage")}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              currentLanguage === language.code && styles.languageItemActive,
            ]}
            onPress={() => handleSelectLanguage(language.code)}
            activeOpacity={0.7}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageNative}>{language.nativeName}</Text>
              <Text style={styles.languageName}>{language.name}</Text>
            </View>
            {currentLanguage === language.code && (
              <Check color={Colors.coral} size={24} strokeWidth={3} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageItemActive: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralLight,
  },
  languageInfo: {
    flex: 1,
  },
  languageNative: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 2,
  },
  languageName: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
});
