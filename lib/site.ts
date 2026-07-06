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
  sections?: { h: string; p: string[] }[]; // Sanity body yoksa fallback tam içerik
};

// Okuma süresi (dk) — ~1200 karakter/dk
export function readingTime(chars?: number): number {
  if (!chars) return 1;
  return Math.max(1, Math.round(chars / 1200));
}

// Placeholder içerik — sonra Sanity CMS'ten beslenecek
export const POSTS: Post[] = [
  {
    slug: "bulten-9-sektorde-bu-hafta",
    title: "Fitness ve Pazarlama Bülteni #9 — Sektörde Bu Hafta",
    excerpt: "Hyrox'un açtığı rekabetsiz pencere, Meta'nın önce-sonra yasağı, longevity nişi, şirketlere fitness ve Reformer patlaması. 5 başlık, doğrudan işinize yansımalarıyla.",
    category: "gundem",
    date: "2026-07-07",
    featured: true,
    sections: [
      { h: "📰 Fitness'da Gündem", p: [
        "Hyrox yükselişini sürdürüyor. Aramalar son bir yılda %233 arttı; Türkiye'de İstanbul'a ek İzmir edisyonu açıklandı. Erken giren koç, rekabetin neredeyse olmadığı bir pencerede otorite kurar.",
        "Meta, \"önce-sonra\" görsellerinde sertleşti. Bu kreatifler reddediliyor, hesaplar askıya alınıyor. Sonucu fotoğrafla değil; süreç, sistem ve gerçek danışan hikâyesiyle anlatın.",
        "Longevity (uzun ve sağlıklı yaşam) yeni ve pahalı bir niş olarak yükseliyor. Estetik pazarı doygunken, 40 yaş üstü kitleye \"daha ince değil, daha uzun ve güçlü yaşa\" diye konumlanmak açık bir alan.",
        "Kurumsal wellness (şirketlere fitness) sessizce büyüyen bir pazar. Bir şirketle tek anlaşma, onlarca kişilik gelir demek; bağımsız koç için henüz rakipsiz.",
        "Reformer Pilates patlaması sürüyor. Hızlı büyüyen ama güven sorunu olan bir alanda, güvenle ayrışan eğitmen kazanır. Dolu ders daha çok reklam değil, güven kuran içerikle gelir.",
      ]},
      { h: "💰 Fitness'da Pazarlama", p: [
        "Pazar doydu; Armut'ta bile 1.703 online koç listeli. Ama kalabalık, herkesi değil ayrışanı görünür kılıyor.",
        "Bu hafta bir içerik üretirken tek bir soru sorun: \"Bu içerik kimin ekranını durdurur?\" Cevabınız \"herkes\" ise içerik henüz hazır değildir. Net bir kişi (örneğin 40 yaşında ilk kez ağırlık çalışmaya korkan kadın) ise, işte o zaman durdurursunuz. Daralttıkça daha çok insana ulaşırsınız.",
      ]},
      { h: "🤝 Fitness'da Satış", p: [
        "Satış görüşmesinde en pahalı hata çok konuşmaktır. Kapanışı belirleyen şey, karşı tarafın ne kadar konuştuğudur.",
        "İlk yarıda hedefiniz teklif sunmak değil, doğru soruyu sorup dinlemek olmalı: \"Şu an sizi en çok zorlayan ne?\", \"Bunu ne zamandır çözmeye çalışıyorsunuz?\" İnsan kendi ihtiyacını kendi ağzından duyunca ikna olur.",
      ]},
      { h: "🤖 Fitness'da Teknoloji", p: [
        "Yapay zeka içerik üretimini hızlandırıyor ama bir tuzağı var: herkes aynı araca aynı komutu verince içerikler birbirine benziyor.",
        "AI'ı taslak ve hız için kullanın; ama son sözü kendi vakanız ve kendi sesiniz söylesin. Araç herkeste aynı, ona verdiğiniz gerçek örnek sizde farklı.",
      ]},
      { h: "💬 Ekipten İçgörüler", p: [
        "Bu hafta bir görüşmede şunu bir kez daha gördüm: fiyatı düşürmek daha çok değil, daha kararsız müşteri getiriyor. Fiyatını yükselten koç, daha az ama daha ciddi danışanla çalışıyor.",
        "Düşük fiyat \"çok müşteri\" değil, \"az güven\" sinyali veriyor. Fiyatınızı düşürmeyi düşünüyorsanız, önce sorun: sorun fiyat mı, yoksa değeri yeterince gösterememek mi?",
      ]},
    ],
  },
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
  // Sanity body yoksa fallback tam içerik (basit bölümler)
  sections?: { h: string; p: string[] }[];
};

