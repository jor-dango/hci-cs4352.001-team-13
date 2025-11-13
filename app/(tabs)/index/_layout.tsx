import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Upload" }} />
      <Stack.Screen name="analysis" options={{ title: "Analysis" }} />
    </Stack>
  );
}
