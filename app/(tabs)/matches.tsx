import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Match } from "@/types";

export default function MatchesScreen() {
  const { matches } = useApp();

  const sortedMatches = React.useMemo(
    () =>
      [...matches].sort(
        (a, b) =>
          new Date(b.lastMessage?.timestamp || b.matchedAt).getTime() -
          new Date(a.lastMessage?.timestamp || a.matchedAt).getTime()
      ),
    [matches]
  );

  const renderMatch = React.useCallback(({ item }: { item: Match }) => {
    const timeAgo = getTimeAgo(
      item.lastMessage?.timestamp || item.matchedAt
    );

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => router.push(`/chat/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.user.photos[0] }} style={styles.avatar} />
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{item.user.name}</Text>
            <Text style={styles.matchTime}>{timeAgo}</Text>
          </View>
          {item.lastMessage ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage.text}
            </Text>
          ) : (
            <View style={styles.newMatchBadge}>
              <Text style={styles.newMatchText}>New Match! Say hi 👋</Text>
            </View>
          )}
        </View>
        <View style={styles.compatibilityCircle}>
          <Text style={styles.compatibilityNumber}>{item.compatibility}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = React.useCallback((item: Match) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>
          {matches.length} {matches.length === 1 ? "connection" : "connections"}
        </Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle color={Colors.lightGray} size={64} />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            Start swiping to find your connections
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedMatches}
          renderItem={renderMatch}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          windowSize={10}
        />
      )}
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  matchCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  matchHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  matchName: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warmGray,
  },
  matchTime: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.mediumGray,
    lineHeight: 18,
  },
  newMatchBadge: {
    alignSelf: "flex-start" as const,
  },
  newMatchText: {
    fontSize: 14,
    color: Colors.coral,
    fontWeight: "500" as const,
  },
  compatibilityCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.coralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  compatibilityNumber: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
  },
});
