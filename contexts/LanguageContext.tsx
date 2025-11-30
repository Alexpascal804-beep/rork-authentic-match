import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "app_language";

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Failed to load language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
    isLoading,
  };
});
