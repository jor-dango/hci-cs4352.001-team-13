import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "@/constants/theme";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <Text style={GlobalStyles.h3}>Settings</Text>

        {/* TODO: Add settings content here */}
      </View>
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
});
