import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Plus, Heart, MessageCircle, Gift, Sparkles } from "lucide-react-native";
import { useFeed } from "@/contexts/FeedContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useVIP } from "@/contexts/VIPContext";
import Colors from "@/constants/colors";
import { Post } from "@/types";
import VIPBadge from "@/components/VIPBadge";

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  const { posts, likePost } = useFeed();
  const { isDark } = useTheme();
  const { isVIP } = useVIP();

  const renderPost = React.useCallback(({ item }: { item: Post }) => {
    const isLiked = item.likes.includes("1");

    return (
      <View
        style={[
          styles.postCard,
          { backgroundColor: isDark ? "#1a1a1a" : Colors.white },
        ]}
        testID={`post-${item.id}`}
      >
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push(`/profile/${item.userId}` as any)}
          >
            {item.user.photos?.[0] ? (
              <Image
                source={{ uri: item.user.photos[0] }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: isDark ? "#333" : Colors.coralLight },
                ]}
              >
                <Text style={[styles.avatarText, { color: Colors.coral }]}>
                  {item.user.name[0]}
                </Text>
              </View>
            )}
            <View>
              <View style={styles.nameRow}>
                <Text
                  style={[
                    styles.userName,
                    { color: isDark ? "#fff" : Colors.luxury },
                  ]}
                >
                  {item.user.name}
                </Text>
                {isVIP && <VIPBadge size="small" />}
              </View>
              <Text style={[styles.postTime, { color: Colors.mediumGray }]}>
                {getTimeAgo(item.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {item.content && (
          <Text
            style={[
              styles.postContent,
              { color: isDark ? "#e0e0e0" : Colors.textPrimary },
            ]}
          >
            {item.content}
          </Text>
        )}

        {item.imageUrl && (
          <TouchableOpacity
            onPress={() => router.push(`/post/${item.id}` as any)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => likePost(item.id)}
          >
            <Heart
              color={isLiked ? Colors.coral : isDark ? "#666" : Colors.mediumGray}
              size={22}
              fill={isLiked ? Colors.coral : "none"}
            />
            <Text
              style={[
                styles.actionText,
                {
                  color: isLiked ? Colors.coral : isDark ? "#666" : Colors.mediumGray,
                },
              ]}
            >
              {item.likes.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/post/${item.id}` as any)}
          >
            <MessageCircle
              color={isDark ? "#666" : Colors.mediumGray}
              size={22}
            />
            <Text
              style={[
                styles.actionText,
                { color: isDark ? "#666" : Colors.mediumGray },
              ]}
            >
              {item.commentCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/post/${item.id}` as any)}
          >
            <Gift color={isDark ? "#666" : Colors.mediumGray} size={22} />
            <Text
              style={[
                styles.actionText,
                { color: isDark ? "#666" : Colors.mediumGray },
              ]}
            >
              {item.giftCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [isDark, isVIP, likePost]);

  const keyExtractor = React.useCallback((item: Post) => item.id, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : Colors.background },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#1a1a1a" : Colors.white,
            borderBottomColor: isDark ? "#2a2a2a" : Colors.border,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? Colors.luxuryGold : Colors.luxury },
            ]}
          >
            ViVa
          </Text>
          <View style={styles.headerSubtitleRow}>
            <Sparkles
              color={isDark ? Colors.luxuryGold : Colors.accent}
              size={14}
              fill={isDark ? Colors.luxuryGold : Colors.accent}
            />
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? Colors.accent : Colors.accent },
              ]}
            >
              Community
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create-post" as any)}
          testID="create-post-button"
        >
          <Plus color={Colors.white} size={24} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  headerSubtitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.luxuryGold,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: Colors.luxuryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 20,
  },
  postCard: {
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: Colors.background,
  },
  postHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  nameRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.luxuryGold,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  postTime: {
    fontSize: 13,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    letterSpacing: -0.1,
  },
  postImage: {
    width: width - 40,
    height: (width - 40) * 0.75,
    borderRadius: 16,
    resizeMode: "cover" as const,
    marginBottom: 16,
    alignSelf: "center" as const,
  },
  postActions: {
    flexDirection: "row" as const,
    gap: 24,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
});
