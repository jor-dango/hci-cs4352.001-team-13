import { GlobalStyles } from "@/constants/theme";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalysisScreen() {
  const router = useRouter();
  const { filename } = useLocalSearchParams();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [inputText, setInputText] = useState("");

  const handleQuestion = () => {
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText("");

      // Simulate AI response (replace with your actual API call)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "This is a response to your question.",
            isUser: false,
          },
        ]);
      }, 1000);
    }
  };

  // Chat View
  if (showChat) {
    return (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <SafeAreaView style={styles.chatHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.h3}>Ask Questions</Text>
        </SafeAreaView>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text
                style={[
                  GlobalStyles.body,
                  { color: "#9CA3AF", textAlign: "center" },
                ]}
              >
                Ask any questions about your contract analysis
              </Text>
            </View>
          ) : (
            messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    GlobalStyles.small,
                    { color: message.isUser ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question about your contract..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Analysis View (original content)
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[GlobalStyles.body, { color: "#383Ab2" }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={GlobalStyles.h3}>Contract Analysis & Summary</Text>
        {filename && (
          <Text style={[GlobalStyles.body, { color: "#6B7280", marginTop: -16 }]}>
            {filename}
          </Text>
        )}
        <View style={styles.tag}>
          <Text style={GlobalStyles.small}>10/10 Privacy Rating</Text>
        </View>
        <View style={[styles.contentContainer, { gap: 8 }]}>
          <Text style={GlobalStyles.body}>
            Here are the key privacy concerns in your {filename ? `${filename.replace(/\.(pdf|docx|jpg|png)$/i, '')} contract` : 'contract'}:
          </Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>
              1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor{"\n\n"}
              2. incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud{"\n\n"}
              3. exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure{"\n\n"}
              4. dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur
            </Text>
          </View>
        </View>
        <View style={[styles.contentContainer, { gap: 8 }]}>
          <Text style={GlobalStyles.body}>Other sections and concerns:</Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>I. TERMS</Text>
          </View>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>II. PAY</Text>
          </View>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>III. SCHEDULE</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row", gap: 24, maxHeight: 36 }}>
          <TouchableOpacity style={styles.button}>
            <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
              Save to Archive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleQuestion} style={styles.button}>
            <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
              Ask a question
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#EDEDF0",
    flex: 1,
    paddingTop: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 24,
  },
  tag: {
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 10000,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    display: "flex",
    alignSelf: "flex-start",
  },
  lightContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#383AB2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  // Chat styles
  chatContainer: {
    backgroundColor: "#EDEDF0",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  chatHeader: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messagesContent: {
    gap: 12,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#383AB2",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 124,
    borderTopColor: "#BEBEBE",
    backgroundColor: "#EDEDF0",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#383AB2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
});
