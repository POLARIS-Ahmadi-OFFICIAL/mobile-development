import { Stack } from "expo-router";

export default function AgentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#09090b" },
        headerTintColor: "#fafafa",
        contentStyle: { backgroundColor: "#09090b" },
      }}
    />
  );
}
