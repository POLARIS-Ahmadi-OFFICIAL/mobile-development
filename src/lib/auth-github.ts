import * as QueryParams from "expo-auth-session/build/QueryParams";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export function authRedirectUri() {
  return makeRedirectUri({
    scheme: "polaris",
    path: "auth/callback",
  });
}

export async function signInWithGitHub(): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: "Set supabaseUrl and supabaseAnonKey in app.json extra." };
  }
  const redirectTo = authRedirectUri();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) {
    return { error: error.message };
  }
  if (!data?.url) {
    return { error: "No OAuth URL returned" };
  }
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success" || !result.url) {
    return { error: "Sign-in was cancelled" };
  }
  const { params, errorCode } = QueryParams.getQueryParams(result.url);
  if (errorCode) {
    return { error: errorCode };
  }
  const code = params.code;
  if (!code) {
    return { error: "Missing auth code in redirect" };
  }
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return { error: exchangeError.message };
  }
  return {};
}
