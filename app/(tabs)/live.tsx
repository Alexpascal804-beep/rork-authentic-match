import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Video, Users } from "lucide-react-native";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import Colors from "@/constants/colors";
import { LiveStream } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function LiveScreen() {
  const { liveStreams, refreshStreams } = useLiveStream();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStreams();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshStreams]);

  const handleStreamPress = (streamId: string) => {
    router.push(`/live/${streamId}`);
  };

  const handleGoLive = () => {
    router.push("/live/broadcaster");
  };

  const activeLiveStreams = liveStreams.filter((s) => s.isLive);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Streams</Text>
        <TouchableOpacity style={styles.goLiveButton} onPress={handleGoLive}>
          <Video color={Colors.white} size={20} />
          <Text style={styles.goLiveText}>Go Live</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.coral}
          />
        }
      >
        {activeLiveStreams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Video color={Colors.mediumGray} size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Live Streams</Text>
            <Text style={styles.emptyText}>
              Be the first to go live and connect with others!
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleGoLive}>
              <Text style={styles.emptyButtonText}>Start Streaming</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.streamGrid}>
            {activeLiveStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onPress={() => handleStreamPress(stream.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface StreamCardProps {
  stream: LiveStream;
  onPress: () => void;
}

function StreamCard({ stream, onPress }: StreamCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: stream.thumbnailUrl || stream.broadcaster.photos[0] }}
          style={styles.cardImage}
        />
        <View style={styles.cardOverlay}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.viewerCount}>
            <Users color={Colors.white} size={14} />
            <Text style={styles.viewerCountText}>{stream.viewerCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: stream.broadcaster.photos[0] }}
            style={styles.broadcasterAvatar}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.broadcasterName} numberOfLines={1}>
              {stream.broadcaster.name}
            </Text>
            <Text style={styles.streamTitle} numberOfLines={2}>
              {stream.title}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
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
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  goLiveButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.coral,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goLiveText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  streamGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: "relative" as const,
    width: "100%",
    aspectRatio: 3 / 4,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover" as const,
  },
  cardOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row" as const,
    justifyContent: "space-between",
    padding: 8,
  },
  liveIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 82, 82, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  viewerCount: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerCountText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row" as const,
    alignItems: "flex-start",
    gap: 8,
  },
  broadcasterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cardInfo: {
    flex: 1,
  },
  broadcasterName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 2,
  },
  streamTitle: {
    fontSize: 12,
    color: Colors.mediumGray,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.coral,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
});
