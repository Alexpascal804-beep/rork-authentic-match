import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { X, ImagePlus, Trash2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useFeed } from "@/contexts/FeedContext";
import { useTheme } from "@/contexts/ThemeContext";
import Colors from "@/constants/colors";

export default function CreatePostScreen() {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();
  const { createPost } = useFeed();
  const { isDark } = useTheme();

  const handlePost = () => {
    if (content.trim() || imageUri) {
      createPost(content.trim(), imageUri);
      router.back();
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to enable photo library access to add images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(undefined);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : Colors.background },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.header,
            { borderBottomColor: isDark ? "#333" : Colors.lightGray },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
            testID="close-button"
          >
            <X color={isDark ? "#fff" : Colors.black} size={28} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? "#fff" : Colors.black },
            ]}
          >
            Create Post
          </Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={!content.trim() && !imageUri}
            style={[
              styles.postButton,
              {
                backgroundColor: (content.trim() || imageUri)
                  ? Colors.coral
                  : isDark
                  ? "#333"
                  : Colors.lightGray,
              },
            ]}
            testID="submit-post-button"
          >
            <Text
              style={[
                styles.postButtonText,
                {
                  color: (content.trim() || imageUri)
                    ? Colors.white
                    : isDark
                    ? "#666"
                    : Colors.mediumGray,
                },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TextInput
            style={[
              styles.input,
              { color: isDark ? "#fff" : Colors.black },
            ]}
            placeholder="Share your thoughts..."
            placeholderTextColor={isDark ? "#666" : Colors.mediumGray}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={500}
            autoFocus
            testID="post-input"
          />

          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={[
                  styles.removeImageButton,
                  { backgroundColor: isDark ? "#333" : Colors.white },
                ]}
                onPress={removeImage}
              >
                <Trash2 color={Colors.red} size={20} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.addImageButton,
              {
                backgroundColor: isDark ? "#1a1a1a" : Colors.coralLight,
                borderColor: isDark ? "#333" : Colors.coral,
              },
            ]}
            onPress={pickImage}
          >
            <ImagePlus
              color={isDark ? Colors.coral : Colors.coral}
              size={24}
            />
            <Text
              style={[
                styles.addImageText,
                { color: isDark ? Colors.coral : Colors.coral },
              ]}
            >
              Add Image
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.charCount,
              { color: isDark ? "#666" : Colors.mediumGray },
            ]}
          >
            {content.length}/500
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    fontSize: 18,
    textAlignVertical: "top" as const,
    minHeight: 120,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    position: "relative" as const,
  },
  imagePreview: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    resizeMode: "cover" as const,
  },
  removeImageButton: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addImageButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed" as const,
    marginBottom: 20,
  },
  addImageText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  charCount: {
    textAlign: "right" as const,
    fontSize: 14,
    marginTop: 12,
  },
});
