import BackButton from '@/components/ui/back-button';
import Divider from '@/components/ui/divider';
import SettingsToggle from '@/components/ui/settings-toggle';
import { GlobalStyles } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertsScreen() {
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

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />
        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What info do you want alerts for if your info is leaked or used without your consent?
        </Text>

        {info.map(infoPiece =>
          <SettingsToggle name={infoPiece} key={infoPiece} /> // Bad practice but this is not a dynamic list so wtv
        )}

        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What socials are you fine with sharing?
        </Text>

        {alertLocs.map(loc =>
          <SettingsToggle name={loc} key={loc} /> // Bad practice but this is not a dynamic list so wtv
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
