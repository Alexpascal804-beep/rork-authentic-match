import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, Stack } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import Colors from "@/constants/colors";

type Question = {
  id: string;
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: "weekend",
    text: "Your perfect weekend looks like:",
    options: [
      "Adventure outdoors",
      "Cozy at home",
      "Social gathering with friends",
      "Exploring the city",
    ],
  },
  {
    id: "communication",
    text: "In relationships, I value:",
    options: [
      "Deep conversations",
      "Quality time together",
      "Acts of service",
      "Physical affection",
    ],
  },
  {
    id: "lifestyle",
    text: "My ideal lifestyle is:",
    options: [
      "Active and health-focused",
      "Career-driven and ambitious",
      "Creative and spontaneous",
      "Balanced and mindful",
    ],
  },
  {
    id: "values",
    text: "What matters most to me:",
    options: [
      "Personal growth",
      "Family and relationships",
      "Making a difference",
      "Financial security",
    ],
  },
  {
    id: "conflict",
    text: "When handling disagreements, I prefer to:",
    options: [
      "Talk it out immediately",
      "Take time to think",
      "Find a compromise",
      "Avoid confrontation",
    ],
  },
];

export default function PersonalityQuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      router.push("/onboarding/face-verification" as any);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.back();
    }
  };

  const canProceed = answers[question.id] !== undefined;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft color={Colors.warmGray} size={24} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.cream,
          },
        }}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.question}>{question.text}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = answers[question.id] === option;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleAnswer(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text
            style={[
              styles.nextButtonText,
              !canProceed && styles.nextButtonTextDisabled,
            ]}
          >
            {isLastQuestion ? "Complete" : "Next"}
          </Text>
          <ArrowRight
            color={canProceed ? Colors.white : Colors.mediumGray}
            size={20}
          />
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
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    overflow: "hidden" as const,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.coral,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: "center" as const,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.warmGray,
    marginBottom: 32,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  optionSelected: {
    borderColor: Colors.coral,
    backgroundColor: Colors.coralLight,
  },
  optionText: {
    fontSize: 16,
    color: Colors.warmGray,
    fontWeight: "500" as const,
  },
  optionTextSelected: {
    color: Colors.coral,
    fontWeight: "600" as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: Colors.cream,
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
  },
  nextButtonTextDisabled: {
    color: Colors.mediumGray,
  },
});
