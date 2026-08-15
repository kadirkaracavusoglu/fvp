// VSL funnel yapılandırması — takvim, GHL webhook ve başvuru soruları tek yerde.
// Değişecek her şey (calendar, webhook, sorular) buradan yönetilir.

export const FUNNEL = {
  // GHL "Online Koçluk Strateji Görüşmesi" — hazır, quiz funnel'ında da bu kullanılıyor
  calendarUrl: "https://link.fitsistem.co/widget/booking/SSw6HZHR3j9veTWH8xTp",
  // VSL'ye ÖZEL GHL webhook'u (Kadir, 15 Ağu) — kendi VSL workflow'unu tetikler
  // (contact + otomasyon/e-posta/pipeline). Custom field'lar ayrıca doğrudan upsert
  // ile de doldurulur (lib/ghl-contact.ts). URL gizli değil; env ile override edilebilir.
  ghlWebhook:
    process.env.GHL_VSL_WEBHOOK ||
    "https://services.leadconnectorhq.com/hooks/ui4C7FNVHfgWeZk9DQpB/webhook-trigger/8d9d82de-d562-4c8c-ba39-49e224b4ebcd",
} as const;

export const VSL_OPTIN_CONTACT_KEY = "fvp_vsl_contact";
export const VSL_UNLOCK_KEY = "fvp_vsl_unlocked"; // opt-in verildi → /vsl video sayfası açılır
export const VSL_CTA_KEY = "fvp_vsl_cta"; // 5 dk izlendi → başvuru CTA açık kalır

// VSL video — /vsl/optin (kilitli poster) ve /vsl (izleme) ortak videoId kullanır.
// Başlık/alt metin sayfaya özel (optin ile izleme sayfası farklı konuşur).
export const VSL_VIDEO = {
  videoId: "DwMVqyS20Bo", // taslak: "10 ayda 9M TL" vaka (26:57) — gerçekle değişecek
} as const;

// Başvuru formu — yüksek niyetli application akışı.
// Typeform tarzı: her ekran tek karar; seçmeli, çoklu seçim ve kısa metin destekler.
export type BasvuruSoru = {
  key: string;
  soru: string;
  aciklama?: string;
  tip: "secim" | "coklu" | "metin";
  secenekler?: { deger: string; alt?: string }[];
  placeholder?: string;
  minLength?: number;
};

