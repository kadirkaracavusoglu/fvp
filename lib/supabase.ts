import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseEnabled = Boolean(url && serviceKey);

// Sunucu tarafı client (service_role — gizli, sadece API route'larda kullan)
export const supabaseAdmin: SupabaseClient | null = supabaseEnabled
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;
