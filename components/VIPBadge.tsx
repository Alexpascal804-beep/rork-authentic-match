import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Crown } from "lucide-react-native";

interface VIPBadgeProps {
  size?: "small" | "medium" | "large";
  style?: any;
}

export default function VIPBadge({ size = "medium", style }: VIPBadgeProps) {
  const fontSize = size === "small" ? 10 : size === "large" ? 14 : 12;
  const padding = size === "small" ? 4 : size === "large" ? 8 : 6;
  const iconSize = size === "small" ? 10 : size === "large" ? 16 : 12;

  return (
    <View style={[styles.badge, { padding }, style]}>
      <Crown color="#FFF" size={iconSize} fill="#FFF" />
      <Text style={[styles.text, { fontSize }]}>VIP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 12,
    gap: 4,
  },
  text: {
    color: "#FFF",
    fontWeight: "700" as const,
  },
});
