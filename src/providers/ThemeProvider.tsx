import * as SecureStore from "expo-secure-store";
import { colorScheme } from "nativewind";
import { Platform } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { View } from "react-native";
import { useColorScheme as useSystemColorScheme } from "react-native";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "polaris-theme";

function readWebPreference(): ThemePreference | null {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return null;
}

function writeWebPreference(pref: ThemePreference) {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, pref);
}

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(
  pref: ThemePreference,
  system: "light" | "dark" | "unspecified" | null | undefined,
): "light" | "dark" {
  if (pref === "system") {
    return system === "dark" ? "dark" : "light";
  }
  return pref;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [loaded, setLoaded] = useState(false);

  const resolved = resolveTheme(preference, systemScheme);

  useEffect(() => {
    void (async () => {
      try {
        const webPref = readWebPreference();
        if (webPref) {
          setPreferenceState(webPref);
          return;
        }
        const available = await SecureStore.isAvailableAsync();
        if (!available) return;
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      } catch {
        // SecureStore unavailable on this platform
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    colorScheme.set(resolved);
  }, [resolved, loaded]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    writeWebPreference(pref);
    void SecureStore.isAvailableAsync().then((ok) => {
      if (ok) void SecureStore.setItemAsync(STORAGE_KEY, pref);
    });
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className={`flex-1 ${resolved === "dark" ? "dark" : ""}`}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
