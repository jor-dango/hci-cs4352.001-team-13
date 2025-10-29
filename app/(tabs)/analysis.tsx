import { GlobalStyles } from '@/constants/theme'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Analysis() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={GlobalStyles.h3}>
        Contract Analysis & Summary
      </Text>
      <View style={styles.tag}>
        <Text style={GlobalStyles.small}>10/10 Privacy Rating</Text>
      </View>
      <View style={[styles.contentContainer, { gap: 8 }]}>
        <Text style={GlobalStyles.body}>
          Here are the key privacy concerns in your Walmart contract:
        </Text>
        <View style={styles.lightContainer}>
          <Text style={GlobalStyles.small}>
            1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor{"\n\n"}
            2. incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud{"\n\n"}
            3. exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure{"\n\n"}
            4. dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
          </Text>
        </View>
      </View>

      <View style={[styles.contentContainer, { gap: 8 }]}>
        <Text style={GlobalStyles.body}>Other sections and concerns:</Text>
        <View style={styles.lightContainer}>
          <Text style={GlobalStyles.small}>
            I. TERMS
          </Text>
        </View>
        <View style={styles.lightContainer}>
          <Text style={GlobalStyles.small}>
            II. PAY
          </Text>
        </View>
        <View style={styles.lightContainer}>
          <Text style={GlobalStyles.small}>
            III. SCHEDULE
          </Text>
        </View>
      </View>

      <View style={{flex: 1, flexDirection: 'row', gap: 24}}>
        <TouchableOpacity style={styles.button}>
          <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
            Save to Archive
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={[GlobalStyles.small, { color: "#FFFFFF" }]}>
            Ask a question
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EDEDF0",
    flex: 1,
    paddingTop: 76,
    paddingBottom: 76,
    paddingLeft: 24,
    paddingRight: 24
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: 24
  },
  tag: {
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 10000,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    alignSelf: 'flex-start'
  },
  lightContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#BEBEBE",
    borderWidth: 1,
    borderRadius: 8
  },
  button: {
    backgroundColor: "#383AB2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
})