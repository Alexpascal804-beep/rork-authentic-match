import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft, Camera, Plus, X } from "lucide-react-native";
import Colors from "@/constants/colors";

const INTEREST_OPTIONS = [
  "Travel", "Cooking", "Fitness", "Reading", "Photography",
  "Music", "Art", "Hiking", "Yoga", "Coffee",
  "Wine", "Movies", "Gaming", "Dancing", "Volunteering",
  "Sports", "Fashion", "Foodie", "Nature", "Pets"
];

const PROMPTS = [
  "My simple pleasures",
  "Best travel story",
  "I'm looking for",
  "My most controversial opinion",
  "A perfect Sunday",
  "Green flags I look for",
  "Typical Friday night",
  "I'm weirdly attracted to",
];

export default function ProfileSetupScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<
    { question: string; answer: string }[]
  >([]);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddPrompt = () => {
    if (selectedPrompts.length < 3) {
      const availablePrompts = PROMPTS.filter(
        (p) => !selectedPrompts.find((sp) => sp.question === p)
      );
      if (availablePrompts.length > 0) {
        setSelectedPrompts([
          ...selectedPrompts,
          { question: availablePrompts[0], answer: "" },
        ]);
      }
    }
  };

  const handleRemovePrompt = (index: number) => {
    setSelectedPrompts(selectedPrompts.filter((_, i) => i !== index));
  };

  const handlePromptAnswerChange = (index: number, answer: string) => {
    const updated = [...selectedPrompts];
    updated[index] = { ...updated[index], answer };
    setSelectedPrompts(updated);
  };

  const canComplete =
    name.trim() &&
    age.trim() &&
    bio.trim() &&
    location.trim() &&
    selectedInterests.length >= 3 &&
    selectedPrompts.length >= 2 &&
    selectedPrompts.every((p) => p.answer.trim());

  const handleComplete = () => {
    if (canComplete) {
      router.replace("/(tabs)" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Create Your Profile",
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionDescription}>
            Add at least 2 photos to get started
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosScroll}
          >
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Camera color={Colors.mediumGray} size={32} />
              <Text style={styles.photoPlaceholderText}>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Plus color={Colors.mediumGray} size={32} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.mediumGray}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={Colors.mediumGray}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, State"
              placeholderTextColor={Colors.mediumGray}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="What do you do?"
              placeholderTextColor={Colors.mediumGray}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You *</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Write a short bio about yourself..."
            placeholderTextColor={Colors.mediumGray}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests *</Text>
          <Text style={styles.sectionDescription}>
            Select at least 3 (max 5)
          </Text>
          <View style={styles.interestsGrid}>
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    isSelected && styles.interestChipSelected,
                  ]}
                  onPress={() => handleInterestToggle(interest)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.interestChipText,
                      isSelected && styles.interestChipTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Prompts *</Text>
              <Text style={styles.sectionDescription}>
                Answer at least 2 prompts
              </Text>
            </View>
            {selectedPrompts.length < 3 && (
              <TouchableOpacity
                style={styles.addPromptButton}
                onPress={handleAddPrompt}
              >
                <Plus color={Colors.coral} size={20} />
                <Text style={styles.addPromptText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {selectedPrompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptQuestion}>{prompt.question}</Text>
                <TouchableOpacity onPress={() => handleRemovePrompt(index)}>
                  <X color={Colors.mediumGray} size={20} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, styles.promptInput]}
                value={prompt.answer}
                onChangeText={(text) => handlePromptAnswerChange(index, text)}
                placeholder="Your answer..."
                placeholderTextColor={Colors.mediumGray}
                multiline
                maxLength={150}
              />
            </View>
          ))}

          {selectedPrompts.length === 0 && (
            <TouchableOpacity
              style={styles.addFirstPrompt}
              onPress={handleAddPrompt}
            >
              <Plus color={Colors.coral} size={24} />
              <Text style={styles.addFirstPromptText}>Add your first prompt</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.completeButton, !canComplete && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={!canComplete}
        >
          <Text
            style={[
              styles.completeButtonText,
              !canComplete && styles.completeButtonTextDisabled,
            ]}
          >
            Complete Profile
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginBottom: 16,
  },
  photosScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  photoPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: "dashed" as const,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.warmGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.warmGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  bioInput: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: "top" as const,
  },
  charCount: {
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: "right" as const,
    marginTop: 4,
  },
  interestsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  interestChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  interestChipSelected: {
    backgroundColor: Colors.coralLight,
    borderColor: Colors.coral,
  },
  interestChipText: {
    fontSize: 14,
    color: Colors.mediumGray,
    fontWeight: "500" as const,
  },
  interestChipTextSelected: {
    color: Colors.coral,
    fontWeight: "600" as const,
  },
  addPromptButton: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.coralLight,
    borderRadius: 16,
  },
  addPromptText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.coral,
  },
  promptCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.coral,
    flex: 1,
  },
  promptInput: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: "top" as const,
  },
  addFirstPrompt: {
    backgroundColor: Colors.white,
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: "dashed" as const,
    alignItems: "center",
    gap: 8,
  },
  addFirstPromptText: {
    fontSize: 16,
    color: Colors.coral,
    fontWeight: "600" as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  completeButton: {
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDisabled: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  completeButtonTextDisabled: {
    color: Colors.mediumGray,
  },
});
