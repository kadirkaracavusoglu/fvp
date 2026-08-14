import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL, Note } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    `${SITE.name} sitesinde kullanılan çerezler, ne işe yaradıkları ve bunları nasıl yönetebileceğinize dair çerez politikası.`,
  alternates: { canonical: "/cerez" },
};

const UPDATED = "8 Temmuz 2026";

export default function CerezPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      updated={UPDATED}
      intro={`Bu politika, ${SITE.domain} sitesinde hangi çerezleri ve benzeri teknolojileri kullandığımızı, ne amaçla kullandığımızı ve bunları nasıl yönetebileceğinizi açıklar.`}
    >
      <H2>1. Çerez Nedir?</H2>
      <P>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitenin düzgün
        çalışmasını sağlamak, deneyimi iyileştirmek ve kullanım verilerini ölçmek için kullanılırlar.
      </P>

      <H2>2. Kullandığımız Çerez Türleri</H2>
      <P><strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri ve güvenliği için gereklidir; kapatılamaz.</P>
      <P>
        <strong>Analitik çerezler:</strong> Ziyaretçilerin siteyi nasıl kullandığını anlamamızı sağlar. Kullandığımız
        araçlar: <strong>Google Analytics</strong>, <strong>Microsoft Clarity</strong>, <strong>Vercel Analytics</strong>{" "}
        ve <strong>Speed Insights</strong>.
      </P>
      <P>
        <strong>Reklam çerezleri:</strong> Reklamlarımızın etkinliğini ölçmek ve yeniden pazarlama için kullanılır.
        Kullandığımız araçlar: <strong>Meta Pixel</strong> ve <strong>Google Ads</strong>.
      </P>

      <H2>3. Üçüncü Taraf Çerezleri</H2>
      <P>
        Yukarıdaki analitik ve reklam çerezleri, ilgili üçüncü taraf sağlayıcılar (Google, Meta, Microsoft) tarafından
        yerleştirilir. Bu sağlayıcıların verileri nasıl işlediğine dair kendi gizlilik politikaları geçerlidir.
      </P>

      <H2>4. Çerezleri Nasıl Yönetirsiniz?</H2>
      <P>Çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz:</P>
      <UL>
        <li>
          <strong>Tarayıcı ayarları:</strong> Kullandığınız tarayıcının ayarlarından çerezleri silebilir veya
          engelleyebilirsiniz. (Zorunlu çerezleri engellemek sitenin bazı bölümlerini etkileyebilir.)
        </li>
        <li>
          <strong>Google Analytics:</strong>{" "}
          <a className="text-cyan underline" href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
            Google Analytics Devre Dışı Bırakma
          </a>{" "}
          eklentisiyle çıkış yapabilirsiniz.
        </li>
        <li>
          <strong>Reklam çerezleri:</strong> Google ve Meta hesap ayarlarınızdan kişiselleştirilmiş reklamları
          kapatabilirsiniz.
        </li>
      </UL>

      <H2>5. İletişim</H2>
      <P>
        Çerez kullanımı hakkında sorularınız için{" "}
        <a className="text-cyan underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
        adresine yazabilirsiniz.
      </P>

      <Note>
        Verilerinizin işlenmesine ilişkin ayrıntılar için{" "}
        <Link className="underline" href="/gizlilik">Gizlilik Politikası</Link> ve{" "}
        <Link className="underline" href="/kvkk">KVKK Aydınlatma Metni</Link> sayfalarını inceleyebilirsiniz.
      </Note>
    </LegalPage>
  );
}
