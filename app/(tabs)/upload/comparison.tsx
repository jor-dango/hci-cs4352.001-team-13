import { GlobalStyles } from "@/constants/theme";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Use localhost for simulator, or your local IP for physical device
const BACKEND_URL = "http://localhost:5001";

interface ContractMetadata {
  filename: string;
  privacyRating: number;
  uploadDate: string;
}

export default function ComparisonScreen() {
  const router = useRouter();
  const { contract1, contract2 } = useLocalSearchParams();
  const [contract1Data, setContract1Data] = useState<ContractMetadata | null>(
    null,
  );
  const [contract2Data, setContract2Data] = useState<ContractMetadata | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract1 && contract2) {
      fetchBothContracts();
    }
  }, [contract1, contract2]);

  const fetchBothContracts = async () => {
    try {
      setLoading(true);

      const [response1, response2] = await Promise.all([
        fetch(`${BACKEND_URL}/upload/${contract1}`),
        fetch(`${BACKEND_URL}/upload/${contract2}`),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error("Failed to fetch contract metadata");
      }

      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json(),
      ]);

      setContract1Data(data1);
      setContract2Data(data2);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseContractName = (filename: string): string => {
    const nameWithoutExt = filename.replace(/\.(pdf|docx|jpg|png)$/i, "");
    const readable = nameWithoutExt
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return readable;
  };

  const getBetterContract = (): "contract1" | "contract2" | "tie" => {
    if (!contract1Data || !contract2Data) return "tie";
    if (contract1Data.privacyRating > contract2Data.privacyRating)
      return "contract1";
    if (contract2Data.privacyRating > contract1Data.privacyRating)
      return "contract2";
    return "tie";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#383AB2" />
          <Text
            style={[GlobalStyles.body, { color: "#6B7280", marginTop: 16 }]}
          >
            Loading comparison...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const betterContract = getBetterContract();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[GlobalStyles.body, { color: "#383Ab2" }]}>← Back</Text>
        </TouchableOpacity>

        <Text style={GlobalStyles.h3}>Contract Comparison</Text>

        {/* Side-by-side ratings */}
        <View style={styles.comparisonRow}>
          <View
            style={[
              styles.contractColumn,
              betterContract === "contract1" && styles.betterContract,
            ]}
          >
            <Text
              style={[
                GlobalStyles.body,
                { textAlign: "center", marginBottom: 8 },
              ]}
            >
              {contract1 && parseContractName(String(contract1))}
            </Text>
            <View
              style={[
                styles.ratingBadge,
                betterContract === "contract1" && styles.betterRatingBadge,
              ]}
            >
              <Text style={[GlobalStyles.h3, { fontSize: 28 }]}>
                {contract1Data?.privacyRating}/10
              </Text>
              <Text style={[GlobalStyles.small, { color: "#6B7280" }]}>
                Privacy Rating
              </Text>
            </View>
          </View>

          <View style={styles.vsContainer}>
            <Text style={[GlobalStyles.body, { color: "#6B7280" }]}>vs</Text>
          </View>

          <View
            style={[
              styles.contractColumn,
              betterContract === "contract2" && styles.betterContract,
            ]}
          >
            <Text
              style={[
                GlobalStyles.body,
                { textAlign: "center", marginBottom: 8 },
              ]}
            >
              {contract2 && parseContractName(String(contract2))}
            </Text>
            <View
              style={[
                styles.ratingBadge,
                betterContract === "contract2" && styles.betterRatingBadge,
              ]}
            >
              <Text style={[GlobalStyles.h3, { fontSize: 28 }]}>
                {contract2Data?.privacyRating}/10
              </Text>
              <Text style={[GlobalStyles.small, { color: "#6B7280" }]}>
                Privacy Rating
              </Text>
            </View>
          </View>
        </View>

        {/* Winner announcement */}
        {betterContract !== "tie" && (
          <View style={styles.winnerBanner}>
            <Text style={GlobalStyles.body}>
              ✓{" "}
              {betterContract === "contract1"
                ? parseContractName(String(contract1))
                : parseContractName(String(contract2))}{" "}
              has better privacy protection
            </Text>
          </View>
        )}

        {/* Key Differences Summary */}
        <View style={styles.section}>
          <Text style={GlobalStyles.body}>Key Differences Summary:</Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>
              <Text style={{ fontWeight: "600" }}>Data Collection:</Text> {"\n"}
              {contract1 && parseContractName(String(contract1))} collects
              limited personal data, while{" "}
              {contract2 && parseContractName(String(contract2))} requires
              extensive information.{"\n\n"}
              <Text style={{ fontWeight: "600" }}>
                Third-Party Sharing:
              </Text>{" "}
              {"\n"}
              {contract1 && parseContractName(String(contract1))} restricts
              third-party data sharing, whereas{" "}
              {contract2 && parseContractName(String(contract2))} allows broader
              sharing with partners.{"\n\n"}
              <Text style={{ fontWeight: "600" }}>Data Retention:</Text> {"\n"}
              {contract1 && parseContractName(String(contract1))} deletes data
              after 1 year. {contract2 && parseContractName(String(contract2))}{" "}
              retains data indefinitely.{"\n\n"}
              <Text style={{ fontWeight: "600" }}>User Control:</Text> {"\n"}
              {contract1 && parseContractName(String(contract1))} provides
              opt-out mechanisms.{" "}
              {contract2 && parseContractName(String(contract2))} has limited
              user control options.
            </Text>
          </View>
        </View>

        {/* Privacy Strengths */}
        <View style={styles.section}>
          <Text style={GlobalStyles.body}>
            Privacy Strengths of{" "}
            {contract1 && parseContractName(String(contract1))}:
          </Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>
              • Clear opt-out procedures{"\n"}• Minimal data collection{"\n"}•
              Regular security audits{"\n"}• GDPR compliance
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={GlobalStyles.body}>
            Privacy Strengths of{" "}
            {contract2 && parseContractName(String(contract2))}:
          </Text>
          <View style={styles.lightContainer}>
            <Text style={GlobalStyles.small}>
              • Encrypted data storage{"\n"}• Transparent privacy policy{"\n"}•
              Regular data breach notifications{"\n"}• Dedicated privacy team
            </Text>
          </View>
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
    flexDirection: "column",
    gap: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  comparisonRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  contractColumn: {
    flex: 1,
    alignItems: "center",
  },
  betterContract: {
    opacity: 1,
  },
  vsContainer: {
    paddingHorizontal: 8,
  },
  ratingBadge: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  betterRatingBadge: {
    borderColor: "#383AB2",
    borderWidth: 2,
    backgroundColor: "#F0F0FF",
  },
  winnerBanner: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  section: {
    gap: 8,
  },
  lightContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8,
  },
});
