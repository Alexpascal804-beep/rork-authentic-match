import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  Flag,
  UserX,
  MessageSquare,
  XCircle,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const GRACEFUL_EXIT_TEMPLATES = [
  "I've really enjoyed our conversation, but I don't think we're the right match. Wishing you the best! 🙂",
  "Thank you for chatting with me! I'm focusing on other connections right now. Take care!",
  "I appreciate you taking the time to talk, but I don't feel the spark. Best of luck finding your person!",
  "Hey, I don't think this is going to work out romantically, but I wish you all the best! ✨",
];

export default function ChatOptionsScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { matches } = useApp();
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <View style={styles.container}>
        <Text>Match not found</Text>
      </View>
    );
  }

  const handleReport = () => {
    Alert.alert(
      "Report User",
      "Are you sure you want to report this user? Our team will review the report.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${match.user.name}? You won't see them again and they won't be able to contact you.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            router.replace("/(tabs)/matches");
          },
        },
      ]
    );
  };

  const handleSendExitMessage = () => {
    if (selectedTemplate) {
      setShowExitModal(false);
      Alert.alert(
        "Message Sent",
        "Your message has been sent. The conversation will be archived.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/matches"),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Chat Options",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.warmGray} size={24} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600" as const,
            color: Colors.warmGray,
          },
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Options</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowExitModal(true)}
          >
            <View style={[styles.optionIcon, styles.iconNeutral]}>
              <MessageSquare color={Colors.mediumGray} size={24} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>End Conversation Gracefully</Text>
              <Text style={styles.optionDescription}>
                Send a kind message before ending the connection
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleReport}
          >
            <View style={[styles.optionIcon, styles.iconWarning]}>
              <Flag color="#FFA500" size={24} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Report User</Text>
              <Text style={styles.optionDescription}>
                Report inappropriate behavior or content
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleBlock}
          >
            <View style={[styles.optionIcon, styles.iconDanger]}>
              <UserX color={Colors.red} size={24} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Block User</Text>
              <Text style={styles.optionDescription}>
                Block and prevent all future contact
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showExitModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowExitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>End Conversation</Text>
              <TouchableOpacity onPress={() => setShowExitModal(false)}>
                <XCircle color={Colors.warmGray} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Choose a template to send to {match.user.name}:
            </Text>

            <ScrollView style={styles.templatesScroll}>
              {GRACEFUL_EXIT_TEMPLATES.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.templateCard,
                    selectedTemplate === template && styles.templateCardSelected,
                  ]}
                  onPress={() => setSelectedTemplate(template)}
                >
                  <Text
                    style={[
                      styles.templateText,
                      selectedTemplate === template && styles.templateTextSelected,
                    ]}
                  >
                    {template}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowExitModal(false);
                  setSelectedTemplate("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !selectedTemplate && styles.sendButtonDisabled,
                ]}
                onPress={handleSendExitMessage}
                disabled={!selectedTemplate}
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    !selectedTemplate && styles.sendButtonTextDisabled,
                  ]}
                >
                  Send & End
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.mediumGray,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconNeutral: {
    backgroundColor: Colors.lightGray,
  },
  iconWarning: {
    backgroundColor: "#FFF3E0",
  },
  iconDanger: {
    backgroundColor: "#FFEBEE",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.mediumGray,
    lineHeight: 18,
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
    paddingBottom: 40,
    paddingHorizontal: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginBottom: 20,
    lineHeight: 20,
  },
  templatesScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  templateCard: {
    backgroundColor: Colors.cream,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.cream,
  },
  templateCardSelected: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralLight,
  },
  templateText: {
    fontSize: 14,
    color: Colors.warmGray,
    lineHeight: 20,
  },
  templateTextSelected: {
    color: Colors.coral,
    fontWeight: "500" as const,
  },
  modalActions: {
    flexDirection: "row" as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
  sendButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.coral,
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  sendButtonTextDisabled: {
    color: Colors.mediumGray,
  },
});
