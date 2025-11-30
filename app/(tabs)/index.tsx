import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Heart, X, MapPin, Sparkles } from "lucide-react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { User } from "@/types";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function DiscoverScreen() {
  const { availableUsers, likeUser, passUser, dailyLikesRemaining, dailyLimitEnabled } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const matchScaleAnim = useRef(new Animated.Value(0)).current;

  const currentUser = availableUsers[currentIndex];

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          forceSwipe("right");
        } else if (gesture.dx < -120) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: "left" | "right") => {
    const x = direction === "right" ? width + 100 : -width - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: "left" | "right") => {
    if (currentUser) {
      if (direction === "right") {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        const success = likeUser(currentUser.id);
        if (!success) {
          position.setValue({ x: 0, y: 0 });
          resetPosition();
          return;
        }
        if (Math.random() > 0.5) {
          setMatchedUser(currentUser);
          setShowMatchModal(true);
          matchScaleAnim.setValue(0);
          Animated.spring(matchScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      } else {
        passUser(currentUser.id);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    forceSwipe("right");
  };

  const handlePass = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    forceSwipe("left");
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptyText}>
            Check back later for new matches!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerSubtitleRow}>
            <Sparkles color={Colors.luxuryGold} size={14} fill={Colors.luxuryGold} />
            <Text style={styles.headerSubtitle}>Find Your Match</Text>
          </View>
        </View>
        {dailyLimitEnabled && (
          <View style={styles.likesCounter}>
            <Heart
              color={dailyLikesRemaining > 0 ? Colors.coral : Colors.mediumGray}
              size={16}
              fill={dailyLikesRemaining > 0 ? Colors.coral : "none"}
            />
            <Text
              style={[
                styles.likesCounterText,
                dailyLikesRemaining === 0 && styles.likesCounterTextEmpty,
              ]}
            >
              {dailyLikesRemaining}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardContainer}>
        {availableUsers
          .slice(currentIndex, currentIndex + 2)
          .reverse()
          .map((user, index, array) => {
            const isCurrentCard = index === array.length - 1;

            if (isCurrentCard) {
              return (
                <Animated.View
                  key={user.id}
                  style={[
                    styles.card,
                    {
                      transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                        { rotate },
                      ],
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <Animated.View
                    style={[styles.likeOverlay, { opacity: likeOpacity }]}
                  >
                    <Text style={styles.overlayText}>LIKE</Text>
                  </Animated.View>
                  <Animated.View
                    style={[styles.nopeOverlay, { opacity: nopeOpacity }]}
                  >
                    <Text style={styles.overlayText}>PASS</Text>
                  </Animated.View>
                  <UserCard user={user} />
                </Animated.View>
              );
            }

            return (
              <View key={user.id} style={[styles.card, styles.nextCard]}>
                <UserCard user={user} />
              </View>
            );
          })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}
          activeOpacity={0.7}
        >
          <X color={Colors.red} size={32} strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart color={Colors.coral} size={32} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {matchedUser && (
        <Modal
          visible={showMatchModal}
          transparent
          animationType="fade"
          onRequestClose={closeMatchModal}
        >
          <View style={styles.matchModalContainer}>
            <View style={styles.matchModalBackdrop} />
            <Animated.View
              style={[
                styles.matchModalContent,
                {
                  transform: [{ scale: matchScaleAnim }],
                  opacity: matchScaleAnim,
                },
              ]}
            >
              <Sparkles color={Colors.coral} size={48} fill={Colors.coral} />
              <Text style={styles.matchModalTitle}>It&apos;s a Match!</Text>
              <Text style={styles.matchModalSubtitle}>
                You and {matchedUser.name} liked each other
              </Text>
              <View style={styles.matchModalImages}>
                <Image
                  source={{ uri: matchedUser.photos[0] }}
                  style={styles.matchModalImage}
                />
              </View>
              <TouchableOpacity
                style={styles.matchModalButton}
                onPress={() => {
                  closeMatchModal();
                  router.push(`/chat/match-${Date.now()}` as any);
                }}
              >
                <Text style={styles.matchModalButtonText}>Send Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.matchModalCloseButton}
                onPress={closeMatchModal}
              >
                <Text style={styles.matchModalCloseText}>Keep Swiping</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return (
    <TouchableOpacity
      style={styles.cardContent}
      activeOpacity={0.95}
      onPress={() => router.push(`/profile/${user.id}`)}
    >
      <Image
        source={{ uri: user.photos[0] }}
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.age}>, {user.age}</Text>
          </View>
          <View style={styles.compatibilityBadge}>
            <Sparkles color={Colors.coral} size={12} />
            <Text style={styles.compatibilityText}>
              {Math.floor(Math.random() * 15) + 80}%
            </Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <MapPin color={Colors.mediumGray} size={14} />
          <Text style={styles.location}>
            {user.location}
            {user.distanceInMiles && ` • ${user.distanceInMiles} mi away`}
          </Text>
        </View>
        <Text style={styles.bio} numberOfLines={2}>
          {user.bio}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.interests}
        >
          {user.interests.slice(0, 4).map((interest, idx) => (
            <View key={idx} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.luxury,
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
    color: Colors.accent,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  likesCounter: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.coralLight,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.coral,
  },
  likesCounterText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.coral,
  },
  likesCounterTextEmpty: {
    color: Colors.mediumGray,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute" as const,
    width: CARD_WIDTH,
    height: height * 0.65,
    borderRadius: 24,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextCard: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  cardContent: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden" as const,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover" as const,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.luxury,
    letterSpacing: -0.5,
  },
  age: {
    fontSize: 24,
    fontWeight: "400" as const,
    color: Colors.mediumGray,
  },
  compatibilityBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: Colors.luxuryGold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  compatibilityText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  locationRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.warmGray,
    marginTop: 8,
  },
  interests: {
    marginTop: 12,
    flexGrow: 0,
  },
  interestTag: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  interestText: {
    fontSize: 13,
    color: Colors.mediumGray,
    fontWeight: "500" as const,
  },
  likeOverlay: {
    position: "absolute" as const,
    top: 50,
    right: 30,
    zIndex: 10,
    borderWidth: 4,
    borderColor: Colors.green,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: "20deg" }],
  },
  nopeOverlay: {
    position: "absolute" as const,
    top: 50,
    left: 30,
    zIndex: 10,
    borderWidth: 4,
    borderColor: Colors.red,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: "-20deg" }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.green,
  },
  actions: {
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.white,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
  },
  passButton: {
    borderColor: Colors.red,
  },
  likeButton: {
    borderColor: Colors.luxuryGold,
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
  },
  matchModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  matchModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  matchModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: width - 48,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  matchModalTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginTop: 16,
    marginBottom: 8,
  },
  matchModalSubtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    marginBottom: 24,
  },
  matchModalImages: {
    marginBottom: 24,
  },
  matchModalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.coral,
  },
  matchModalButton: {
    backgroundColor: Colors.coral,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  matchModalButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  matchModalCloseButton: {
    paddingVertical: 12,
  },
  matchModalCloseText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
});
