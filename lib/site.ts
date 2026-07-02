export const SITE = {
  name: "Fitness ve Pazarlama",
  short: "FvP",
  belief: "Fitness işi şansa değil, sisteme dayanır.",
  tagline: "Fitness sektörünü tümüyle pazarlama merceğinden süzen ses.",
  email: "info@fitnessvepazarlama.com",
  hero: {
    title: "Antrenör gibi değil, fitness girişimcisi gibi düşün.",
    subtitle:
      "Fitness işini büyütmek için gereken pazarlama, satış ve sistemleri gerçek örneklerle anlatıyoruz. Haftada 2 e-posta, boş laf yok.",
  },
  cta: {
    whatsapp: "https://chat.whatsapp.com/EFEvQNVivG80QWiszY9fDX",
    gorusme: "https://link.fitsistem.co/widget/bookings/analizongorusmesi",
    bulten: "https://bulten.fitnessvepazarlama.com",
  },
  social: {
    instagram: "https://instagram.com/fitnessvepazarlama",
    youtube: "https://youtube.com/@fitnessvepazarlama",
    linkedin: "https://linkedin.com/in/kadirkaracavusoglu",
    spotify: "https://open.spotify.com/show/0ZkEtnn8BB8ZUXfLtTSwHu",
  },
};

// Üst menü (header)
export const NAV = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Bülten", href: "/bulten" },
  { label: "Podcast", href: "/podcast" },
  { label: "Analiz", href: "/analiz" },
  { label: "Danışmanlık", href: "/danismanlik" },
  { label: "Manifesto", href: "/manifesto" },
];

// Footer — tüm sayfalar
export const FOOTER_NAV = [
  ...NAV,
  { label: "Topluluk", href: "/topluluk" },
  { label: "Sponsorluk", href: "/sponsorluk" },
  { label: "İletişim", href: "/iletisim" },
];

// Yan yana çalıştığımız koçlar (hero altı sosyal kanıt) — foto: /public/koclar/<slug>.jpg (yoksa baş harf)
export const COACHES = [
  { name: "Mert Köksüren", role: "Online Koçluk", photo: "" },
  { name: "Yankı Tansuğ", role: "Fitness Koçluğu", photo: "" },
  { name: "Erdem İnan", role: "Kadın Koçluğu", photo: "" },
  { name: "Eray", role: "Wellness", photo: "" },
  { name: "Bahri Ata", role: "Boks Eğitimi", photo: "" },
];

// Neden bizi takip etmelisin? (2. section)
export const WHY_FOLLOW = [
  { icon: "🎯", title: "Fitness'a özel", text: "Genel pazarlama değil — sadece fitness işini büyütmeye odaklı." },
  { icon: "📊", title: "Gerçek örnekler", text: "Teori değil; sahada işe yarayan isimler, rakamlar, vakalar." },
  { icon: "🧩", title: "Tek kaynak", text: "Pazarlama, satış ve sistem bir arada — dağınık bilgi kovalamak yok." },
  { icon: "⚡", title: "Boş laf yok", text: "Haftada 2 e-posta, doğrudan işe yarar. Zamanını çalmayız." },
];

export const CATEGORIES = [
  { slug: "gundem", label: "Gündem", emoji: "📰" },
  { slug: "pazarlama", label: "Pazarlama", emoji: "💰" },
  { slug: "satis", label: "Satış", emoji: "🤝" },
  { slug: "teknoloji", label: "Teknoloji", emoji: "🤖" },
  { slug: "icgoruler", label: "Ekipten İçgörüler", emoji: "💬" },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string; // category slug
  date: string;
  featured?: boolean;
  coverImage?: unknown;
  chars?: number;
};

// Okuma süresi (dk) — ~1200 karakter/dk
export function readingTime(chars?: number): number {
  if (!chars) return 1;
  return Math.max(1, Math.round(chars / 1200));
}

// Placeholder içerik — sonra Sanity CMS'ten beslenecek
export const POSTS: Post[] = [
  { slug: "nis-secimi", title: "Niş Seçiminin Anatomisi", excerpt: "Herkese hitap eden koç, kimseye hitap etmiyor. Doğru nişi seçmenin sistemi.", category: "pazarlama", date: "2026-06-03", featured: true },
  { slug: "randevu-funnel", title: "Randevu Funnel'ı: Lead'den Satışa", excerpt: "Ücretsiz görüşmeyi satışa çeviren adım adım yapı.", category: "satis", date: "2026-06-20" },
  { slug: "ai-icerik", title: "AI ile İçerik Üretimi Nerede İşe Yarıyor?", excerpt: "Otomasyonun gerçekten sonuç verdiği ve vermediği noktalar.", category: "teknoloji", date: "2026-06-18" },
  { slug: "sektor-nabiz", title: "Fitness Sektöründe Bu Hafta", excerpt: "Sektörün nabzı: trendler, haberler, dikkat çeken hamleler.", category: "gundem", date: "2026-06-28" },
  { slug: "perde-arkasi", title: "Bir Danışanın Dönüşümü — Perde Arkası", excerpt: "Gerçek bir vaka üzerinden sistemin nasıl kurulduğu.", category: "icgoruler", date: "2026-06-15" },
  { slug: "marka-konumlanma", title: "Konumlanma: Neden Sen?", excerpt: "Rakiplerden ayrışmanın pazarlama mantığı.", category: "pazarlama", date: "2026-06-10" },
  { slug: "teklif-kapanis", title: "Teklifi Sunarken Yapılan 3 Hata", excerpt: "Kapanışı öldüren kalıplar ve yerine ne koymalı.", category: "satis", date: "2026-06-08" },
];
