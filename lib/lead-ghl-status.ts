import type { SupabaseClient } from "@supabase/supabase-js";

type GhlDeliveryStatus = {
  ok: boolean;
  status: number | null;
  error: string | null;
};

export async function markLeadGhlDelivery(
  supabase: SupabaseClient | null,
  leadId: string | null,
  delivery: GhlDeliveryStatus,
) {
  if (!supabase || !leadId) return;
  const { error } = await supabase
    .from("leads")
    .update({
      ghl_ok: delivery.ok,
      ghl_last_status: delivery.status,
      ghl_error: delivery.error,
      ghl_attempted_at: new Date().toISOString(),
      ghl_attempt_count: 1,
    })
    .eq("id", leadId);
  if (error) console.error("lead ghl status update:", error.message);
}
