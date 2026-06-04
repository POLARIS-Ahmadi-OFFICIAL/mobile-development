import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const url = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const key = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;
