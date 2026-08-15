const TOKEN =
  process.env.META_ACCESS_TOKEN_FVP ||
  process.env.META_ADS_TOKEN_FVP ||
  process.env.META_ADS_TOKEN ||
  process.env.META_ACCESS_TOKEN ||
  "";
const ACCOUNT = (
  process.env.META_AD_ACCOUNT_ID_FVP ||
  process.env.META_AD_ACCOUNT_ID ||
  ""
).replace(/^act_/, "");

export const metaInsightsEnabled = Boolean(TOKEN && ACCOUNT);

export async function getMetaSpend(
  since: string,
  until: string,
): Promise<{ ok: boolean; spend: number | null; error?: string }> {
  if (!metaInsightsEnabled) {
    return { ok: false, spend: null, error: "meta_insights_disabled" };
  }

  const url =
    `https://graph.facebook.com/v26.0/act_${ACCOUNT}/insights` +
    `?fields=spend&level=account&time_increment=1` +
    `&time_range=${encodeURIComponent(JSON.stringify({ since, until }))}` +
    `&limit=500&access_token=${TOKEN}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        spend: null,
        error: `meta_insights_${res.status}: ${text.slice(0, 160)}`,
      };
    }
    const data: { data?: Array<{ spend?: string }> } = await res.json();
    const spend = (data.data || []).reduce(
      (sum, row) => sum + (Number(row.spend) || 0),
      0,
    );
    return { ok: true, spend };
  } catch (error) {
    return {
      ok: false,
      spend: null,
      error: error instanceof Error ? error.message : "meta_insights_error",
    };
  }
}
