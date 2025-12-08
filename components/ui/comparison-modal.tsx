import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalStyles } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface Contract {
  filename: string;
  contractName: string;
  privacyRating: string;
}

interface ComparisonModalProps {
  visible: boolean;
  currentContract: string;
  contracts: Contract[];
  onClose: () => void;
  onSelectContract: (filename: string) => void;
}

export default function ComparisonModal({
  visible,
  currentContract,
  contracts,
  onClose,
  onSelectContract,
}: ComparisonModalProps) {
  // Filter out the current contract from the list
  const otherContracts = contracts.filter(
    (c) => c.filename !== currentContract
  );

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleSelectContract = async (filename: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectContract(filename);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[GlobalStyles.h3, { flex: 1, flexShrink: 1 }]}>
            Select Contract to Compare
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {otherContracts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[GlobalStyles.body, { color: "#6B7280" }]}>
              No other contracts available for comparison
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {otherContracts.map((contract) => (
              <TouchableOpacity
                key={contract.filename}
                style={styles.contractItem}
                onPress={() => handleSelectContract(contract.filename)}
              >
                <View style={styles.contractInfo}>
                  <Text style={GlobalStyles.body}>{contract.contractName}</Text>
                  <View style={styles.tag}>
                    <Text style={GlobalStyles.small}>
                      {contract.privacyRating}
                    </Text>
                  </View>
                </View>
                <Text style={[GlobalStyles.small, { color: "#383AB2" }]}>
                  Select →
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDF0",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  closeButton: {
    padding: 8,
    flexShrink: 0,
  },
  scrollView: {
    flex: 1,
  },
  contractItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contractInfo: {
    flex: 1,
    gap: 8,
  },
  tag: {
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 10000,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    alignSelf: "flex-start",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});
