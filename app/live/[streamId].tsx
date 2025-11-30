import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  X,
  Send,
  Gift as GiftIcon,
  Users,
} from "lucide-react-native";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import { useWallet } from "@/contexts/WalletContext";
import { GIFTS, formatGiftPrice } from "@/constants/gifts";
import { currentUserId } from "@/mocks/users";
import Colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function LiveStreamScreen() {
  const { streamId } = useLocalSearchParams<{ streamId: string }>();
  const { liveStreams, joinStream, leaveStream, sendGift } = useLiveStream();
  const { addGiftIncome } = useWallet();

  const stream = liveStreams.find((s) => s.id === streamId);

  const [message, setMessage] = useState("");
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; userId: string; userName: string; text: string }[]
  >([]);
  const [giftAnimations, setGiftAnimations] = useState<
    { id: string; icon: string; name: string }[]
  >([]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (stream) {
      joinStream(stream);
    }

    return () => {
      leaveStream();
    };
  }, [streamId, stream, joinStream, leaveStream]);

  useEffect(() => {
    const mockMessages = [
      { userName: "Alex", text: "Hey everyone! 👋" },
      { userName: "Sarah", text: "Love your stream!" },
      { userName: "Mike", text: "Great content ❤️" },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomMsg =
          mockMessages[Math.floor(Math.random() * mockMessages.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            userId: "random",
            userName: randomMsg.userName,
            text: randomMsg.text,
          },
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stream) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Stream not found</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          userId: currentUserId,
          userName: "You",
          text: message.trim(),
        },
      ]);
      setMessage("");
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSendGift = (giftId: string) => {
    const gift = GIFTS.find((g) => g.id === giftId);
    if (!gift) return;

    sendGift(giftId, currentUserId, stream.broadcaster.id, stream.id);

    if (stream.broadcaster.id !== currentUserId) {
      addGiftIncome(giftId, currentUserId);
    }

    setGiftAnimations((prev) => [
      ...prev,
      { id: Date.now().toString(), icon: gift.icon, name: gift.name },
    ]);

    setTimeout(() => {
      setGiftAnimations((prev) => prev.slice(1));
    }, 3000);

    setShowGiftSelector(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: stream.broadcaster.photos[0] }}
        style={styles.backgroundImage}
        blurRadius={Platform.OS === "web" ? 0 : 20}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color={Colors.white} size={24} />
          </TouchableOpacity>

          <View style={styles.broadcasterInfo}>
            <Image
              source={{ uri: stream.broadcaster.photos[0] }}
              style={styles.broadcasterAvatar}
            />
            <View style={styles.broadcasterDetails}>
              <Text style={styles.broadcasterName}>{stream.broadcaster.name}</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <View style={styles.viewerCount}>
              <Users color={Colors.white} size={16} />
              <Text style={styles.viewerCountText}>{stream.viewerCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.streamTitleContainer}>
          <Text style={styles.streamTitle}>{stream.title}</Text>
        </View>

        {giftAnimations.map((gift) => (
          <GiftAnimation key={gift.id} icon={gift.icon} name={gift.name} />
        ))}

        <View style={styles.messagesContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                <Text style={styles.messageUser}>{msg.userName}: </Text>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomControls}>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Say something nice..."
              placeholderTextColor={Colors.mediumGray}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send color={Colors.coral} size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.giftButton}
            onPress={() => setShowGiftSelector(true)}
          >
            <GiftIcon color={Colors.white} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {showGiftSelector && (
        <View style={styles.giftSelectorOverlay}>
          <TouchableOpacity
            style={styles.giftSelectorBackdrop}
            onPress={() => setShowGiftSelector(false)}
          />
          <View style={styles.giftSelectorContainer}>
            <View style={styles.giftSelectorHeader}>
              <Text style={styles.giftSelectorTitle}>Send a Gift</Text>
              <TouchableOpacity onPress={() => setShowGiftSelector(false)}>
                <X color={Colors.warmGray} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.giftList}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.giftGrid}>
                {GIFTS.map((gift) => (
                  <TouchableOpacity
                    key={gift.id}
                    style={styles.giftItem}
                    onPress={() => handleSendGift(gift.id)}
                  >
                    <Text style={styles.giftIcon}>{gift.icon}</Text>
                    <Text style={styles.giftName}>{gift.name}</Text>
                    <Text style={styles.giftPrice}>
                      {formatGiftPrice(gift.price)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

function GiftAnimation({ icon, name }: { icon: string; name: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.giftAnimation,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.giftAnimationIcon}>{icon}</Text>
      <Text style={styles.giftAnimationText}>{name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backgroundImage: {
    position: "absolute" as const,
    width: width,
    height: height,
    resizeMode: "cover" as const,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  broadcasterInfo: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: 8,
    paddingRight: 12,
  },
  broadcasterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  broadcasterDetails: {
    flex: 1,
  },
  broadcasterName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 2,
  },
  liveIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  viewerCount: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerCountText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  streamTitleContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  messagesContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messagesList: {
    maxHeight: 200,
  },
  messageItem: {
    flexDirection: "row" as const,
    marginBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 12,
    flexWrap: "wrap" as const,
  },
  messageUser: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  messageText: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
  },
  bottomControls: {
    flexDirection: "row" as const,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
    alignItems: "center",
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  messageInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: Colors.warmGray,
  },
  sendButton: {
    padding: 8,
  },
  giftButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.coral,
    justifyContent: "center",
    alignItems: "center",
  },
  giftAnimation: {
    position: "absolute" as const,
    right: 30,
    top: height / 2,
    alignItems: "center",
  },
  giftAnimationIcon: {
    fontSize: 60,
    marginBottom: 4,
  },
  giftAnimationText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  giftSelectorOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  giftSelectorBackdrop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  giftSelectorContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
  },
  giftSelectorHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  giftSelectorTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  giftList: {
    flex: 1,
  },
  giftGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    padding: 16,
  },
  giftItem: {
    width: (width - 64) / 3,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    backgroundColor: Colors.cream,
    borderRadius: 16,
  },
  giftIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  giftName: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  giftPrice: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  errorText: {
    fontSize: 18,
    color: Colors.white,
    textAlign: "center" as const,
    marginTop: 100,
  },
});
