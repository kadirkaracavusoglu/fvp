// VSL funnel yapılandırması — takvim, GHL webhook ve başvuru soruları tek yerde.
// Değişecek her şey (calendar, webhook, sorular) buradan yönetilir.

export const FUNNEL = {
  // GHL "Online Koçluk Strateji Görüşmesi" — hazır, quiz funnel'ında da bu kullanılıyor
  calendarUrl: "https://link.fitsistem.co/widget/bookings/analizongorusmesi",
  // Başvuru → GHL contact. Analiz quiz'inin mevcut FitSistem webhook'u kullanılır;
  // ileride ayrı VSL workflow'u açılırsa env ile override edilir.
  ghlWebhook:
    process.env.GHL_VSL_WEBHOOK ||
    "https://services.leadconnectorhq.com/hooks/ui4C7FNVHfgWeZk9DQpB/webhook-trigger/58d9ee4e-3545-42fe-8282-a00532da031c",
} as const;

export const VSL_OPTIN_CONTACT_KEY = "fvp_vsl_contact";

// Başvuru formu — analiz quiz'inden seçilmiş 7 kritik soru (Kadir sonra genişletir).
// Typeform tarzı: her ekran tek soru. Çoğu tek seçim; sonda iletişim.
export type BasvuruSoru = {
  key: string;
  soru: string;
  aciklama?: string;
  tip: "secim" | "coklu";
  secenekler: { deger: string; alt?: string }[];
};

export const BASVURU_SORULARI: BasvuruSoru[] = [
  {
    key: "asama",
    soru: "Online koçluk işinde şu an neredesin?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz başlamadım", alt: "Fikrim var ama daha danışanım yok" },
      { deger: "Yeni başladım", alt: "İlk danışanlarım var, oturmadı" },
      { deger: "Danışanlarım var, büyütmek istiyorum", alt: "Düzenli iş var ama takıldım" },
      { deger: "Oturmuş, ölçeklemek istiyorum", alt: "Sistem var, daha ileri gitmek istiyorum" },
    ],
  },
  {
    key: "gelir",
    soru: "Şu an aylık geliriniz hangi bantta?",
    tip: "secim",
    secenekler: [
      { deger: "Henüz düzenli gelir yok" },
      { deger: "0 - 25.000 TL" },
      { deger: "25.000 - 75.000 TL" },
      { deger: "75.000 TL ve üzeri" },
    ],
  },
  {
    key: "hedef",
    soru: "En çok neyi istiyorsunuz?",
    tip: "secim",
    secenekler: [
      { deger: "Düzenli danışan akışı", alt: "Ay başı endişesi bitsin" },
      { deger: "Daha yüksek gelir", alt: "Emeğimin karşılığını alayım" },
      { deger: "Zaman özgürlüğü", alt: "İşi bana bağımlı olmaktan çıkarayım" },
      { deger: "Tanınan bir marka", alt: "Sektörde adım geçsin" },
    ],
  },
  {
    key: "engel",
    soru: "Sizi en çok ne zorluyor?",
    tip: "secim",
    secenekler: [
      { deger: "Kime hitap ettiğim net değil", alt: "Konumlandırma" },
      { deger: "Yeni insanlara ulaşamıyorum", alt: "Trafik" },
      { deger: "Görüşmeler satışa dönmüyor", alt: "Dönüşüm" },
      { deger: "Danışan kalıcı olmuyor / kâr yok", alt: "Ekonomi" },
    ],
  },
  {
    key: "butce",
    soru: "İşinize aylık ne kadar bütçe ayırabiliyorsunuz?",
    aciklama: "Doğru yolu önerebilmek için soruyoruz — baskı yok.",
    tip: "secim",
    secenekler: [
      { deger: "Şu an bütçe ayıramıyorum" },
      { deger: "20.000 TL altı" },
      { deger: "20.000 - 50.000 TL" },
      { deger: "50.000 TL ve üzeri" },
    ],
  },
  {
    key: "kapasite",
    soru: "Haftada işinize kaç saat ayırabiliyorsunuz?",
    tip: "secim",
    secenekler: [
      { deger: "0 - 5 saat" },
      { deger: "5 - 10 saat" },
      { deger: "10 - 20 saat" },
      { deger: "20 saatten fazla" },
    ],
  },
  {
    key: "nedenSimdi",
    soru: "Neden tam da şimdi harekete geçmek istiyorsunuz?",
    aciklama: "Kendi cümlenizle en yakın olanı seçin.",
    tip: "secim",
    secenekler: [
      { deger: "Bu şekilde devam edemem, bir şey değişmeli" },
      { deger: "Bir fırsatım var, kaçırmak istemiyorum" },
      { deger: "Uzun süredir erteliyorum, artık ciddiyim" },
      { deger: "Doğru rehberi arıyordum" },
    ],
  },
];
