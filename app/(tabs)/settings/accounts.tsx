import BackButton from '@/components/ui/back-button';
import Divider from '@/components/ui/divider';
import { GlobalStyles } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountsScreen() {

  const info = [
    {
      name: 'SSN',
      label: '***-**-1234'
    },
    {
      name: 'Email',
      label: 's****95@gmail.com'
    },
    {
      name: 'Phone Number',
      label: '***-***-1234'
    },
    {
      name: 'First Name',
      label: 'Jimothy'
    },
    {
      name: 'Last Name',
      label: 'John'
    }
  ];

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
  ];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />
        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          Connected Info
        </Text>

        {info.map(item =>
          <InfoToggle name={item.name} label={item.label} key={item.label} /> // Bad practice but this is not a dynamic list so wtv
        )}

        <Divider />
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          What socials are you fine with sharing?
        </Text>

        {socials.map(social =>
          <InfoToggle name={social.name} label={social.label} key={social.label} /> // Bad practice but this is not a dynamic list so wtv
        )}
      </View>

    </SafeAreaView >
  )
}

function InfoToggle({ name, label }: { name: string, label?: string }) {
  const [toggled, setToggled] = useState(true);

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%', paddingTop: 8, paddingBottom: 8 }}>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Text style={[GlobalStyles.body]}>
          {name}
        </Text>
        {label && toggled &&
          <Text style={[GlobalStyles.small, { color: "#6C6C6C" }]} >
            {label}
          </Text>
        }
      </View>
      <TouchableOpacity
        style={{ padding: 4 }}
        onPress={() => setToggled(!toggled)}
      >
        <Text style={[GlobalStyles.small, {color: toggled ? "#EF1111" : "#6C6C6C"}]}>
          {toggled ? "Remove" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
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
});
