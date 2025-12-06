import Divider from "@/components/ui/divider";
import { GlobalStyles } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <Text style={GlobalStyles.h3}>Settings</Text>
        <View style={{ height: 20 }} />
        <Divider />
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => router.push("/(tabs)/settings/preferences")}
          activeOpacity={0.7}
        >
          <Text style={GlobalStyles.body}>Info Preferences</Text>
          <ChevronRight />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => router.push("/(tabs)/settings/alerts")}
          activeOpacity={0.7}
        >
          <Text style={GlobalStyles.body}>Alerts</Text>
          <ChevronRight />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => router.push("/(tabs)/settings/verification")}
          activeOpacity={0.7}
        >
          <Text style={GlobalStyles.body}>Connected Accounts</Text>
          <ChevronRight />
        </TouchableOpacity>
        <Divider />

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
    gap: 8
  },
  settingsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100%',
    paddingVertical: 4,
  },
});