export const BASVURU_SORULARI: BasvuruSoru[] = [
  {
    key: "asama",
    soru: "Online koçluk işinde şu an hangi seviyedesin?",
    aciklama: "Görüşmede sana nereden başlamamız gerektiğini bilmek için.",
    tip: "secim",
    secenekler: [
      { deger: "Henüz başlamadım", alt: "Fikrim var ama daha danışanım yok" },
      { deger: "İlk danışanlarım var", alt: "Satış geliyor ama düzenli değil" },
      { deger: "Düzenli danışan alıyorum", alt: "Büyütmek istiyorum ama sistem eksik" },
      { deger: "Oturmuş işi ölçeklemek istiyorum", alt: "Daha fazla kâr, ekip veya sistem hedefliyorum" },
    ],
  },
  {
    key: "is_modeli",
    soru: "İşi şu an nasıl yürütüyorsun?",
    tip: "secim",
    secenekler: [
      { deger: "Tek başıma online koçluk yapıyorum" },
      { deger: "Online + yüz yüze/hibrid çalışıyorum" },
      { deger: "Ekibim veya operasyon desteğim var" },
      { deger: "Salon/klinik/stüdyo üzerinden büyütüyorum" },
    ],
  },
  {
    key: "gelir",
    soru: "Son 3 ay ortalama aylık ciron hangi bantta?",
    aciklama: "Net rakam değil, doğru ölçek seviyesini anlamak için bant yeterli.",
    tip: "secim",
    secenekler: [
      { deger: "Henüz düzenli gelir yok" },
      { deger: "0 - 25.000 TL" },
      { deger: "25.000 - 75.000 TL" },
      { deger: "75.000 - 150.000 TL" },
      { deger: "150.000 TL ve üzeri" },
    ],
  },
  {
    key: "hedef_12_ay",
    soru: "Önümüzdeki 12 ayda işinin nerede olmasını istiyorsun?",
    aciklama: "Tek cümle yeter. Görüşmedeki stratejiyi bu hedefe göre kuracağız.",
    tip: "metin",
    placeholder: "Örn: Ayda 20 nitelikli görüşme, 10 yeni danışan ve daha sistemli satış akışı...",
    minLength: 10,
  },
  {
    key: "darbogazlar",
    soru: "Şu an büyümeyi en çok nerede kaybediyorsun?",
    aciklama: "Birden fazla seçebilirsin.",
    tip: "coklu",
    secenekler: [
      { deger: "Kime hitap ettiğim net değil", alt: "Konumlandırma" },
      { deger: "Düzenli lead akışı kuramıyorum", alt: "Trafik" },
      { deger: "İçerik/otorite beni taşımıyor", alt: "Güven" },
      { deger: "Görüşmeler satışa dönmüyor", alt: "Dönüşüm" },
      { deger: "Sistem yok, her şey bana bağlı", alt: "Operasyon" },
      { deger: "Kâr ve zaman dengesi bozuluyor", alt: "Ekonomi" },
    ],
  },
  {
    key: "engel_detay",
    soru: "Bu hedefe ulaşmanı şu an en çok ne engelliyor?",
    aciklama: "Kısa ve net yaz. Görüşmede buradan açacağız.",
    tip: "metin",
    placeholder: "Örn: Nişim net değil, reklam denedim ama görüşmeler satışa dönmedi...",
    minLength: 10,
  },
  {
    key: "degismezse",
    soru: "6 ay hiçbir şey değişmezse seni en çok ne zorlar?",
    aciklama: "Bu soru aceleyi değil, gerçek önceliği anlamak için.",
    tip: "metin",
    placeholder: "Örn: Aynı yerde kalmak, referansa bağımlı olmak, zamanıma rağmen büyüyememek...",
    minLength: 10,
  },
  {
    key: "yatirim",
    soru: "Doğru plan çıkarsa büyüme için aylık yatırım hazırlığın nedir?",
    aciklama: "Reklam, sistem ve danışmanlık kapasitesini doğru önermek için.",
    tip: "secim",
    secenekler: [
      { deger: "Şu an yatırım ayıramam" },
      { deger: "20.000 TL altı" },
      { deger: "20.000 - 50.000 TL" },
      { deger: "50.000 - 100.000 TL" },
      { deger: "100.000 TL ve üzeri" },
    ],
  },
  {
    key: "karar_hizi",
    soru: "Fit çıkarsa ne kadar hızlı başlamak istersin?",
    tip: "secim",
    secenekler: [
      { deger: "Bu ay başlamak isterim" },
      { deger: "1-2 ay içinde netleştirmek isterim" },
      { deger: "Önce seçenekleri anlamak istiyorum" },
      { deger: "Sadece araştırıyorum" },
    ],
  },
  {
    key: "basari_kriteri",
    soru: "Bu görüşmenin senin için değerli olması için neyi netleştirmeliyiz?",
    tip: "metin",
    placeholder: "Örn: Bana uygun büyüme yolu, reklam bütçesi, satış sistemi veya niş netliği...",
    minLength: 8,
  },
];

export type BasvuruCevaplar = Record<string, string | string[]>;

export const BASVURU_LABELS = BASVURU_SORULARI.reduce<Record<string, string>>((acc, soru) => {
  acc[soru.key] = soru.soru;
  return acc;
}, {});

export function scoreApplication(answers: BasvuruCevaplar) {
  let score = 0;
  const reasons: string[] = [];
  const asama = String(answers.asama || "");
  const gelir = String(answers.gelir || "");
  const yatirim = String(answers.yatirim || "");
  const karar = String(answers.karar_hizi || "");
  const darbogazlar = Array.isArray(answers.darbogazlar) ? answers.darbogazlar : [];

  if (/Oturmuş|Düzenli/.test(asama)) {
    score += 2;
    reasons.push("iş seviyesi uygun");
  } else if (/İlk/.test(asama)) {
    score += 1;
  }

  if (/150\.000/.test(gelir)) {
    score += 3;
    reasons.push("yüksek ciro bandı");
  } else if (/75\.000/.test(gelir)) {
    score += 2;
  } else if (/25\.000/.test(gelir)) {
    score += 1;
  }

  if (/100\.000/.test(yatirim)) {
    score += 4;
    reasons.push("yüksek yatırım hazırlığı");
  } else if (/50\.000 - 100\.000/.test(yatirim)) {
    score += 3;
  } else if (/20\.000 - 50\.000/.test(yatirim)) {
    score += 2;
  } else if (/20\.000 TL altı/.test(yatirim)) {
    score += 1;
  } else if (/ayıramam/.test(yatirim)) {
    score -= 2;
  }

  if (/Bu ay/.test(karar)) {
    score += 2;
    reasons.push("hızlı karar niyeti");
  } else if (/1-2 ay/.test(karar)) {
    score += 1;
  }

  if (darbogazlar.length >= 2) score += 1;

  const segment =
    score >= 8 ? "Yüksek öncelik" :
    score >= 5 ? "Orta öncelik" :
    score >= 2 ? "Takipte tut" :
    "Düşük uyum";

  return { score: Math.max(0, score), segment, reasons };
}
