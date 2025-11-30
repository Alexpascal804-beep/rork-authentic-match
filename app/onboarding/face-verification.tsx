import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, Stack } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { ArrowLeft, Camera, CheckCircle2, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { generateText } from "@rork-ai/toolkit-sdk";

type VerificationStatus = "idle" | "capturing" | "verifying" | "success" | "failed";

export default function FaceVerificationScreen() {
  const [facing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setStatus("capturing");
      console.log("[FaceVerification] Starting capture...");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (!photo || !photo.base64) {
        throw new Error("Failed to capture photo");
      }

      console.log("[FaceVerification] Photo captured, starting verification...");
      setStatus("verifying");

      const base64Image = `data:image/jpeg;base64,${photo.base64}`;

      const verificationPrompt = `Analyze this selfie and determine if it shows a real person's face (not a photo of a photo, screen, or fake image). 
      
      Respond with ONLY one of these:
      - "VERIFIED" if this is clearly a real person taking a live selfie
      - "FAKE_PHOTO" if this appears to be a photo of a photo or screen
      - "NO_FACE" if no clear face is visible
      - "MULTIPLE_FACES" if multiple people are in the photo
      
      Just respond with one of those exact words, nothing else.`;

      const result = await generateText({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: verificationPrompt },
              { type: "image", image: base64Image },
            ],
          },
        ],
      });

      const response = result.trim().toUpperCase();
      console.log("[FaceVerification] AI Response:", response);

      if (response.includes("VERIFIED")) {
        console.log("[FaceVerification] Verification successful!");
        setStatus("success");
        setTimeout(() => {
          router.push("/onboarding/profile-setup");
        }, 1500);
      } else {
        let errorMsg = "Verification failed. Please try again.";
        
        if (response.includes("FAKE_PHOTO")) {
          errorMsg = "Please use a live selfie, not a photo of a photo.";
        } else if (response.includes("NO_FACE")) {
          errorMsg = "No face detected. Please ensure your face is clearly visible.";
        } else if (response.includes("MULTIPLE_FACES")) {
          errorMsg = "Multiple faces detected. Please take a solo selfie.";
        }

        console.log("[FaceVerification] Verification failed:", errorMsg);
        setErrorMessage(errorMsg);
        setStatus("failed");
        
        setTimeout(() => {
          setStatus("idle");
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("[FaceVerification] Error:", error);
      setErrorMessage("An error occurred. Please try again.");
      setStatus("failed");
      
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 3000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.coral} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Verify Your Identity",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <ArrowLeft color={Colors.warmGray} size={24} />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: Colors.cream,
            },
          }}
        />
        <View style={styles.permissionContainer}>
          <Camera color={Colors.coral} size={64} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to verify you&apos;re a real person. This helps keep our community safe and authentic.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Verify Your Identity",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.white} size={24} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerTintColor: Colors.white,
        }}
      />

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Face Verification</Text>
            <Text style={styles.instructionsText}>
              Position your face in the frame and take a clear selfie
            </Text>
          </View>

          <View style={styles.frameContainer}>
            <View style={styles.frame} />
          </View>

          <View style={styles.bottomContainer}>
            {status === "idle" && (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              >
                <Camera color={Colors.white} size={32} />
              </TouchableOpacity>
            )}

            {(status === "capturing" || status === "verifying") && (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
                <Text style={styles.statusText}>
                  {status === "capturing" ? "Capturing..." : "Verifying..."}
                </Text>
              </View>
            )}

            {status === "success" && (
              <View style={styles.statusContainer}>
                <CheckCircle2 color={Colors.white} size={48} />
                <Text style={styles.statusText}>Verified!</Text>
              </View>
            )}

            {status === "failed" && (
              <View style={styles.statusContainer}>
                <AlertCircle color={Colors.white} size={48} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Text style={styles.safetyNote}>
              Your photo is only used for verification and won&apos;t be stored
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmGray,
  },
  backButton: {
    padding: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: Colors.cream,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: "center" as const,
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  instructionsContainer: {
    paddingTop: 100,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  instructionsText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center" as const,
    opacity: 0.9,
    lineHeight: 22,
  },
  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  frame: {
    width: 280,
    height: 360,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: Colors.white,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    paddingBottom: 60,
    alignItems: "center",
    gap: 16,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.coral,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  statusContainer: {
    alignItems: "center",
    gap: 12,
    minHeight: 72,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
    textAlign: "center" as const,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.white,
    textAlign: "center" as const,
    paddingHorizontal: 32,
  },
  safetyNote: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7,
    textAlign: "center" as const,
    paddingHorizontal: 32,
  },
});
