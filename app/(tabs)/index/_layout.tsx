import { Stack } from "expo-router";

export default function UploadStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hide header on upload screen
          title: "Upload",
        }}
      />
      <Stack.Screen
        name="analysis"
        options={{
          title: "Analysis",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
