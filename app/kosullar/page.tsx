import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL, Note } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "Fitness ve Pazarlama web sitesinin kullanımına ilişkin koşullar, içerik hakları ve sorumluluk reddi.",
  alternates: { canonical: "/kosullar" },
};

const UPDATED = "8 Temmuz 2026";

export default function KosullarPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      updated={UPDATED}
      intro="Bu koşullar, fitnessvepazarlama.com sitesini kullanımınıza ilişkin kuralları belirler. Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız."
    >
      <H2>1. Kabul</H2>
      <P>
        Bu siteyi ziyaret ederek ve kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Koşulları kabul etmiyorsanız
        lütfen siteyi kullanmayınız.
      </P>

      <H2>2. İçerik ve Fikri Mülkiyet</H2>
      <P>
        Sitedeki tüm içerik (yazılar, bülten, podcast, görseller, marka ve logolar) Fitness ve Pazarlama&apos;ya aittir
        ve fikri mülkiyet mevzuatıyla korunur. İçeriği, kaynak göstererek ve ticari olmayan amaçla makul ölçüde
        paylaşabilirsiniz; ancak izinsiz olarak çoğaltamaz, yeniden yayınlayamaz veya ticari amaçla kullanamazsınız.
      </P>

      <H2>3. Kabul Edilebilir Kullanım</H2>
      <UL>
        <li>Siteyi yasa dışı bir amaçla veya başkalarının haklarını ihlal edecek şekilde kullanamazsınız,</li>
        <li>Sitenin güvenliğini veya işleyişini bozacak girişimlerde bulunamazsınız,</li>
        <li>Formlar aracılığıyla yanıltıcı veya üçüncü kişilere ait bilgi gönderemezsiniz.</li>
      </UL>

      <H2>4. Sorumluluk Reddi</H2>
      <P>
        Sitedeki içerikler yalnızca bilgilendirme ve eğitim amaçlıdır; bireysel danışmanlık, hukuki, finansal veya
        tıbbi tavsiye niteliği taşımaz. İçeriklere dayanarak alacağınız kararların sorumluluğu size aittir. İçeriklerin
        güncel ve doğru olması için çaba gösteririz ancak kesintisizlik veya hatasızlık garantisi vermeyiz.
      </P>

      <H2>5. Üçüncü Taraf Bağlantıları</H2>
      <P>
        Site, üçüncü taraf sitelere bağlantılar içerebilir. Bu sitelerin içeriğinden veya gizlilik uygulamalarından
        sorumlu değiliz.
      </P>

      <H2>6. Değişiklikler</H2>
      <P>
        Bu koşulları zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayınlanır.
      </P>

      <H2>7. Uygulanacak Hukuk</H2>
      <P>
        Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Doğabilecek uyuşmazlıklarda Türkiye mahkemeleri ve icra
        daireleri yetkilidir.
      </P>

      <Note>
        Sorularınız için{" "}
        <a className="underline" href="mailto:info@fitnessvepazarlama.com">info@fitnessvepazarlama.com</a> ·{" "}
        <Link className="underline" href="/gizlilik">Gizlilik Politikası</Link> ·{" "}
        <Link className="underline" href="/kvkk">KVKK</Link> ·{" "}
        <Link className="underline" href="/cerez">Çerez Politikası</Link>
      </Note>
    </LegalPage>
  );
}
