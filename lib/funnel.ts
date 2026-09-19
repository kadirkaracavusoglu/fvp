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
    process.env.GHL_WEBHOOK_URL ||
    "https://services.leadconnectorhq.com/hooks/ui4C7FNVHfgWeZk9DQpB/webhook-trigger/8d9d82de-d562-4c8c-ba39-49e224b4ebcd",
} as const;

export const VSL_OPTIN_CONTACT_KEY = "fvp_vsl_contact";
export const VSL_UNLOCK_KEY = "fvp_vsl_unlocked"; // opt-in verildi → /fitsistem/izle video sayfası açılır
export const VSL_CTA_KEY = "fvp_vsl_cta"; // 5 dk izlendi → başvuru CTA açık kalır

// İKİNCİ FUNNEL — Hande vakası (/vaka-hande). Kendi videosu + kendi localStorage
// anahtarları (fitsistem funnel'ıyla kilit/CTA durumu KARIŞMASIN). Takvim + başvuru
// API'si + tracking altyapısı ortaktır; lead'ler attribution.landingUrl (/vaka-hande)
// ile ayrışır. Event'ler location:"vaka-hande" ile etiketlenir.
export const VAKA_HANDE = {
  videoId: "L_2y4a_k5hY", // Hande Zeynep Koç dönüşüm vakası (~27 dk)
  unlockKey: "fvp_vh_unlocked",
  ctaKey: "fvp_vh_cta",
  contactKey: "fvp_vh_contact",
} as const;

// VSL video — /fitsistem (kilitli poster) ve /fitsistem/izle (izleme) ortak videoId kullanır.
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
  /** Açık uçlu sorularda dokunulabilir başlangıç önerileri. */
  ornekler?: string[];
  /** true dönerse bu soru gösterilmez (ör. önceki cevaba göre atlanır). */
  atla?: (cevaplar: Record<string, string | string[]>) => boolean;
};

// 19 Eyl 2026 — Kadir'in revize formu (9 ekran). Kaldırılan sorular (engel_detay,
// degismezse, basari_kriteri) GHL'de alan olarak duruyor; eski cevaplar korunur.
export const BASVURU_SORULARI: BasvuruSoru[] = [
  {
    key: "asama",
    soru: "Online koçluk işinde şu an neredesin?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz başlamadım" },
      { deger: "İlk online danışanlarımı almaya başladım" },
      { deger: "Düzenli online danışan alıyorum" },
      { deger: "İşim oturdu, şimdi daha fazla büyütmek istiyorum" },
    ],
  },
  {
    key: "is_modeli",
    soru: "Şu anda koçluğu ağırlıklı olarak nasıl yürütüyorsun?",
    tip: "secim",
    secenekler: [
      { deger: "Tamamen online çalışıyorum" },
      { deger: "Hem online hem yüz yüze çalışıyorum" },
      { deger: "Ağırlıklı olarak salon / stüdyo üzerinden çalışıyorum" },
    ],
    // Henüz başlamamış kişiye sorulmaz → doğrudan ciro sorusuna geçer.
    atla: (c) => c.asama === "Henüz başlamadım",
  },
  {
    key: "gelir",
    soru: "Son 3 ayda aylık ortalama ciron hangi aralıkta?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz düzenli gelirim yok" },
      { deger: "0 – 25.000 TL" },
      { deger: "25.000 – 75.000 TL" },
      { deger: "75.000 – 150.000 TL" },
      { deger: "150.000 TL ve üzeri" },
    ],
  },
  {
    key: "hedef_12_ay",
    soru: "Önümüzdeki 90 günde işinde neyin değişmesini istiyorsun?",
    aciklama: "Mümkün olduğunca net yaz. Görüşmede hedefini buradan başlayarak değerlendireceğiz.",
    tip: "metin",
    placeholder:
      "Örn: Online koçluğa başlamak, daha düzenli danışan kazanmak, aylık gelirimi artırmak veya mevcut işimi daha düzenli büyütmek istiyorum.",
    ornekler: [
      "Online koçluğa başlamak istiyorum.",
      "Daha düzenli danışan kazanmak istiyorum.",
      "Aylık gelirimi artırmak istiyorum.",
      "Mevcut işimi daha düzenli büyütmek istiyorum.",
    ],
    minLength: 8,
  },
  {
    key: "darbogazlar",
    soru: "Şu anda işinde seni en çok zorlayan şey hangisi?",
    tip: "secim",
    secenekler: [
      { deger: "Nereden başlayacağımı ve hangi sırayla ilerlemem gerektiğini bilmiyorum" },
      { deger: "Kime hitap ettiğim ve insanların neden beni tercih etmesi gerektiği net değil" },
      { deger: "Yeterince kişi bana ulaşmıyor" },
      { deger: "İçerik üretiyorum ve insanlar bana ulaşıyor ama düzenli danışana dönüşmüyor" },
      { deger: "Danışan alıyorum ama işimi düzenli ve sürdürülebilir şekilde büyütemiyorum" },
    ],
  },
  {
    key: "neden_simdi",
    soru: "Neden şimdi harekete geçmek istiyorsun?",
    aciklama: "Seni bugün bu adımı atmaya iten şeyi kendi cümlelerinle kısa şekilde anlatabilirsin.",
    tip: "metin",
    placeholder:
      "Örn: Aylardır erteliyorum ve artık başlamak istiyorum. Salondaki tempoyu uzun vadede sürdürmek istemiyorum. Danışan alıyorum ama işim istediğim kadar düzenli büyümüyor.",
    ornekler: [
      "Aylardır erteliyorum ve artık başlamak istiyorum.",
      "Salondaki tempoyu uzun vadede sürdürmek istemiyorum.",
      "Danışan alıyorum ama işim istediğim kadar düzenli büyümüyor.",
    ],
    minLength: 8,
  },
  {
    key: "yatirim",
    soru: "Fitsistem Koçluk Programı’nın yatırım bedeli 30.000 – 50.000 TL aralığındadır. Birlikte çalışmanın senin için doğru olduğuna karar verirsek bu yatırım seviyesinde ilerlemeye hazır mısın?",
    tip: "secim",
    secenekler: [
      { deger: "Evet, doğru çözüm olduğuna karar verirsem başlayabilirim" },
      { deger: "Evet, ancak bütçemi ayarlamak için kısa bir süreye ihtiyacım olur" },
      { deger: "Önce görüşmede programın benim için doğru olup olmadığını netleştirmek istiyorum" },
    ],
  },
  {
    key: "karar_hizi",
    soru: "Birlikte çalışmanın senin için doğru olduğuna karar verirsek ne zaman başlamak istersin?",
    tip: "secim",
    secenekler: [
      { deger: "Mümkünse hemen başlamak istiyorum" },
      { deger: "Bu ay içinde başlamak istiyorum" },
      { deger: "Önümüzdeki 1–2 ay içinde başlayabilirim" },
    ],
  },
];

