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
  videoId: "DwMVqyS20Bo", // FINAL: "10 ayda 9M TL" vaka videosu (26:57) — Kadir onayladı
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
    soru: "Online koçluk işinde şu an neredesin?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz başlamadım" },
      { deger: "İlk danışanlarımı almaya başladım" },
      { deger: "Düzenli danışan alıyorum" },
      { deger: "İşim oturdu, şimdi daha fazla büyütmek istiyorum" },
    ],
  },
  {
    key: "is_modeli",
    soru: "Şu an ağırlıklı olarak nasıl çalışıyorsun?",
    tip: "secim",
    secenekler: [
      { deger: "Tamamen online çalışıyorum" },
      { deger: "Hem online hem yüz yüze çalışıyorum" },
      { deger: "Ağırlıklı olarak salon / stüdyo üzerinden çalışıyorum" },
      { deger: "Henüz düzenli danışanım yok" },
    ],
  },
  {
    key: "gelir",
    soru: "Son 3 ayda aylık ortalama ciron hangi aralıkta?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz düzenli gelirim yok" },
      { deger: "0 - 25.000 TL" },
      { deger: "25.000 - 75.000 TL" },
      { deger: "75.000 - 150.000 TL" },
      { deger: "150.000 TL ve üzeri" },
    ],
  },
  {
    key: "hedef_12_ay",
    soru: "Önümüzdeki 90 günde işinde neyin değişmesini istiyorsun?",
    aciklama: "Mümkün olduğunca net yaz. Görüşmede bu hedef üzerinden ilerleyeceğiz.",
    tip: "metin",
    placeholder: "Örn: Daha düzenli danışan almak, aylık gelirimi artırmak, daha fazla kişinin bana ulaşmasını sağlamak...",
    minLength: 8,
  },
  {
    key: "darbogazlar",
    soru: "Şu an işinde seni en çok zorlayan şey hangisi?",
    tip: "secim",
    secenekler: [
      { deger: "Kime hitap edeceğim ve kendimi nasıl farklı göstereceğim net değil" },
      { deger: "Yeterince kişi bana ulaşmıyor" },
      { deger: "İçerik üretiyorum ama danışana dönüşmüyor" },
      { deger: "İnsanlarla görüşüyorum ama yeterince satış yapamıyorum" },
      { deger: "İş büyüdükçe her şeye yetişmekte zorlanıyorum" },
      { deger: "Para kazanıyorum ama iş istediğim kadar düzenli ilerlemiyor" },
      { deger: "Nerede yanlış yaptığımı tam olarak bilmiyorum" },
    ],
  },
  {
    key: "engel_detay",
    soru: "Sence bugün istediğin noktaya gelmeni en çok ne engelliyor?",
    aciklama: "Kendi cümlelerinle kısa ve net anlatabilirsin.",
    tip: "metin",
    placeholder: "Örn: Nişim net değil, reklam denedim ama görüşmeler satışa dönmedi...",
    minLength: 8,
  },
  {
    key: "degismezse",
    soru: "6 ay boyunca hiçbir şey değişmezse seni en çok ne zorlar?",
    aciklama: "Seni acele ettirmek için değil, bunu çözmenin senin için ne kadar önemli olduğunu anlamak için soruyoruz.",
    tip: "metin",
    placeholder: "Örn: Aynı yerde kalmak, referansa bağımlı olmak, zamanıma rağmen büyüyememek...",
    minLength: 8,
  },
  {
    key: "yatirim",
    soru: "Doğru çözümü bulduğuna karar verirsen, işini büyütmek için yatırım yapmaya hazır mısın?",
    tip: "secim",
    secenekler: [
      { deger: "Evet, doğru çözümse yatırım yapmaya hazırım" },
      { deger: "Önce nasıl çalıştığınızı görüp karar vermek istiyorum" },
      { deger: "Başlamak için bütçemi ayarlamam gerekir" },
      { deger: "Şu anda yatırım yapabilecek durumda değilim" },
    ],
  },
  {
    key: "karar_hizi",
    soru: "Birlikte çalışmanın senin için doğru olduğuna karar verirsek ne zaman başlamak istersin?",
    tip: "secim",
    secenekler: [
      { deger: "Mümkünse hemen başlamak istiyorum" },
      { deger: "Bu ay içinde başlamak istiyorum" },
      { deger: "Önümüzdeki 1-2 ay içinde başlayabilirim" },
      { deger: "Önce nasıl çalıştığınızı anlamak istiyorum" },
      { deger: "Şimdilik sadece araştırıyorum" },
    ],
  },
  {
    key: "basari_kriteri",
    soru: "Görüşmeden çıktığında en çok hangi konuyu netleştirmiş olmak istersin?",
    aciklama: "Aklındaki en önemli soruyu veya çözmek istediğin konuyu yazabilirsin.",
    tip: "metin",
    placeholder: "Örn: Bana uygun büyüme yolu, reklam bütçesi, satış sistemi veya niş netliği...",
    minLength: 6,
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

  if (/oturdu|Düzenli/.test(asama)) {
    score += 2;
    reasons.push("iş seviyesi uygun");
  } else if (/İlk danışan/.test(asama)) {
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

  // Yatırım niyeti (yeni seçenekler)
  if (/hazırım/.test(yatirim)) {
    score += 4;
    reasons.push("yatırıma hazır");
  } else if (/görüp karar|bütçemi ayarlamam/.test(yatirim)) {
    score += 1;
  } else if (/durumda değilim/.test(yatirim)) {
    score -= 2;
  }

  // Başlama niyeti (yeni seçenekler)
  if (/hemen başlamak/.test(karar)) {
    score += 2;
    reasons.push("hızlı karar niyeti");
  } else if (/Bu ay içinde/.test(karar)) {
    score += 2;
  } else if (/1-2 ay/.test(karar)) {
    score += 1;
  } else if (/sadece araştırıyorum/.test(karar)) {
    score -= 1;
  }

  const segment =
    score >= 8 ? "Yüksek öncelik" :
    score >= 5 ? "Orta öncelik" :
    score >= 2 ? "Takipte tut" :
    "Düşük uyum";

  return { score: Math.max(0, score), segment, reasons };
}
