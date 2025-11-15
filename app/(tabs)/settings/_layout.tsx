import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="accounts"
        options={{
          title: "Accounts",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="alerts"
        options={{
          title: "Alerts",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          title: "Verification",
          presentation: "card",
        }}
      />
      {/* <Stack.Screen
        name="preferences"
        options={{
          title: "Preferences",
          presentation: "card",
        }}
      /> */}
    </Stack>
  );
}
