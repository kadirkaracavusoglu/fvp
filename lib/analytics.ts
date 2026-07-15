// Takip kimlikleri — tek kaynak. Hepsi env'den gelir, kodda gömülü ID yoktur.
//
// Boş bırakılan araç hiç yüklenmez. Bu bilinçli: siteyi başka bir marka için
// klonlarken env doldurulmazsa veri YANLIŞ hesaba gitmez, hiç gitmez.
// Sessiz yanlış veri, hiç veriden daha kötüdür.
//
// NEXT_PUBLIC_* değişkenleri build sırasında gömülür → Vercel'de de tanımlı olmalı,
// yoksa deploy edilen sitede takip sessizce durur.

export const ANALYTICS = {
  ga: process.env.NEXT_PUBLIC_GA_ID ?? "",
  googleAds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  fbAppId: process.env.NEXT_PUBLIC_FB_APP_ID ?? "",
} as const;
