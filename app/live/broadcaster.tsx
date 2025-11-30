import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { X, Users, Video, MessageCircle } from "lucide-react-native";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import { mockUsers } from "@/mocks/users";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function BroadcasterScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front");
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [messages, setMessages] = useState<
    { id: string; userName: string; text: string }[]
  >([]);

  const { startStream, endStream } = useLiveStream();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount((prev) => prev + Math.floor(Math.random() * 3));

        if (Math.random() > 0.6) {
          const mockMessages = [
            { userName: "Sarah", text: "Great stream! 👍" },
            { userName: "John", text: "Hello from New York!" },
            { userName: "Emma", text: "You're amazing! ❤️" },
            { userName: "Mike", text: "Keep it up!" },
          ];

          const randomMsg =
            mockMessages[Math.floor(Math.random() * mockMessages.length)];
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              userName: randomMsg.userName,
              text: randomMsg.text,
            },
          ]);

          setTimeout(
            () => scrollViewRef.current?.scrollToEnd({ animated: true }),
            100
          );
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Video color={Colors.coral} size={64} strokeWidth={1.5} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            To go live, we need access to your camera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleStartStream = () => {
    if (!streamTitle.trim()) {
      return;
    }

    const broadcaster = mockUsers[0];
    startStream(streamTitle, broadcaster);
    setIsLive(true);
    setShowTitleInput(false);
    setViewerCount(0);
    setMessages([]);
  };

  const handleEndStream = () => {
    endStream();
    setIsLive(false);
    router.back();
  };

  const toggleCamera = () => {
    setFacing((current: CameraType) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      {Platform.OS !== "web" ? (
        <CameraView style={styles.camera} facing={facing}>
          {renderOverlay()}
        </CameraView>
      ) : (
        <View style={[styles.camera, styles.webCameraPlaceholder]}>
          <Text style={styles.webCameraText}>
            Camera preview not available on web
          </Text>
          {renderOverlay()}
        </View>
      )}
    </View>
  );

  function renderOverlay() {
    if (showTitleInput && !isLive) {
      return (
        <View style={styles.overlay}>
          <View style={styles.setupContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X color={Colors.white} size={24} />
            </TouchableOpacity>

            <View style={styles.setupContent}>
              <Text style={styles.setupTitle}>Set Your Stream Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="What are you streaming about?"
                placeholderTextColor={Colors.mediumGray}
                value={streamTitle}
                onChangeText={setStreamTitle}
                maxLength={100}
                autoFocus
              />

              <TouchableOpacity
                style={[
                  styles.startButton,
                  !streamTitle.trim() && styles.startButtonDisabled,
                ]}
                onPress={handleStartStream}
                disabled={!streamTitle.trim()}
              >
                <Video color={Colors.white} size={24} />
                <Text style={styles.startButtonText}>Go Live</Text>
              </TouchableOpacity>

              {Platform.OS !== "web" && (
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCamera}
                >
                  <Text style={styles.flipButtonText}>Flip Camera</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    if (isLive) {
      return (
        <View style={styles.overlay}>
          <View style={styles.liveHeader}>
            <View style={styles.liveInfo}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.viewerCount}>
                <Users color={Colors.white} size={16} />
                <Text style={styles.viewerCountText}>{viewerCount}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.endButton} onPress={handleEndStream}>
              <X color={Colors.white} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.streamTitleContainer}>
            <Text style={styles.streamTitle}>{streamTitle}</Text>
          </View>

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

          <View style={styles.liveControls}>
            {Platform.OS !== "web" && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCamera}
              >
                <Video color={Colors.white} size={24} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.controlButton}>
              <MessageCircle color={Colors.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  camera: {
    flex: 1,
  },
  webCameraPlaceholder: {
    backgroundColor: Colors.warmGray,
    justifyContent: "center",
    alignItems: "center",
  },
  webCameraText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center" as const,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  setupContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  setupContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 24,
    textAlign: "center" as const,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  titleInput: {
    width: width - 80,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.warmGray,
    marginBottom: 24,
  },
  startButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.red,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 16,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  flipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  liveHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveInfo: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  liveIndicator: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  liveText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  viewerCount: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewerCountText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  endButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 82, 82, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  streamTitleContainer: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
  liveControls: {
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.white,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center" as const,
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.coral,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.white,
  },
});
