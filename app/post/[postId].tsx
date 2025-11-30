import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Heart, MessageCircle, Gift as GiftIcon } from "lucide-react-native";
import { useFeed } from "@/contexts/FeedContext";
import { useTheme } from "@/contexts/ThemeContext";
import { currentUserId } from "@/mocks/users";
import Colors from "@/constants/colors";
import { GIFTS } from "@/constants/gifts";
import { Comment } from "@/types";

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { getPost, getComments, likePost, addComment, sendGift } = useFeed();
  const { isDark } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [showGiftModal, setShowGiftModal] = useState(false);

  const post = getPost(postId!);
  const comments = getComments(postId!);

  if (!post) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000" : Colors.background },
        ]}
      >
        <Text style={{ color: isDark ? "#fff" : Colors.black }}>
          Post not found
        </Text>
      </SafeAreaView>
    );
  }

  const isLiked = post.likes.includes(currentUserId);

  const handleLike = () => {
    likePost(post.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  const handleSendGift = (giftId: string) => {
    sendGift(post.id, giftId);
    setShowGiftModal(false);
  };

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
          { borderBottomColor: isDark ? "#333" : Colors.lightGray },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft color={isDark ? "#fff" : Colors.black} size={28} />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? "#fff" : Colors.black },
          ]}
        >
          Post
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.postCard,
            { backgroundColor: isDark ? "#1a1a1a" : Colors.white },
          ]}
        >
          <View style={styles.postHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isDark ? "#333" : Colors.lightGray },
              ]}
            >
              <Text style={styles.avatarText}>{post.user.name[0]}</Text>
            </View>
            <View>
              <Text
                style={[
                  styles.userName,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                {post.user.name}
              </Text>
              <Text style={styles.postTime}>
                {getTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.postContent,
              { color: isDark ? "#e0e0e0" : Colors.warmGray },
            ]}
          >
            {post.content}
          </Text>

          {post.imageUrl && (
            <View
              style={[
                styles.postImagePlaceholder,
                { backgroundColor: isDark ? "#2a2a2a" : Colors.lightGray },
              ]}
            >
              <Text style={styles.imageText}>📷 Image</Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              testID="like-button"
            >
              <Heart
                color={isLiked ? Colors.coral : isDark ? "#fff" : Colors.black}
                size={24}
                fill={isLiked ? Colors.coral : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                {post.likes.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle
                color={isDark ? "#fff" : Colors.black}
                size={24}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                {post.commentCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowGiftModal(true)}
              testID="gift-button"
            >
              <GiftIcon color={isDark ? "#fff" : Colors.black} size={24} />
              <Text
                style={[
                  styles.actionText,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                {post.giftCount}
              </Text>
            </TouchableOpacity>
          </View>

          {post.gifts.length > 0 && (
            <View style={styles.giftsSection}>
              <Text
                style={[
                  styles.giftsSectionTitle,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                Gifts
              </Text>
              <View style={styles.giftsGrid}>
                {post.gifts.map((giftItem) => (
                  <View key={giftItem.id} style={styles.giftItem}>
                    <Text style={styles.giftIcon}>{giftItem.gift.icon}</Text>
                    <Text
                      style={[
                        styles.giftSender,
                        { color: isDark ? "#b0b0b0" : Colors.mediumGray },
                      ]}
                    >
                      {giftItem.sender.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text
            style={[
              styles.commentsTitle,
              { color: isDark ? "#fff" : Colors.black },
            ]}
          >
            Comments
          </Text>
          {comments.map((comment: Comment) => (
            <View
              key={comment.id}
              style={[
                styles.commentCard,
                { backgroundColor: isDark ? "#1a1a1a" : Colors.white },
              ]}
            >
              <View
                style={[
                  styles.commentAvatar,
                  { backgroundColor: isDark ? "#333" : Colors.lightGray },
                ]}
              >
                <Text style={styles.commentAvatarText}>
                  {comment.user.name[0]}
                </Text>
              </View>
              <View style={styles.commentContent}>
                <Text
                  style={[
                    styles.commentUserName,
                    { color: isDark ? "#fff" : Colors.black },
                  ]}
                >
                  {comment.user.name}
                </Text>
                <Text
                  style={[
                    styles.commentText,
                    { color: isDark ? "#e0e0e0" : Colors.warmGray },
                  ]}
                >
                  {comment.text}
                </Text>
                <Text style={styles.commentTime}>
                  {getTimeAgo(comment.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.commentInputContainer,
          {
            backgroundColor: isDark ? "#1a1a1a" : Colors.white,
            borderTopColor: isDark ? "#333" : Colors.lightGray,
          },
        ]}
      >
        <TextInput
          style={[
            styles.commentInput,
            {
              backgroundColor: isDark ? "#2a2a2a" : Colors.lightGray,
              color: isDark ? "#fff" : Colors.black,
            },
          ]}
          placeholder="Add a comment..."
          placeholderTextColor={isDark ? "#666" : Colors.mediumGray}
          value={commentText}
          onChangeText={setCommentText}
          testID="comment-input"
        />
        <TouchableOpacity
          onPress={handleComment}
          disabled={!commentText.trim()}
          style={[
            styles.sendButton,
            {
              backgroundColor: commentText.trim()
                ? Colors.coral
                : isDark
                ? "#333"
                : Colors.lightGray,
            },
          ]}
          testID="send-comment-button"
        >
          <Text
            style={[
              styles.sendButtonText,
              {
                color: commentText.trim()
                  ? Colors.white
                  : isDark
                  ? "#666"
                  : Colors.mediumGray,
              },
            ]}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showGiftModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGiftModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.giftModal,
              { backgroundColor: isDark ? "#1a1a1a" : Colors.white },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? "#fff" : Colors.black },
                ]}
              >
                Send a Gift
              </Text>
              <TouchableOpacity
                onPress={() => setShowGiftModal(false)}
                testID="close-gift-modal"
              >
                <Text
                  style={[
                    styles.modalClose,
                    { color: isDark ? "#fff" : Colors.black },
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.giftsModalList}>
              {GIFTS.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={[
                    styles.giftOption,
                    {
                      backgroundColor: isDark ? "#2a2a2a" : Colors.lightGray,
                    },
                  ]}
                  onPress={() => handleSendGift(gift.id)}
                  testID={`gift-option-${gift.id}`}
                >
                  <Text style={styles.giftOptionIcon}>{gift.icon}</Text>
                  <View style={styles.giftOptionInfo}>
                    <Text
                      style={[
                        styles.giftOptionName,
                        { color: isDark ? "#fff" : Colors.black },
                      ]}
                    >
                      {gift.name}
                    </Text>
                    <Text
                      style={[
                        styles.giftOptionPrice,
                        { color: isDark ? "#b0b0b0" : Colors.mediumGray },
                      ]}
                    >
                      ${gift.price.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  postCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  postTime: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  postImagePlaceholder: {
    height: 250,
    borderRadius: 12,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  imageText: {
    fontSize: 50,
  },
  actionsRow: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  giftsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  giftsSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  giftsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  giftItem: {
    alignItems: "center" as const,
  },
  giftIcon: {
    fontSize: 32,
  },
  giftSender: {
    fontSize: 11,
    marginTop: 4,
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  commentCard: {
    flexDirection: "row" as const,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  commentInputContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end" as const,
  },
  giftModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  modalClose: {
    fontSize: 28,
  },
  giftsModalList: {
    padding: 16,
  },
  giftOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  giftOptionIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  giftOptionInfo: {
    flex: 1,
  },
  giftOptionName: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  giftOptionPrice: {
    fontSize: 15,
    marginTop: 2,
  },
});
