import { supabaseAdmin } from "@/lib/supabase";

// GHL webhook'ları kişinin hangi funnel'dan geldiğini BİLMEZ. Panel ise
// event'leri `path` ön ekine göre funnel'lara ayırıyor (/fitsistem* vs
// /vaka-hande*). Sabit path yazmak, Vaka-Hande'den gelen bir satışı
// Fitsistem'e yazar ve iki funnel'ın karşılaştırmasını bozar.
//
// Çözüm: kişiyi Supabase `leads` tablosunda e-posta/telefonla bul, ilk
// inişinin yolundan funnel'ı türet. Bulunamazsa güvenli varsayılan: fitsistem
// (panelde yolu boş/eski olan kayıtlar zaten oraya sayılıyor).

const VAKA_HANDE_PREFIX = "/vaka-hande";

type LeadAttrRow = {
  attribution: Record<string, unknown> | null;
  created_at: string;
};

function landingPath(row: LeadAttrRow): string | null {
  const a = row.attribution || {};
  const first = a.first_landing_path;
  if (typeof first === "string" && first) return first;
  const last = a.landing_path;
  if (typeof last === "string" && last) return last;
  return null;
}

/**
 * Kişinin funnel yolunu çözer. Dönen değer event `path`'i olarak yazılır.
 * @param suffix örn. "/randevu" veya "/satis" → "/vaka-hande/satis"
 */
export async function resolveFunnelPath(
  email: string,
  phone: string,
  suffix: string,
): Promise<string> {
  const fallback = `/fitsistem${suffix}`;
  if (!supabaseAdmin) return fallback;

  const cleanEmail = (email || "").toLowerCase().trim();
  // Telefon formatları tutarsız (+90, boşluk, tire) → son 9 haneyi ara.
  const digits = (phone || "").replace(/\D/g, "");
  const tail = digits.length >= 9 ? digits.slice(-9) : "";
  if (!cleanEmail && !tail) return fallback;

  try {
    const filters: string[] = [];
    if (cleanEmail) filters.push(`email.eq.${cleanEmail}`);
    if (tail) filters.push(`phone.like.*${tail}`);

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("attribution,created_at")
      .or(filters.join(","))
      .order("created_at", { ascending: true })
      .limit(20);
    if (error || !data?.length) return fallback;

    // İLK kaydın yolu esas alınır (ilk dokunuş); yolu olmayan kayıtlar atlanır.
    for (const row of data as LeadAttrRow[]) {
      const path = landingPath(row);
      if (!path) continue;
      if (path.startsWith(VAKA_HANDE_PREFIX)) return `${VAKA_HANDE_PREFIX}${suffix}`;
      return fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
