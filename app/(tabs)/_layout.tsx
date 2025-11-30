import { Tabs } from "expo-router";
import { Heart, MessageCircle, Settings, Video, Grid } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.luxuryGold,
        tabBarInactiveTintColor: Colors.mediumGray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700" as const,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <Grid color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: "Live",
          tabBarIcon: ({ color }) => <Video color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
