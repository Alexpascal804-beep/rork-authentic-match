import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  Coffee,
  Film,
  Music,
  Utensils,
  Sparkles,
  MapPin,
  X,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

type DateIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
};

const DATE_IDEAS: DateIdea[] = [
  {
    id: "1",
    title: "Coffee & Conversation",
    description: "Start simple with coffee at a cozy local cafe. Perfect for getting to know each other.",
    category: "Casual",
    icon: <Coffee color={Colors.coral} size={24} />,
  },
  {
    id: "2",
    title: "Dinner Date",
    description: "Enjoy a nice meal together at a restaurant you both love. Share your favorite dishes!",
    category: "Dining",
    icon: <Utensils color={Colors.coral} size={24} />,
  },
  {
    id: "3",
    title: "Movie Night",
    description: "Catch a new release or watch a classic at the cinema. Don't forget the popcorn!",
    category: "Entertainment",
    icon: <Film color={Colors.coral} size={24} />,
  },
  {
    id: "4",
    title: "Live Music",
    description: "Experience local talent at a live music venue. Great vibes and conversation.",
    category: "Entertainment",
    icon: <Music color={Colors.coral} size={24} />,
  },
  {
    id: "5",
    title: "Farmers Market Stroll",
    description: "Explore a local farmers market together. Pick up fresh ingredients and maybe cook together!",
    category: "Outdoor",
    icon: <MapPin color={Colors.coral} size={24} />,
  },
];

export default function DatePlannerScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { matches } = useApp();
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(null);
  const [showModal, setShowModal] = useState(false);

  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <View style={styles.container}>
        <Text>Match not found</Text>
      </View>
    );
  }

  const handleSelectIdea = (idea: DateIdea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };

  const handleSendSuggestion = () => {
    setShowModal(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Date Planner",
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Sparkles color={Colors.coral} size={28} />
          <Text style={styles.headerTitle}>Date Ideas for {match.user.name}</Text>
          <Text style={styles.headerSubtitle}>
            Based on your shared interests and {match.compatibility}% compatibility
          </Text>
        </View>

        <View style={styles.ideasList}>
          {DATE_IDEAS.map((idea) => (
            <TouchableOpacity
              key={idea.id}
              style={styles.ideaCard}
              onPress={() => handleSelectIdea(idea)}
              activeOpacity={0.7}
            >
              <View style={styles.ideaIcon}>{idea.icon}</View>
              <View style={styles.ideaContent}>
                <View style={styles.ideaHeader}>
                  <Text style={styles.ideaTitle}>{idea.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{idea.category}</Text>
                  </View>
                </View>
                <Text style={styles.ideaDescription}>{idea.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Date Idea?</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X color={Colors.warmGray} size={24} />
              </TouchableOpacity>
            </View>

            {selectedIdea && (
              <View style={styles.selectedIdeaCard}>
                <View style={styles.selectedIdeaIcon}>{selectedIdea.icon}</View>
                <Text style={styles.selectedIdeaTitle}>{selectedIdea.title}</Text>
                <Text style={styles.selectedIdeaDescription}>
                  {selectedIdea.description}
                </Text>
              </View>
            )}

            <Text style={styles.modalDescription}>
              This will send a message to {match.user.name} suggesting this date idea.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendSuggestion}
              >
                <Text style={styles.sendButtonText}>Send Suggestion</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  ideasList: {
    gap: 16,
  },
  ideaCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ideaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.coralLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ideaContent: {
    flex: 1,
  },
  ideaHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ideaTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.mediumGray,
  },
  ideaDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  selectedIdeaCard: {
    alignItems: "center",
    backgroundColor: Colors.cream,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedIdeaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.coralLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedIdeaTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  selectedIdeaDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 24,
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
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.white,
  },
});
