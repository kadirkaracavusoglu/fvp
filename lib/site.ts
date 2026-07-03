export const SITE = {
  name: "Fitness ve Pazarlama",
  short: "FvP",
  belief: "Fitness işi şansa değil, sisteme dayanır.",
  tagline: "Fitness sektörünü tümüyle pazarlama merceğinden süzen ses.",
  email: "info@fitnessvepazarlama.com",
  hero: {
    title: "Antrenör gibi değil, fitness girişimcisi gibi düşün.",
    subtitle:
      "Fitness sektörünü pazarlama merceğinden okuyan bağımsız medya. Koçlar ve salon sahipleri için haftalık analiz, haber ve gerçek örnekler.",
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
  { label: "Rehberler", href: "/rehber" },
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

// Sık Sorulan Sorular (AEO/GEO — FAQPage şeması + görünür bölüm)
export const FAQS = [
  {
    q: "Fitness ve Pazarlama nedir?",
    a: "Fitness ve Pazarlama, fitness sektörünü tümüyle pazarlama merceğinden okuyan bağımsız bir Türkçe medya ve topluluktur. Koçlar ve salon sahipleri için pazarlama, satış ve teknoloji üzerine haftalık bülten, podcast ve yazılar üretir.",
  },
  {
    q: "Kimler için uygun?",
    a: "Online ve offline çalışan fitness koçları, salon ve stüdyo sahipleri ve fitness işini büyütmek isteyen herkes için. İçerikler işini ciddiye alan fitness girişimcilerine yöneliktir.",
  },
  {
    q: "İçerikler ücretsiz mi?",
    a: "Evet. Bülten, blog yazıları ve podcast tamamen ücretsizdir. E-posta adresinle abone olarak her şeye erişebilirsin.",
  },
  {
    q: "Ne sıklıkla içerik yayınlanıyor?",
    a: "Bülten haftada 2 kez, podcast (Fitness Pazarlama Anatomisi) ise her Çarşamba yayınlanır.",
  },
  {
    q: "Fitness ve Pazarlama'yı kim yönetiyor?",
    a: "Fitness ve Pazarlama, fitness pazarlama uzmanı Kadir Karaçavuşoğlu tarafından kurulmuş ve yürütülmektedir.",
  },
  {
    q: "Nasıl abone olurum?",
    a: "Ana sayfadaki forma e-posta adresini yazıp Kayıt Ol'a basman yeterli. Haftada 2 e-posta gelir, istediğin an çıkabilirsin.",
  },
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

// REHBER = kalıcı/evergreen içerik (SEO+GEO). Bülten'den ayrı, tarihsiz.
export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  updatedAt?: string;
  coverImage?: unknown;
  chars?: number;
  faq?: { question: string; answer: string }[];
};

// Placeholder rehberler — Sanity bağlanınca oradan beslenecek. Havuz Tur 3 çekirdek kelimeler (SERP boş).
export const GUIDES: Guide[] = [
  {
    slug: "online-antrenor-nasil-olunur",
    title: "Online Antrenör Nasıl Olunur?",
    excerpt: "Sertifikan olsa bile müşteri bulmak ayrı bir iştir. Online koçluğa sıfırdan başlamanın adım adım yol haritası: niş, konumlanma, ilk müşteri ve sistem.",
    category: "pazarlama",
    faq: [
      { question: "Online antrenör olmak için sertifika şart mı?", answer: "Yasal olarak bir antrenörlük/kişisel antrenör sertifikası önerilir, ancak müşteri bulmanın belirleyicisi sertifika değil; net bir niş, güven veren içerik ve bir satış sistemidir." },
      { question: "İlk müşteriyi nasıl bulurum?", answer: "İlk müşteri genelde reklamla değil, net bir niş + düzenli içerik + çevre üzerinden gelir. Belirli bir kişiye (örneğin 40 yaş üstü kadınlar) net bir vaatle konuşmak, geniş kitleye seslenmekten daha hızlı sonuç verir." },
    ],
  },
  {
    slug: "online-koclukta-fiyat-nasil-belirlenir",
    title: "Online Koçlukta Fiyat Nasıl Belirlenir?",
    excerpt: "Ucuz fiyat çok müşteri değil, az güven getirir. Değer temelli fiyatlama, fiyatı ne zaman yükseltmeli ve indirim tuzağından çıkış.",
    category: "satis",
    faq: [
      { question: "Fiyatı düşük tutmak daha çok müşteri getirir mi?", answer: "Genellikle hayır. Düşük fiyat 'az güven' sinyali verir ve daha kararsız müşteri çeker. Fiyatını yükselten koç çoğu zaman daha az ama daha ciddi danışanla çalışır." },
      { question: "Değer temelli fiyatlama nedir?", answer: "Değer temelli fiyatlama, hizmetin maliyetine değil müşteriye sağladığı sonuca göre fiyat belirlemektir." },
    ],
  },
  {
    slug: "online-koclugu-buyutme-sistemi",
    title: "Online Koçluk İşini Büyütme Sistemi",
    excerpt: "Birkaç müşteriden düzenli akışa geçmenin yolu daha çok çalışmak değil, tekrarlanabilir bir sistem kurmaktır: içerik, funnel ve takip.",
    category: "pazarlama",
    faq: [
      { question: "Online koçluk işi neden büyümüyor?", answer: "Çoğu zaman sorun yetenekte değil, gelen ilgiyi düzenli müşteriye çeviren bir sistemin olmamasındadır. Trafik, funnel ve takip birbirine bağlanmadığında iş kişisel çabaya kalır ve tavan yapar." },
    ],
  },
];

