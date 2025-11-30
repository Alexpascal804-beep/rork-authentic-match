import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";
type ActiveTheme = "light" | "dark";

const THEME_KEY = "@benin_meet_theme";

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setTheme(stored as Theme);
      }
    } catch (error) {
      console.log("Failed to load theme", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.log("Failed to save theme", error);
    }
  };

  const activeTheme: ActiveTheme = theme === "system" 
    ? (systemColorScheme === "dark" ? "dark" : "light")
    : theme;

  return {
    theme,
    activeTheme,
    isLoading,
    setTheme: updateTheme,
    isDark: activeTheme === "dark",
  };
});
