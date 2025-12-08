import { GlobalStyles } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export default function BackButton({ onPress, label = "Go Back" }: BackButtonProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handlePress}
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
