import { GlobalStyles } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const [input, setInput] = useState('');
  const [errMsg, setErrMsg] = useState('');

  function verifyPassword() {
    if (input === password) {
      router.replace("/(tabs)/settings/preferences");
    }
    else {
      setErrMsg("Incorrect password");
    }
  }

  const password = '1234';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.container}>
        <Text style={[GlobalStyles.body, { fontWeight: 'bold' }]}>
          Please confirm your identity:
        </Text>
        <TextInput
          placeholder='Password'
          value={input}
          onChangeText={e => setInput(e)}
          style={{ borderColor: '#BEBEBE', borderWidth: 1, padding: 8, width: '50%', borderRadius: 8 }}
        />
        <TouchableOpacity style={styles.button} onPress={verifyPassword}>
          <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
            Submit
          </Text>
        </TouchableOpacity>
        {errMsg &&
          <Text style={[GlobalStyles.body, { color: '#EF1111' }]}>
            {errMsg}
          </Text>
        }
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
    display: 'flex',
    flex: 1,
    paddingTop: 16,
    paddingLeft: 24,
    paddingRight: 24,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: "#383AB2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
