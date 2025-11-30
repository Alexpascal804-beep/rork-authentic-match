import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Lock, Mail, Shield } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAdmin } from "@/contexts/AdminContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LightColors, DarkColors } from "@/constants/colors";

export default function AdminLoginScreen() {
  const { login, isAdmin } = useAdmin();
  const { isDark } = useTheme();
  const Colors = isDark ? DarkColors : LightColors;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAdmin) {
      router.replace("/admin/dashboard" as any);
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      router.replace("/admin/dashboard" as any);
    } else {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={isDark ? ["#8B5CF6", "#6D28D9"] : ["#8B5CF6", "#A78BFA"]}
            style={styles.logoGradient}
          >
            <Shield color="#FFFFFF" size={48} fill="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={[styles.title, { color: Colors.textPrimary }]}>Admin Portal</Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          Login to access the admin dashboard
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={[styles.inputIcon, { backgroundColor: isDark ? "#3D2A6E" : "#E8DEFF" }]}>
              <Mail color="#8B5CF6" size={20} />
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputIcon, { backgroundColor: isDark ? "#3D2A6E" : "#E8DEFF" }]}>
              <Lock color="#8B5CF6" size={20} />
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.cardBackground, color: Colors.textPrimary }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8B5CF6", "#6D28D9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={[styles.infoCard, { backgroundColor: isDark ? "#3D2A2A" : "#FFF9E6" }]}>
            <Text style={[styles.infoText, { color: Colors.textSecondary }]}>
              For demo purposes:{"\n"}
              Email: admin@loveconnect.com{"\n"}
              Password: admin123
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={[styles.backButtonText, { color: Colors.textSecondary }]}>
              Back to App
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    textAlign: "center" as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center" as const,
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  inputIcon: {
    width: 48,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center" as const,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
});
