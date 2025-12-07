import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "@/constants/theme";

interface ActionButtonPairProps {
  leftButtonText: string;
  rightButtonText: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  variant?: "equal" | "left-primary"; // "equal" for both primary, "left-primary" for primary/secondary
}

export default function ActionButtonPair({
  leftButtonText,
  rightButtonText,
  onLeftPress,
  onRightPress,
  variant = "equal",
}: ActionButtonPairProps) {
  const isPrimaryLeft = variant === "left-primary";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPrimaryLeft && styles.primaryButton]}
        onPress={onLeftPress}
      >
        <Text style={[GlobalStyles.body, { color: "#FFFFFF" }]}>
          {leftButtonText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isPrimaryLeft && styles.secondaryButton]}
        onPress={onRightPress}
      >
        <Text
          style={[
            GlobalStyles.body,
            { color: isPrimaryLeft ? "#383AB2" : "#FFFFFF" },
          ]}
        >
          {rightButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 24,
    maxHeight: 36,
  },
  button: {
    backgroundColor: "#383AB2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  primaryButton: {
    backgroundColor: "#383AB2",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#383AB2",
    borderWidth: 1,
  },
});
