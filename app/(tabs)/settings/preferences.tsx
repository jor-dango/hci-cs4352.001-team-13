import Divider from '@/components/ui/divider';
import SettingsToggle from '@/components/ui/settings-toggle';
import { GlobalStyles } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreferencesScreen() {

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

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ marginBottom: 8 }}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={[GlobalStyles.body, { color: "#383AB2" }]}>← Go Back</Text>
        </TouchableOpacity>

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
          <SettingsToggle name={infoPiece} key={infoPiece} /> // Bad practice but this is not a dynamic list so wtv
        )}

        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What socials are you fine with sharing?
        </Text>

        {socials.map(social =>
          <SettingsToggle name={social.name} label={social.label} key={social.label} /> // Bad practice but this is not a dynamic list so wtv
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
