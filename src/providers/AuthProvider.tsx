import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: { access_token: string } | null;
  loading: boolean;
  devBypass: boolean;
  setDevBypass: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? { access_token: data.session.access_token } : null);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { access_token: s.access_token } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const inAuthRoute = useMemo(() => {
    const root = segments[0];
    return root === "login" || root === "auth";
  }, [segments]);

  useEffect(() => {
    if (loading) return;
    const authed = Boolean(session) || devBypass;
    if (!authed && !inAuthRoute) {
      router.replace("/login");
      return;
    }
    if (authed && segments[0] === "login") {
      router.replace("/");
    }
  }, [loading, session, devBypass, inAuthRoute, segments, router]);

  const setDevBypassStable = useCallback((v: boolean) => setDevBypass(v), []);

  const value = useMemo(
    () => ({
      session,
      loading,
      devBypass,
      setDevBypass: setDevBypassStable,
    }),
    [session, loading, devBypass, setDevBypassStable],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
