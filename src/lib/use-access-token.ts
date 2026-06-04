import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export function useAccessToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setToken(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setToken(session?.access_token ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return token;
}
