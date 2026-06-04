import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { supabase } from "@/lib/supabase";

/** Deep-link landing route after OAuth (polaris://auth/callback). */
export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      router.replace("/login");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-[var(--st-main)]">
      <ActivityIndicator />
      <Text className="mt-3 text-sm text-[var(--st-muted)]">Completing sign-in…</Text>
    </View>
  );
}
