import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "@/constants/theme";
import HistoryCard from "@/components/ui/history-card";
import ComparisonModal from "@/components/ui/comparison-modal";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Use localhost for simulator, or your local IP for physical device
const BACKEND_URL = "http://localhost:5001";

interface UploadedFile {
  filename: string;
  uploadDate: string;
  uploadTimestamp: number;
  size: number;
  privacyRating: number;
  archived: boolean;
}

interface Contract {
  id: string;
  contractName: string;
  date: string;
  privacyRating: string;
  filename: string;
}

// Convert filename to readable contract name
function parseContractName(filename: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(pdf|docx|jpg|png)$/i, "");

  // Replace hyphens, underscores with spaces and capitalize
  const readable = nameWithoutExt
    .replace(/[-_]/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return readable;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-refresh when tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchContracts();
    }, [])
  );

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/uploads`);

      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }

      const data = await response.json();

      // Transform backend data into contract format
      const transformedContracts: Contract[] = data.files.map((file: UploadedFile) => ({
        id: file.filename, // Use filename as ID
        contractName: parseContractName(file.filename),
        date: file.uploadDate,
        privacyRating: `${file.privacyRating}/10 Privacy Rating`,
        filename: file.filename,
      }));

      setContracts(transformedContracts);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err instanceof Error ? err.message : "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const [selectedContractForComparison, setSelectedContractForComparison] = useState<string | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const handleView = (filename: string) => {
    // Navigate to analysis screen with source=history param
    router.push({
      pathname: "/(tabs)/upload/analysis",
      params: { filename, source: "history" },
    });
  };

  const handleCompare = (filename: string) => {
    setSelectedContractForComparison(filename);
    setShowComparisonModal(true);
  };

  const handleSelectComparison = (compareWithFilename: string) => {
    // Navigate to comparison screen with both contracts
    router.push({
      pathname: "/(tabs)/upload/comparison",
      params: {
        contract1: selectedContractForComparison,
        contract2: compareWithFilename,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#383AB2" />
          <Text style={[GlobalStyles.body, { color: "#6B7280", marginTop: 16 }]}>
            Loading contracts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={[GlobalStyles.body, { color: "#EF4444" }]}>
            Error: {error}
          </Text>
          <Text style={[GlobalStyles.small, { color: "#6B7280", marginTop: 8 }]}>
            Make sure the backend server is running
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={GlobalStyles.h3}>Contract History</Text>
        {contracts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[GlobalStyles.body, { color: "#6B7280" }]}>
              No contracts uploaded yet
            </Text>
          </View>
        ) : (
          <View style={styles.contractList}>
            {contracts.map((contract) => (
              <HistoryCard
                key={contract.id}
                contractName={contract.contractName}
                date={contract.date}
                privacyRating={contract.privacyRating}
                onView={() => handleView(contract.filename)}
                onCompare={() => handleCompare(contract.filename)}
              />
            ))}
          </View>
        )}

        <ComparisonModal
          visible={showComparisonModal}
          currentContract={selectedContractForComparison || ""}
          contracts={contracts}
          onClose={() => setShowComparisonModal(false)}
          onSelectContract={handleSelectComparison}
        />
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
    flexDirection: "column",
    gap: 24,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  contractList: {
    gap: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
