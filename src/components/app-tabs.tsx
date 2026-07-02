import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useTheme } from "@/providers/ThemeProvider";

export default function AppTabs() {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  return (
    <NativeTabs
      backgroundColor={isDark ? "#161618" : "#f5f5f7"}
      indicatorColor={isDark ? "#2c2c2e" : "#ffffff"}
      labelStyle={{ selected: { color: isDark ? "#0a84ff" : "#0071e3", fontWeight: "600" } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home_filled" }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="agents">
        <NativeTabs.Trigger.Icon
          sf={{ default: "cpu", selected: "cpu.fill" }}
          md="psychology"
        />
        <NativeTabs.Trigger.Label>Agents</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tools">
        <NativeTabs.Trigger.Icon
          sf={{ default: "wrench.and.screwdriver", selected: "wrench.and.screwdriver.fill" }}
          md="build"
        />
        <NativeTabs.Trigger.Label>Tools</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
