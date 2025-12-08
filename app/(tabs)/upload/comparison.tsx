import BackButton from "@/components/ui/back-button";
import { GlobalStyles } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Use the same IP that Metro is running on (check Expo QR code for your current IP)
const BACKEND_URL = "http://172.20.10.2:5001";

interface ContractMetadata {
  filename: string;
  privacyRating: number;
  uploadDate: string;
}

export default function ComparisonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Ensure contract params are strings, not arrays
  const contract1 = Array.isArray(params.contract1) ? params.contract1[0] : params.contract1;
  const contract2 = Array.isArray(params.contract2) ? params.contract2[0] : params.contract2;
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
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <BackButton onPress={() => router.back()} label="Back" />
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
  scrollGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
  },
});
