import { Stack } from "expo-router";

export default function ToolsLayout() {
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
