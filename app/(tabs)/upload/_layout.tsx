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
          title: "Upload",
        }}
      />
      <Stack.Screen
        name="analysis"
        options={{
          title: "Analysis",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="comparison"
        options={{
          title: "Comparison",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
