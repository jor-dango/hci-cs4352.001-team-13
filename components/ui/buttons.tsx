import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from "react";

import { GlobalStyles } from "@/constants/theme";
export default function Button() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>;
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
  return (
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
