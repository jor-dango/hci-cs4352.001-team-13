import { GlobalStyles } from "@/constants/theme";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export default function BackButton({ onPress, label = "Go Back" }: BackButtonProps) {
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>
        ← {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 8,
  },
});
