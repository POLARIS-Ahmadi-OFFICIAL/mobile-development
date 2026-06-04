import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolve backend URL for the current runtime.
 * Android emulator: 10.0.2.2 maps to host machine localhost.
 */
export function getApiBase(): string {
  const fromExtra = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromExtra?.trim()) return fromExtra.trim();
  if (fromEnv?.trim()) return fromEnv.trim();
  if (Platform.OS === "android") return "http://10.0.2.2:8080";
  return "http://127.0.0.1:8080";
}
