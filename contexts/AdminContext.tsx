import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_EMAIL = "admin@loveconnect.com";
const ADMIN_PASSWORD = "admin123";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export const [AdminProvider, useAdmin] = createContextHook(() => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const session = await AsyncStorage.getItem("admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        setIsAdmin(true);
        setAdminUser(parsed);
      }
    } catch (error) {
      console.log("Error checking admin session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin: AdminUser = {
        id: "admin-1",
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      };

      setIsAdmin(true);
      setAdminUser(admin);

      try {
        await AsyncStorage.setItem("admin_session", JSON.stringify(admin));
      } catch (error) {
        console.log("Error saving admin session:", error);
      }

      return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
  };

  const logout = async () => {
    setIsAdmin(false);
    setAdminUser(null);

    try {
      await AsyncStorage.removeItem("admin_session");
    } catch (error) {
      console.log("Error removing admin session:", error);
    }
  };

  return {
    isAdmin,
    adminUser,
    isLoading,
    login,
    logout,
  };
});