// Placeholder rehberler — Sanity bağlanınca oradan beslenecek. Havuz Tur 3 çekirdek kelimeler (SERP boş).
export const GUIDES: Guide[] = [
  {
    slug: "online-antrenor-nasil-olunur",
    title: "Online Antrenör Nasıl Olunur?",
    excerpt: "Online antrenör, danışanlarına uzaktan (internet üzerinden) antrenman ve takip hizmeti veren kişidir. Bu işe başlamak için üç şey gerekir: temel bir bilgi/sertifika, net bir hedef kitle ve bu kitleye ulaşmanın bir yolu. Aşağıda hepsini en basit haliyle, adım adım anlatıyoruz.",
    category: "pazarlama",
    updatedAt: "2026-07-03",
    sections: [
      {
        h: "Online antrenör tam olarak ne yapar?",
        p: [
          "Online antrenör, danışanına yüz yüze değil internet üzerinden hizmet verir. Yani danışan bir salonda değil, kendi evinde ya da istediği yerde çalışır; siz de programı, takibi ve motivasyonu uzaktan sağlarsınız.",
          "İş genelde üç parçadan oluşur: kişiye özel bir antrenman programı hazırlamak, beslenme konusunda yol göstermek ve düzenli takip edip kişiyi hedefe götürmek. İletişim WhatsApp, video görüşme, e-posta ya da bir uygulama üzerinden olur.",
          "En büyük fark şu: fiziksel salonda saatiniz sınırlıdır, bir günde ancak belli sayıda kişiyle çalışırsınız. Online çalışınca aynı anda çok daha fazla kişiye ulaşabilirsiniz. Ama bu, işi bir 'sistem' olarak kurmanızı gerektirir.",
        ],
      },
      {
        h: "Online antrenör olmak için sertifika şart mı?",
        p: [
          "Bilgi ve güvenilirlik için bir antrenörlük ya da kişisel antrenör sertifikası almanız önerilir. İnsanlar sağlıklarını emanet edecekleri kişinin işini bildiğinden emin olmak ister.",
          "Ama dürüst olalım: müşteri bulup bulamamanızı belirleyen şey sertifika değildir. Piyasada sertifikası olup tek müşteri bulamayan çok insan var. Belirleyici olan üç şey: kime hitap ettiğiniz (niş), sizi nasıl tanıdıkları (içerik) ve satışı nasıl yaptığınız (sistem).",
          "Özetle: sertifika işin 'giriş bileti'dir, ama işi büyüten şey pazarlama ve sistemdir.",
        ],
      },
      {
        h: "Nereden başlamalı? Önce bir niş seçin",
        p: [
          "En sık yapılan hata 'herkese' hitap etmeye çalışmaktır. 'Herkesi formda tutarım' demek, aslında kimseye bir şey söylememektir. İnsan kendini o cümlede göremez.",
          "Bunun yerine belirli bir kişiyi seçin. Örneğin: 40 yaş üstü, ilk kez ağırlık çalışmaya başlayacak kadınlar. Ya da masa başında çalışan, sırt-bel ağrısı olan erkekler. Ne kadar net olursanız, o kişi 'bu tam benim için' der.",
          "Niş sizi daraltmaz, tam tersine büyütür. Çünkü net bir kişiye seslenen içerik daha çok paylaşılır, daha çok güven kurar ve sizi o alanda 'uzman' yapar. Genişlemeyi sonra, otorite kurduktan sonra yaparsınız.",
        ],
      },
      {
        h: "İlk müşterinizi nasıl bulursunuz?",
        p: [
          "İlk müşteri genelde pahalı reklamlarla değil, üç yoldan gelir: yakın çevreniz, düzenli içerik ve mevcut ilişkiler.",
          "1) Çevre: tanıdıklarınıza ne yaptığınızı net anlatın. İlk danışanlar çoğu zaman 'zaten sizi tanıyan' insanlardan çıkar.",
          "2) İçerik: seçtiğiniz nişe yönelik düzenli, faydalı içerik paylaşın (kısa video, gönderi). Amaç 'her şeyi bilen' görünmek değil, o kişinin bir sorununu çözmek. İçerik güven kurar, güven de müşteri getirir.",
          "3) Net bir teklif: 'İsteyen yazsın' değil, 'şu sorunu şu sürede şöyle çözüyorum, ilgilenen bana yazsın' gibi somut bir çağrı yapın. Belirsiz davet, belirsiz sonuç verir.",
        ],
      },
      {
        h: "Fiyatı nasıl belirlersiniz?",
        p: [
          "Yeni başlayanların en büyük korkusu fiyatı yüksek tutmaktır. Oysa çok düşük fiyat 'ucuz' değil, 'güvenilmez' sinyali verir ve kararsız müşteri çeker.",
          "Fiyatı maliyetinize göre değil, kişiye sağladığınız sonuca göre belirleyin. Birine ağrısını geçiren ya da özgüvenini kazandıran bir hizmetin değeri, harcadığınız saatten çok daha fazladır.",
          "Bu konuyu ayrı bir rehberde detaylı anlatıyoruz: online koçlukta fiyat nasıl belirlenir.",
        ],
      },
      {
        h: "İşi tek seferlik değil, sistemli yapın",
        p: [
          "Çoğu antrenör her ay sıfırdan başlar: bu ay müşteri gelince sevinir, gelmeyince paniğe kapılır. Bunun sebebi yetenek eksikliği değil, sistem eksikliğidir.",
          "Sistem şu demek: insanların sizi düzenli bulduğu bir içerik akışı, gelen ilgiyi müşteriye çeviren bir yol (funnel) ve danışanı elde tutan bir takip düzeni. Bu üçü birbirine bağlandığında iş tahmin edilebilir hale gelir.",
          "İşi büyütmenin yolunu ayrı bir rehberde anlatıyoruz: online koçluk işini büyütme sistemi.",
        ],
      },
      {
        h: "Yeni başlayanların en sık 3 hatası",
        p: [
          "1) Herkese hitap etmeye çalışmak. Sonuç: kimse kendini görmez, kimse yazmaz.",
          "2) Fiyatı çok düşük tutmak. Sonuç: az güven, kararsız müşteri, tükenmişlik.",
          "3) İçeriği düzensiz üretmek. Bir hafta atıp üç hafta susmak güven kurmaz. Düzen, yetenekten önce gelir.",
        ],
      },
    ],
    faq: [
      { question: "Online antrenör olmak için sertifika şart mı?", answer: "Bilgi ve güven için bir antrenörlük sertifikası önerilir, ancak müşteri bulmanın belirleyicisi sertifika değil; net bir niş, güven veren düzenli içerik ve bir satış sistemidir." },
      { question: "İlk müşteriyi nasıl bulurum?", answer: "İlk müşteri genelde reklamla değil; yakın çevre, seçtiğiniz nişe yönelik düzenli içerik ve net bir teklif üzerinden gelir. Belirli bir kişiye net bir vaatle seslenmek, herkese seslenmekten daha hızlı sonuç verir." },
      { question: "Online koçluğa sıfır deneyimle başlanır mı?", answer: "Evet, ama önce temel bir bilgi/sertifika ve net bir hedef kitle gerekir. Deneyim, ilk danışanlarla birlikte hızla artar; beklemek yerine küçük ve net başlamak daha iyidir." },
      { question: "Online antrenörlük kazançlı mı?", answer: "Fiziksel salona göre zaman sınırı daha az olduğu için ölçeklenebilir. Kazanç; niş, fiyatlama ve sistemin kurulmasına bağlıdır. İşi tek tek değil sistemli kuran antrenör daha yüksek ve daha düzenli gelir elde eder." },
    ],
  },
  {
    slug: "online-koclukta-fiyat-nasil-belirlenir",
    title: "Online Koçlukta Fiyat Nasıl Belirlenir?",
    excerpt: "Online koçlukta fiyat, harcadığınız saate göre değil, danışana sağladığınız sonuca göre belirlenir. Buna değer temelli fiyatlama denir. Çok düşük fiyat 'ucuz' değil 'güvenilmez' sinyali verir ve kararsız müşteri çeker. Aşağıda fiyatı adım adım, en basit haliyle belirlemeyi anlatıyoruz.",
    category: "satis",
    updatedAt: "2026-07-03",
    sections: [
      {
        h: "Fiyatı neye göre belirlemeliyim?",
        p: [
          "Çoğu antrenör fiyatı 'kaç saat harcıyorum' diye hesaplar. Bu yanlış başlangıçtır. Danışan sizin saatinizi değil, ulaşacağı sonucu satın alır: ağrısının geçmesi, kilo vermesi, özgüven kazanması.",
          "Buna değer temelli fiyatlama denir: fiyatı maliyetinize göre değil, kişiye sağladığınız sonucun değerine göre koyarsınız. Birine hayatını değiştiren bir sonuç veriyorsanız, harcadığınız saat ikinci plandadır.",
        ],
      },
      {
        h: "Ucuz fiyat neden zarar verir?",
        p: [
          "Düşük fiyat 'daha çok müşteri' getireceğini sanırsınız ama tersi olur. Ucuz fiyat 'bu hizmete kendisi bile değer vermiyor' izlenimi bırakır; yani az güven sinyalidir.",
          "Ayrıca ucuza gelen danışan, hizmete de az değer biçer: programı uygulamaz, çabuk vazgeçer, en çok şikayet eden grup olur. Sonuçta çok çalışıp az kazanır ve tükenirsiniz.",
          "Fiyatını yükselten koç ise daha az ama daha ciddi, sonuç almaya kararlı danışanla çalışır.",
        ],
      },
      {
        h: "Fiyatı nasıl hesaplarım? (basit yöntem)",
        p: [
          "1) Bir ayda kaç danışanla gerçekten iyi ilgilenebileceğinizi belirleyin (örneğin 10 kişi).",
          "2) Aylık ulaşmak istediğiniz geliri o sayıya bölün. Örneğin hedefiniz belliyse, kişi başı fiyat kabaca ortaya çıkar.",
          "3) Sonra bu fiyatı sağladığınız sonuçla karşılaştırın: verdiğiniz değer bu fiyatı taşıyor mu? Taşıyorsa doğru yoldasınız. Emin değilseniz fiyat düşük değil, değeri yeterince gösterememiş olabilirsiniz.",
        ],
      },
      {
        h: "Fiyatı ne zaman yükseltmeliyim?",
        p: [
          "Şu işaretler geldiğinde fiyatı yükseltme zamanıdır: sürekli doluysunuz ve bekleme listeniz oluşuyorsa; herkes hemen 'evet' diyorsa (bu fiyatın düşük olduğunun işaretidir); ve sonuçlarınızın kanıtı arttıysa.",
          "Fiyat yükseltmek yeni danışanlarda daha kolaydır. Mevcut danışanları önceden bilgilendirerek kademeli yapabilirsiniz.",
        ],
      },
      {
        h: "İndirim yapmalı mıyım?",
        p: [
          "Sürekli indirim, markanızı ucuzlatır ve insanları 'indirim beklemeye' alıştırır. Bir dahaki sefere tam fiyata kimse gelmez.",
          "İndirim yerine değer katın: aynı fiyata ekstra bir şey verin (bonus içerik, ek görüşme). Böylece fiyatı düşürmeden 'daha çok değer' hissi yaratırsınız.",
        ],
      },
    ],
    faq: [
      { question: "Fiyatı düşük tutmak daha çok müşteri getirir mi?", answer: "Genellikle hayır. Düşük fiyat 'az güven' sinyali verir ve daha kararsız müşteri çeker. Fiyatını yükselten koç çoğu zaman daha az ama daha ciddi danışanla çalışır." },
      { question: "Değer temelli fiyatlama nedir?", answer: "Değer temelli fiyatlama, hizmetin maliyetine değil müşteriye sağladığı sonuca göre fiyat belirlemektir." },
      { question: "Fiyatı ne zaman yükseltmeliyim?", answer: "Sürekli doluysanız ve bekleme listeniz oluşuyorsa, herkes teklife hemen 'evet' diyorsa ve sonuçlarınızın kanıtı arttıysa fiyatı yükseltme zamanıdır." },
      { question: "İndirim yapmak zararlı mı?", answer: "Sürekli indirim markayı ucuzlatır ve müşteriyi indirim beklemeye alıştırır. İndirim yerine aynı fiyata ekstra değer katmak daha sağlıklıdır." },
    ],
  },
  {
    slug: "online-koclugu-buyutme-sistemi",
    title: "Online Koçluk İşini Büyütme Sistemi",
    excerpt: "Online koçluk işini büyütmenin yolu daha çok çalışmak değil, tekrarlanabilir bir sistem kurmaktır. Bu sistem üç parçadan oluşur: sizi düzenli görünür kılan içerik, gelen ilgiyi müşteriye çeviren bir yol (funnel) ve danışanı elde tutan takip. Aşağıda bu üç parçayı en basit haliyle anlatıyoruz.",
    category: "pazarlama",
    updatedAt: "2026-07-03",
    sections: [
      {
        h: "Online koçluk işi neden büyümüyor?",
        p: [
          "Çoğu antrenör her ay sıfırdan başlar: bu ay müşteri gelince sevinir, gelmeyince paniğe kapılır. Sebep çoğu zaman yetenek eksikliği değildir; iyi antrenörler bile bu döngüye takılır.",
          "Asıl sebep sistem eksikliğidir. Yeni müşteri her seferinde tek tek, elle, tesadüfen geliyorsa iş kişisel çabaya bağlı kalır ve bir tavana çarpar. Daha çok çalışmak bu tavanı yükseltmez, sizi yorar.",
        ],
      },
      {
        h: "Sistem ne demek? (3 parça)",
        p: [
          "Sistem, işin kendi kendine tekrar eden bir düzene oturması demektir. Üç parçası vardır: içerik (sizi bulurlar), funnel (ilgi müşteriye döner), takip (danışan kalır).",
          "Bu üçü birbirine bağlandığında iş tahmin edilebilir hale gelir: kaç kişi geliyor, kaçı müşteri oluyor, kaçı kalıyor — hepsini görürsünüz ve iyileştirirsiniz.",
        ],
      },
      {
        h: "1. İçerik: sizi düzenli görünür kılar",
        p: [
          "İnsanlar tanımadıkları kişiden hizmet almaz. Seçtiğiniz nişe yönelik düzenli, faydalı içerik (kısa video, gönderi) sizi görünür kılar ve güven biriktirir.",
          "Önemli olan mükemmellik değil düzendir. Bir hafta paylaşıp üç hafta susmak güven kurmaz. Az ama düzenli, çok ama düzensizden iyidir.",
        ],
      },
      {
        h: "2. Funnel: ilgiyi müşteriye çevirir",
        p: [
          "İçerikle gelen ilgi kendiliğinden müşteriye dönmez. Bir yol lazım: içerik → net bir sonraki adım (ücretsiz rehber, quiz ya da görüşme) → teklif.",
          "Örneğin içerikten insanları ücretsiz bir görüşmeye ya da bir e-posta listesine alırsınız; orada güven kurar, sonra teklifinizi sunarsınız. Bu adımların olmadığı yerde ilgi buharlaşır.",
        ],
      },
      {
        h: "3. Takip: danışanı elde tutar",
        p: [
          "Yeni müşteri bulmak, mevcut danışanı tutmaktan pahalıdır. Danışan giderse ne kadar satarsanız satın delik kova doldurursunuz.",
          "Düzenli takip, ilerleme kontrolü ve iletişim danışanı elde tutar. Kalan mutlu danışan hem yeniler hem de en iyi reklamınızdır: sizi başkalarına anlatır.",
        ],
      },
      {
        h: "Daha çok çalışmak değil, tekrarlanabilir kurmak",
        p: [
          "Büyüme, günde 14 saat çalışmak değildir; aynı işi her seferinde tekrar tekrar yapmaktan kurtulmaktır. İçeriği, funnel'ı ve takibi bir kez kurup düzene bağladığınızda, iş sizin sürekli müdahaleniz olmadan da akmaya başlar.",
          "Nereden başlamalı? Önce en zayıf halkanızı bulun: insanlar sizi bulamıyor mu (içerik), buluyor ama satın almıyor mu (funnel), yoksa alıyor ama gidiyor mu (takip)? En çok sızıntı nerede ise önce oraya odaklanın.",
        ],
      },
    ],
    faq: [
      { question: "Online koçluk işi neden büyümüyor?", answer: "Çoğu zaman sorun yetenekte değil, gelen ilgiyi düzenli müşteriye çeviren bir sistemin olmamasındadır. İçerik, funnel ve takip birbirine bağlanmadığında iş kişisel çabaya kalır ve tavan yapar." },
      { question: "Büyümek için daha çok mu çalışmak gerekir?", answer: "Hayır. Büyüme daha çok saat değil, tekrarlanabilir bir sistem gerektirir. İçerik, funnel ve takip bir kez kurulup düzene bağlandığında iş sürekli müdahale olmadan akmaya başlar." },
      { question: "Nereden başlamalıyım?", answer: "En zayıf halkanızı bulun: insanlar sizi bulamıyor mu (içerik), buluyor ama almıyor mu (funnel), yoksa alıyor ama gidiyor mu (takip)? En çok sızıntı olan yere önce odaklanın." },
    ],
  },
];

