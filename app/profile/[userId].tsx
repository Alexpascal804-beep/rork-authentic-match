import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Heart } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { users, likeUser, matches } = useApp();

  const user = users.find((u) => u.id === userId);
  const isMatched = matches.some((m) => m.user.id === userId);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const handleLike = () => {
    if (!isMatched) {
      likeUser(user.id);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.white} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photosContainer}>
          {user.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.photo}
            />
          ))}
        </View>

        <View style={styles.content}>
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.age}>{user.age}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MapPin color={Colors.mediumGray} size={18} />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
            {user.occupation && (
              <View style={styles.infoRow}>
                <Briefcase color={Colors.mediumGray} size={18} />
                <Text style={styles.infoText}>{user.occupation}</Text>
              </View>
            )}
            {user.education && (
              <View style={styles.infoRow}>
                <GraduationCap color={Colors.mediumGray} size={18} />
                <Text style={styles.infoText}>{user.education}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {user.prompts.map((prompt, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {!isMatched && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Heart color={Colors.white} size={24} fill={Colors.white} />
            <Text style={styles.likeButtonText}>Like {user.name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  photosContainer: {
    backgroundColor: Colors.white,
  },
  photo: {
    width: width,
    height: width * 1.2,
    resizeMode: "cover" as const,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nameSection: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.warmGray,
  },
  age: {
    fontSize: 28,
    fontWeight: "400" as const,
    color: Colors.mediumGray,
  },
  infoSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: Colors.mediumGray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.warmGray,
  },
  interestsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  interestTag: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 15,
    color: Colors.mediumGray,
    fontWeight: "500" as const,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.coral,
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.warmGray,
  },
  actionBar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  likeButton: {
    flexDirection: "row" as const,
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  likeButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
  },
});
