import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Send, Sparkles, X, Calendar, MoreVertical } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Message } from "@/types";

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { matches, sendMessage, getChat, currentUserId } = useApp();
  const [inputText, setInputText] = useState("");
  const [showStarters, setShowStarters] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const match = matches.find((m) => m.id === matchId);
  const chat = getChat(matchId || "");

  const conversationStarters = match
    ? [
        `I noticed you love ${match.user.interests[0]}! What got you into it?`,
        `Your profile mentioned ${match.user.prompts[0]?.question.toLowerCase()}. Tell me more!`,
        `${match.compatibility}% match! What do you think we have in common?`,
        `I see you're in ${match.user.location}. Any favorite local spots?`,
      ]
    : [];

  useEffect(() => {
    if (chat && chat.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [chat]);

  if (!match || !chat) {
    return (
      <View style={styles.container}>
        <Text>Chat not found</Text>
      </View>
    );
  }

  const handleSend = () => {
    if (inputText.trim()) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      sendMessage(matchId || "", inputText.trim());
      setInputText("");
      setIsTyping(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      if (Math.random() > 0.6) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }, 1000);
      }
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser
              ? styles.currentUserText
              : styles.otherUserText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isCurrentUser
              ? styles.currentUserTime
              : styles.otherUserTime,
          ]}
        >
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerLeft}
            >
              <ArrowLeft color={Colors.warmGray} size={24} />
              <Image
                source={{ uri: match.user.photos[0] }}
                style={styles.headerAvatar}
              />
              <View>
                <Text style={styles.headerName}>{match.user.name}</Text>
                <Text style={styles.headerMatch}>
                  {match.compatibility}% match
                </Text>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push(`/date-planner/${matchId}` as any)}
              >
                <Calendar color={Colors.coral} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push(`/chat-options/${matchId}` as any)}
              >
                <MoreVertical color={Colors.warmGray} size={20} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: Colors.white,
          },
        }}
      />

      <FlatList
        ref={flatListRef}
        data={chat.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => {
          if (isTyping) {
            return <TypingIndicator />;
          }
          return null;
        }}
      />

      <View style={styles.inputContainer}>
        {chat.messages.length === 0 && (
          <TouchableOpacity
            style={styles.startersButton}
            onPress={() => setShowStarters(true)}
          >
            <Sparkles color={Colors.coral} size={16} />
            <Text style={styles.startersButtonText}>Conversation Starters</Text>
          </TouchableOpacity>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleInputChange}
            placeholder={`Message ${match.user.name}...`}
            placeholderTextColor={Colors.mediumGray}
            multiline
            maxLength={500}
            onFocus={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send
              color={inputText.trim() ? Colors.white : Colors.mediumGray}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showStarters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowStarters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Sparkles color={Colors.coral} size={24} />
                <Text style={styles.modalTitle}>Conversation Starters</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStarters(false)}>
                <X color={Colors.warmGray} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.startersScroll}>
              {conversationStarters.map((starter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.starterCard}
                  onPress={() => {
                    setInputText(starter);
                    setShowStarters(false);
                  }}
                >
                  <Text style={styles.starterText}>{starter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.warmGray,
  },
  headerMatch: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  headerRight: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  currentUserBubble: {
    alignSelf: "flex-end" as const,
    backgroundColor: Colors.coral,
  },
  otherUserBubble: {
    alignSelf: "flex-start" as const,
    backgroundColor: Colors.white,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  currentUserText: {
    color: Colors.white,
  },
  otherUserText: {
    color: Colors.warmGray,
  },
  messageTime: {
    fontSize: 11,
  },
  currentUserTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTime: {
    color: Colors.mediumGray,
  },
  inputContainer: {
    flexDirection: "column" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  startersButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.coralLight,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: "flex-start" as const,
  },
  startersButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.coral,
  },
  inputRow: {
    flexDirection: "row" as const,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.warmGray,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.coral,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === "ios" ? 48 : 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  startersScroll: {
    paddingHorizontal: 24,
  },
  starterCard: {
    backgroundColor: Colors.cream,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  starterText: {
    fontSize: 15,
    color: Colors.warmGray,
    lineHeight: 22,
  },
  typingContainer: {
    marginBottom: 12,
    alignSelf: "flex-start" as const,
  },
  typingBubble: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mediumGray,
  },
});
