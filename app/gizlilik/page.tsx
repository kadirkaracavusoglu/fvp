import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL, Note } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Fitness ve Pazarlama olarak kişisel verilerinizi nasıl topladığımız, kullandığımız, sakladığımız ve koruduğumuza dair gizlilik politikası.",
  alternates: { canonical: "/gizlilik" },
};

const UPDATED = "8 Temmuz 2026";

export default function GizlilikPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      updated={UPDATED}
      intro="Bu Gizlilik Politikası, Fitness ve Pazarlama (fitnessvepazarlama.com) olarak sizden hangi kişisel verileri topladığımızı, bu verileri neden ve nasıl işlediğimizi, kimlerle paylaştığımızı ve haklarınızı açıklar."
    >
      <H2>1. Veri Sorumlusu</H2>
      <P>
        Kişisel verileriniz, veri sorumlusu sıfatıyla Kadir Karaçavuşoğlu (&quot;Fitness ve Pazarlama&quot;) tarafından
        aşağıda açıklanan kapsamda işlenmektedir. İletişim: <a className="text-cyan underline" href="mailto:info@fitnessvepazarlama.com">info@fitnessvepazarlama.com</a>
      </P>

      <H2>2. Topladığımız Kişisel Veriler</H2>
      <P>İki tür veri işliyoruz:</P>
      <UL>
        <li>
          <strong>Sizin doğrudan verdiğiniz veriler:</strong> Bülten aboneliğinde e-posta adresiniz; iletişim veya
          sponsorluk formunda ad-soyad, e-posta, telefon ve mesaj içeriğiniz.
        </li>
        <li>
          <strong>Otomatik toplanan veriler:</strong> Siteyi ziyaret ettiğinizde çerezler ve benzeri teknolojiler
          aracılığıyla IP adresi, tarayıcı/cihaz bilgisi, ziyaret edilen sayfalar, tıklama ve gezinme davranışı gibi
          kullanım verileri.
        </li>
      </UL>

      <H2>3. Kişisel Verileri İşleme Amaçlarımız</H2>
      <UL>
        <li>Bülten ve içeriklerimizi e-posta ile iletmek,</li>
        <li>İletişim ve sponsorluk taleplerinizi yanıtlamak,</li>
        <li>Sitenin performansını ölçmek, içeriği ve kullanıcı deneyimini iyileştirmek,</li>
        <li>Reklam ve pazarlama faaliyetlerimizin etkinliğini ölçmek ve iyileştirmek,</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek.</li>
      </UL>

      <H2>4. Çerezler</H2>
      <P>
        Sitemizde zorunlu, analitik ve reklam amaçlı çerezler kullanıyoruz. Hangi çerezleri kullandığımız ve bunları
        nasıl yönetebileceğiniz hakkında ayrıntılı bilgi için{" "}
        <Link className="text-cyan underline" href="/cerez">Çerez Politikası</Link> sayfamızı inceleyebilirsiniz.
      </P>

      <H2>5. Verilerin Paylaşıldığı Üçüncü Taraflar</H2>
      <P>
        Verilerinizi satmıyoruz. Hizmetlerimizi sunabilmek için aşağıdaki güvenilir hizmet sağlayıcılarla (yurt dışında
        sunucuları bulunanlar dâhil) sınırlı ölçüde paylaşıyoruz:
      </P>
      <UL>
        <li><strong>Google</strong> (Analytics, Ads, Tag Manager) — trafik ve reklam ölçümü,</li>
        <li><strong>Meta</strong> (Meta Pixel) — reklam ölçümü ve yeniden pazarlama,</li>
        <li><strong>Microsoft Clarity</strong> — kullanım davranışı ve oturum analizi (form alanları maskelenir),</li>
        <li><strong>Beehiiv</strong> — bülten gönderimi ve abone yönetimi,</li>
        <li><strong>Supabase</strong> — form verilerinin güvenli saklanması,</li>
        <li><strong>Vercel</strong> — sitenin barındırılması ve performans ölçümü.</li>
      </UL>
      <P>
        Bu sağlayıcıların bir kısmının sunucuları yurt dışında bulunduğundan, verileriniz KVKK&apos;nın öngördüğü
        şartlar çerçevesinde yurt dışına aktarılabilir.
      </P>

      <H2>6. Verilerin Saklanma Süresi</H2>
      <P>
        Kişisel verilerinizi, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen süreler boyunca
        saklarız. Bülten aboneliğiniz, siz abonelikten çıkana kadar; iletişim kayıtları, talebinizin sonuçlanması ve
        yasal saklama süresi boyunca tutulur. Süre sonunda verileriniz silinir veya anonim hâle getirilir.
      </P>

      <H2>7. Veri Güvenliği</H2>
      <P>
        Verilerinizi yetkisiz erişime, kayba ve kötüye kullanıma karşı korumak için makul teknik ve idari tedbirleri
        alırız. Form verileri şifreli bağlantı üzerinden iletilir ve erişimi sınırlı şekilde saklanır.
      </P>

      <H2>8. Haklarınız</H2>
      <P>
        KVKK kapsamındaki haklarınız (verilerinize erişme, düzeltme, silme, işlenmesine itiraz etme vb.) hakkında
        ayrıntılı bilgi ve başvuru yöntemi için{" "}
        <Link className="text-cyan underline" href="/kvkk">KVKK Aydınlatma Metni</Link> sayfamıza bakabilirsiniz.
        Bültenden çıkmak için her e-postanın altındaki bağlantıyı kullanabilirsiniz.
      </P>

      <H2>9. Değişiklikler</H2>
      <P>
        Bu politikayı zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayınlanır; önemli değişikliklerde
        sayfanın üstündeki tarih güncellenir.
      </P>

      <Note>
        Sorularınız için bize <a className="underline" href="mailto:info@fitnessvepazarlama.com">info@fitnessvepazarlama.com</a>{" "}
        adresinden ulaşabilirsiniz.
      </Note>
    </LegalPage>
  );
}
