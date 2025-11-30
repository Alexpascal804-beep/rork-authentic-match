import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { VIPProvider } from "@/contexts/VIPContext";
import { LiveStreamProvider } from "@/contexts/LiveStreamContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { FeedProvider } from "@/contexts/FeedContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { trpc, trpcClient } from "@/lib/trpc";
import "@/lib/i18n";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="onboarding/welcome" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="onboarding/personality-quiz" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/face-verification" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[matchId]" options={{ headerShown: false }} />
      <Stack.Screen name="chat-options/[matchId]" options={{ headerShown: false }} />
      <Stack.Screen name="date-planner/[matchId]" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[userId]" options={{ headerShown: false }} />
      <Stack.Screen name="settings/preferences" options={{ headerShown: false }} />
      <Stack.Screen name="settings/verification" options={{ headerShown: false }} />
      <Stack.Screen name="settings/safety-center" options={{ headerShown: false }} />
      <Stack.Screen name="settings/blocked-users" options={{ headerShown: false }} />
      <Stack.Screen name="settings/edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="settings/language" options={{ headerShown: false }} />
      <Stack.Screen name="vip/benefits" options={{ headerShown: false }} />
      <Stack.Screen name="vip/payment" options={{ headerShown: false }} />
      <Stack.Screen name="live/[streamId]" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="live/broadcaster" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="wallet/cashout" options={{ headerShown: false }} />
      <Stack.Screen name="admin/login" options={{ headerShown: false }} />
      <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="post/[postId]" options={{ headerShown: false }} />
      <Stack.Screen name="create-post" options={{ headerShown: false, presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <AdminProvider>
                <WalletProvider>
                  <VIPProvider>
                    <LiveStreamProvider>
                      <FeedProvider>
                        <AppProvider>
                          <GestureHandlerRootView style={{ flex: 1 }}>
                            <RootLayoutNav />
                          </GestureHandlerRootView>
                        </AppProvider>
                      </FeedProvider>
                    </LiveStreamProvider>
                  </VIPProvider>
                </WalletProvider>
              </AdminProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
