import ActionButtonPair from "@/components/ui/action-button-pair";
import ComparisonModal from "@/components/ui/comparison-modal";
import { GlobalStyles } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

// Use the same IP that Metro is running on (check Expo QR code for your current IP)
const BACKEND_URL = "http://192.168.1.40:5001";

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Ensure filename is a string, not an array
  const filename = Array.isArray(params.filename) ? params.filename[0] : params.filename;
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [inputText, setInputText] = useState("");
  const [privacyRating, setPrivacyRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isArchived, setIsArchived] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [archivedContracts, setArchivedContracts] = useState<any[]>([]);
  const [openSections, setOpenSections] = useState({terms: false, pay: false, schedule: false});
  const scrollViewRef = useRef<ScrollView>(null);

  // Check if we came from history (already archived)
  const isFromHistory = source === "history";

  useEffect(() => {
    if (filename) {
      fetchFileMetadata();
    }
  }, [filename]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const fetchFileMetadata = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/upload/${filename}`);

      if (!response.ok) {
        throw new Error("Failed to fetch file metadata");
      }

      const data = await response.json();
      setPrivacyRating(data.privacyRating);
      setIsArchived(data.archived || false);
    } catch (err) {
      console.error("Error fetching metadata:", err);
      // Default to a random rating if fetch fails
      setPrivacyRating(Math.floor(Math.random() * 10) + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestion = () => {
    setShowChat(true);
  };

  const handleCompareOther = async () => {
    // Fetch archived contracts for comparison
    try {
      const response = await fetch(`${BACKEND_URL}/uploads?archived=true`);
      if (response.ok) {
        const data = await response.json();
        setArchivedContracts(
          data.files.map((file: any) => ({
            filename: file.filename,
            contractName: parseContractName(file.filename),
            privacyRating: `${file.privacyRating}/10 Privacy Rating`,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
    }
    setShowComparisonModal(true);
  };

  const handleSelectComparison = (compareWithFilename: string) => {
    router.push({
      pathname: "/(tabs)/upload/comparison",
      params: {
        contract1: filename,
        contract2: compareWithFilename,
      },
    });
  };

  // Helper function to parse contract name from filename
  function parseContractName(filename: string): string {
    const nameWithoutExt = filename.replace(/\.(pdf|docx|jpg|png)$/i, "");
    const readable = nameWithoutExt
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return readable;
  }

  const handleSaveToArchive = async () => {
    if (!filename || isArchived) return;

    try {
      setIsSaving(true);

      const response = await fetch(
        `${BACKEND_URL}/upload/${filename}/archive`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to archive file");
      }

      const data = await response.json();

      setIsArchived(true);

      // Show success feedback
      Alert.alert(
        "Successfully Saved! ✓",
        `${filename} has been saved to your archive.`,
        [{ text: "OK" }],
      );
    } catch (err) {
      console.error("Error archiving file:", err);
      Alert.alert("Error", "Failed to save to archive. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSaving(false);
    }
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
        keyboardVerticalOffset={0}
      >
        <SafeAreaView style={styles.chatHeader}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.h3}>Ask Questions</Text>
        </SafeAreaView>

        <ScrollView
          ref={scrollViewRef}
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
                    GlobalStyles.body,
                    {
                      color: message.isUser ? "#FFFFFF" : "#000000",
                      flexShrink: 1,
                    },
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
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isFromHistory) {
              // Clear the upload stack and go to history
              router.dismissAll();
              router.replace("/(tabs)/history");
            } else {
              router.back();
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>
            ← {isFromHistory ? "Back to History" : "Back to Upload"}
          </Text>
        </TouchableOpacity>
        <Text style={GlobalStyles.h3}>Contract Analysis & Summary</Text>
        {filename && (
          <Text
            style={[GlobalStyles.body, { color: "#6B7280", marginTop: -16 }]}
          >
            {filename}
          </Text>
        )}
        {loading ? (
          <View style={styles.tag}>
            <ActivityIndicator size="small" color="#383AB2" />
          </View>
        ) : (
          <View style={styles.tag}>
            <Text style={GlobalStyles.small}>
              {privacyRating}/10 Privacy Rating
            </Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={GlobalStyles.body}>
            Here are the key privacy concerns in your{" "}
            {filename
              ? `${filename.replace(/\.(pdf|docx|jpg|png)$/i, "")} contract`
              : "contract"}
            :
          </Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>
              1. Your employer may keep your resume on file for an indefinite time during or after employment.{"\n\n"}
              2. Your employer may require employee monitoring software to be installed on your personal smartphone.{"\n\n"}
              3. Third-party services may be contracted by your employer to keep employee monitoring statistics.{"\n\n"}
              4. Your employer may require you to register and login to third-party services with your personal email and phone number.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={GlobalStyles.body}>Other sections and concerns:</Text>
          <TouchableOpacity
            style={styles.lightContainer}
            onPress={() => 
              setOpenSections((prev) => ({...prev, terms: !prev.terms}))
            }
            activeOpacity={0.7}
          >
            <Text style={GlobalStyles.small}>{openSections.terms ? "▼ " : "▶ "} I. TERMS</Text>
          </TouchableOpacity>
          {openSections.terms && (
            <View style={styles.lightContainer}>
              <Text style={GlobalStyles.small}>
                - Breaks: You are entitled to 30 minute breaks on workdays greater than 6 hours, but no breaks are entitled on workdays less than 6 hours.{"\n\n"}
                - Vacations: Vacations are not offereed by your employer.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.lightContainer}
            onPress={() => 
              setOpenSections((prev) => ({...prev, pay: !prev.pay}))
            }
            activeOpacity={0.7}
          >
            <Text style={GlobalStyles.small}>{openSections.pay ? "▼ " : "▶ "} II. PAY</Text>
          </TouchableOpacity>
          {openSections.pay && (
            <View style={styles.lightContainer}>
              <Text style={GlobalStyles.small}>
                - Wages: Wages shall be paid every week. You may request raises to your employer after 6 months of employment.{"\n\n"}
                - Direct Deposit: Your employer will require your banking information for direct depositing your wages.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.lightContainer}
            onPress={() => 
              setOpenSections((prev) => ({...prev, schedule: !prev.schedule}))
            }
            activeOpacity={0.7}
          >
            <Text style={GlobalStyles.small}>{openSections.schedule ? "▼ " : "▶ "} III. SCHEDULE</Text>
          </TouchableOpacity>
          {openSections.schedule && (
            <View style={styles.lightContainer}>
              <Text style={GlobalStyles.small}>
                - Scheduling: Your employer shall assemble your Sun-Sat weekly schedule week-by-week as required for business operation. Further details regarding schedule must be agreed upon with your manager.{"\n\n"}
                - Missed work: You are required to announce unavailabilities to your manager as soon as possible.
              </Text>
            </View>
          )}
        </View>
        {isFromHistory ? (
          <ActionButtonPair
            leftButtonText="Compare other"
            rightButtonText="Ask a question"
            onLeftPress={handleCompareOther}
            onRightPress={handleQuestion}
          />
        ) : (
          <ActionButtonPair
            leftButtonText={
              isArchived
                ? "Saved ✓"
                : isSaving
                  ? "Saving..."
                  : "Save to Archive"
            }
            rightButtonText="Ask a question"
            onLeftPress={handleSaveToArchive}
            onRightPress={handleQuestion}
          />
        )}
        <ComparisonModal
          visible={showComparisonModal}
          currentContract={String(filename)}
          contracts={archivedContracts}
          onClose={() => setShowComparisonModal(false)}
          onSelectContract={handleSelectComparison}
        />
      </ScrollView>
      <LinearGradient
        colors={["rgba(237, 237, 240, 0)", "rgba(237, 237, 240, 0.8)", "#EDEDF0"]}
        locations={[0, 0.5, 1]}
        style={styles.scrollGradient}
        pointerEvents="none"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#EDEDF0",
  },
  container: {
    backgroundColor: "#EDEDF0",
    flex: 1,
    paddingTop: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  contentContainer: {
    flexDirection: "column",
    gap: 24,
    paddingBottom: 80,
  },
  section: {
    gap: 8,
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
    flexShrink: 1,
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
    paddingBottom: 16,
    borderTopWidth: 1,
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
  scrollGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
  },
});
