import { GlobalStyles } from "@/constants/theme";
import { Link } from "expo-router";
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <Text style={GlobalStyles.h3}>Settings</Text>
        <View style={{ height: 20 }} />
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%' }}>
          <Link href={"/(tabs)/settings/preferences"}>
            Info Preferences
          </Link>
          <ChevronRight />
        </View>
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%' }}>
          <Link href={"/(tabs)/settings/alerts"}>
            Alerts
          </Link>
          <ChevronRight />
        </View>
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%' }}>
          <Link href={"/(tabs)/settings/accounts"}>
            Connected Accounts
          </Link>
          <ChevronRight />
        </View>
        <Divider />

      </View>
    </SafeAreaView>
  );
}

function Divider() {
  return <View style={{ height: 1, minWidth: '100%', backgroundColor: '#BEBEBE' }} />
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
});
