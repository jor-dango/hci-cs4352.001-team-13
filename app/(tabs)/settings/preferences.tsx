import BackButton from '@/components/ui/back-button';
import Divider from '@/components/ui/divider';
import SettingsToggle from '@/components/ui/settings-toggle';
import { GlobalStyles } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PREFERENCES_KEY = '@preferences';

export default function PreferencesScreen() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const info = [
    'SSN',
    'Email',
    'Phone Number',
    'First Name',
    'Last Name',
    'Social Media'
  ]
  const socials = [
    {
      name: 'Instagram',
      label: '@_account1_'
    },
    {
      name: 'Instagram',
      label: '@private_account2020_'
    },
    {
      name: 'LinkedIn',
      label: '/jordan-tan'
    },
    {
      name: 'Reddit',
      label: 'u/jordan-tan'
    }
  ]

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoaded(true);
    }
  };

  const savePreferences = async (newPreferences: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    const updated = { ...preferences, [key]: value };
    savePreferences(updated);
  };

  if (!loaded) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />
        <Divider />
        <View>
          <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
            What info are you concerned about?
          </Text>
          <Text style={[GlobalStyles.small, { color: "#6C6C6C" }]}>
            This will determine what info is showed in the initial summary of each contract
          </Text>
        </View>
        {info.map(infoPiece =>
          <SettingsToggle
            name={infoPiece}
            key={infoPiece}
            value={preferences[infoPiece] || false}
            onValueChange={(value) => handleToggle(infoPiece, value)}
          />
        )}

        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What socials are you fine with sharing?
        </Text>

        {socials.map(social =>
          <SettingsToggle
            name={social.name}
            label={social.label}
            key={social.label}
            value={preferences[social.label] || false}
            onValueChange={(value) => handleToggle(social.label, value)}
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
