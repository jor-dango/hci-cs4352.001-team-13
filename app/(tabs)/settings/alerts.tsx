import BackButton from '@/components/ui/back-button';
import Divider from '@/components/ui/divider';
import SettingsToggle from '@/components/ui/settings-toggle';
import { GlobalStyles } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALERTS_KEY = '@alerts';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const info = [
    'SSN',
    'Email',
    'Phone Number',
    'First Name',
    'Last Name',
    'Social Media'
  ]
  const alertLocs = [
    'Email',
    'Phone Number'
  ]

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const stored = await AsyncStorage.getItem(ALERTS_KEY);
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoaded(true);
    }
  };

  const saveAlerts = async (newAlerts: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Failed to save alerts:', error);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    const updated = { ...alerts, [key]: value };
    saveAlerts(updated);
  };

  if (!loaded) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />
        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What info do you want alerts for if your info is leaked or used without your consent?
        </Text>

        {info.map(infoPiece =>
          <SettingsToggle
            name={infoPiece}
            key={infoPiece}
            value={alerts[infoPiece] || false}
            onValueChange={(value) => handleToggle(infoPiece, value)}
          />
        )}

        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          Where do you want to receive alerts?
        </Text>

        {alertLocs.map(loc =>
          <SettingsToggle
            name={loc}
            key={loc}
            value={alerts[loc] || false}
            onValueChange={(value) => handleToggle(loc, value)}
          />
        )}
      </View>

    </SafeAreaView >
  )
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