/** Görünen bir sonraki adım (atlanan soruları geçer). Son değer = iletişim ekranı. */
export function sonrakiAdim(step: number, cevaplar: BasvuruCevaplar): number {
  let i = step + 1;
  while (i < BASVURU_SORULARI.length && BASVURU_SORULARI[i].atla?.(cevaplar)) i++;
  return Math.min(i, BASVURU_SORULARI.length);
}

/** Görünen bir önceki adım. */
export function oncekiAdim(step: number, cevaplar: BasvuruCevaplar): number {
  let i = step - 1;
  while (i > 0 && BASVURU_SORULARI[i].atla?.(cevaplar)) i--;
  return Math.max(0, i);
}

/** İlerleme göstergesi: kaçıncı ekrandasın / toplam kaç ekran (atlananlar hariç). */
export function adimSayaci(step: number, cevaplar: BasvuruCevaplar) {
  const gorunur = BASVURU_SORULARI.map((q, i) => ({ q, i })).filter(({ q }) => !q.atla?.(cevaplar));
  const toplam = gorunur.length + 1; // + iletişim
  const sira = step >= BASVURU_SORULARI.length ? toplam : gorunur.findIndex(({ i }) => i === step) + 1;
  return { sira: Math.max(1, sira), toplam };
}

/** Gönderimden önce atlanan soruların (geri dönüp cevap değiştirildiyse kalan) cevaplarını at. */
export function gorunurCevaplar(cevaplar: BasvuruCevaplar): BasvuruCevaplar {
  const out: BasvuruCevaplar = { ...cevaplar };
  for (const q of BASVURU_SORULARI) if (q.atla?.(cevaplar)) delete out[q.key];
  return out;
}


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
  } else if (/İlk/.test(asama)) {
    score += 1;
  }

  // Bant, seçeneğin BAŞINDAKİ rakamdan okunur ("75.000 – 150.000" üst banda sayılmasın).
  if (/^150\.000/.test(gelir)) {
    score += 3;
    reasons.push("yüksek ciro bandı");
  } else if (/^75\.000/.test(gelir)) {
    score += 2;
  } else if (/^25\.000/.test(gelir)) {
    score += 1;
  }

  // Yatırım (19 Eyl: fiyat bandı soruda açıkça yazıyor → "başlayabilirim" güçlü sinyal)
  if (/başlayabilirim|hazırım/.test(yatirim)) {
    score += 4;
    reasons.push("yatırıma hazır");
  } else if (/bütçemi ayarla/.test(yatirim)) {
    score += 2;
  } else if (/netleştirmek|görüp karar/.test(yatirim)) {
    score += 1;
  } else if (/durumda değilim/.test(yatirim)) {
    score -= 2;
  }

  if (/hemen başlamak/.test(karar)) {
    score += 2;
    reasons.push("hızlı karar niyeti");
  } else if (/Bu ay içinde/.test(karar)) {
    score += 2;
  } else if (/1[–-]2 ay/.test(karar)) {
    score += 1;
  }

  const segment =
    score >= 8 ? "Yüksek öncelik" :
    score >= 5 ? "Orta öncelik" :
    score >= 2 ? "Takipte tut" :
    "Düşük uyum";

  return { score: Math.max(0, score), segment, reasons };
}
