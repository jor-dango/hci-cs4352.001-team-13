import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "@/constants/theme";

interface ActionButtonPairProps {
  leftButtonText: string;
  rightButtonText: string;
  onLeftPress: () => void;
  onRightPress: () => void;
}

export default function ActionButtonPair({
  leftButtonText,
  rightButtonText,
  onLeftPress,
  onRightPress,
}: ActionButtonPairProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onLeftPress}>
        <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
          {leftButtonText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onRightPress}>
        <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
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
});
