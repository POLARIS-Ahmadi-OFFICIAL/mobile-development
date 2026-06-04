import "../global.css";

import { StatusBar } from "expo-status-bar";

import AppTabs from "@/components/app-tabs";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";

function ThemedStatusBar() {
  const { resolved } = useTheme();
  return <StatusBar style={resolved === "dark" ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedStatusBar />
        <AppTabs />
      </AuthProvider>
    </ThemeProvider>
  );
}
