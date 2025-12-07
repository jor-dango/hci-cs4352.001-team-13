import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "@/constants/theme";
import ActionButtonPair from "./action-button-pair";

interface HistoryCardProps {
  contractName: string;
  date: string;
  privacyRating: string;
  onView: () => void;
  onCompare: () => void;
}

export default function HistoryCard({
  contractName,
  date,
  privacyRating,
  onView,
  onCompare,
}: HistoryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <Text style={GlobalStyles.body}>{contractName}</Text>
          <Text style={[GlobalStyles.small, { color: "#6B7280" }]}>{date}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={GlobalStyles.small}>{privacyRating}</Text>
        </View>
      </View>
      <ActionButtonPair
        leftButtonText="View"
        rightButtonText="Compare"
        onLeftPress={onView}
        onRightPress={onCompare}
        variant="left-primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  infoSection: {
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 10000,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: "flex-start",
  },
});
