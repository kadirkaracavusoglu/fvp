import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL, Note } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Fitness ve Pazarlama tarafından hazırlanan aydınlatma metni.",
  alternates: { canonical: "/kvkk" },
};

const UPDATED = "8 Temmuz 2026";

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      updated={UPDATED}
      intro="Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) madde 10 kapsamında, veri sorumlusu sıfatıyla kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla hazırlanmıştır."
    >
      <H2>1. Veri Sorumlusu</H2>
      <P>
        Kişisel verileriniz, veri sorumlusu Kadir Karaçavuşoğlu (&quot;Fitness ve Pazarlama&quot;,
        fitnessvepazarlama.com) tarafından aşağıda açıklanan amaç ve hukuki sebeplerle işlenmektedir. İletişim:{" "}
        <a className="text-cyan underline" href="mailto:info@fitnessvepazarlama.com">info@fitnessvepazarlama.com</a>
      </P>

      <H2>2. İşlenen Kişisel Veriler</H2>
      <UL>
        <li><strong>Kimlik ve iletişim:</strong> ad-soyad, e-posta adresi, telefon numarası (form doldurduğunuzda),</li>
        <li><strong>Müşteri işlem / talep:</strong> gönderdiğiniz mesaj ve talep içeriği,</li>
        <li><strong>İşlem güvenliği ve kullanım:</strong> IP adresi, tarayıcı/cihaz bilgisi, site içi gezinme ve
          davranış verileri (çerezler aracılığıyla).</li>
      </UL>

      <H2>3. Kişisel Verilerin İşlenme Amaçları</H2>
      <UL>
        <li>Bülten ve içerik gönderimi ile pazarlama iletişiminin yürütülmesi,</li>
        <li>İletişim ve sponsorluk taleplerinin karşılanması,</li>
        <li>Site performansının ölçülmesi ve hizmetlerin iyileştirilmesi,</li>
        <li>Reklam ve pazarlama faaliyetlerinin analizi ve iyileştirilmesi,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
      </UL>

      <H2>4. İşlemenin Hukuki Sebepleri (KVKK md. 5)</H2>
      <UL>
        <li>Açık rızanızın bulunması (ör. bülten/ticari elektronik ileti gönderimi),</li>
        <li>Bir sözleşmenin kurulması veya ifası için gerekli olması,</li>
        <li>Veri sorumlusunun meşru menfaati (site güvenliği, ölçüm ve iyileştirme),</li>
        <li>Hukuki yükümlülüğün yerine getirilmesi.</li>
      </UL>

      <H2>5. Kişisel Verilerin Aktarımı</H2>
      <P>
        Kişisel verileriniz, hizmetin sunulabilmesi amacıyla yurt içi ve yurt dışında sunucuları bulunan hizmet
        sağlayıcılarla (Google, Meta, Microsoft Clarity, Beehiiv, Supabase, Vercel) sınırlı olarak paylaşılabilir. Bu
        sağlayıcıların bir kısmının altyapısı yurt dışında bulunduğundan, verileriniz KVKK madde 9 kapsamında yurt
        dışına aktarılabilir. Hangi sağlayıcıyla neden paylaşıldığı{" "}
        <Link className="text-cyan underline" href="/gizlilik">Gizlilik Politikası</Link>&apos;nda ayrıntılıdır.
      </P>

      <H2>6. Kişisel Veri Toplama Yöntemi</H2>
      <P>
        Verileriniz; sitedeki formlar aracılığıyla doğrudan sizin tarafınızdan, çerezler ve benzeri teknolojiler
        aracılığıyla ise otomatik yollarla, elektronik ortamda toplanır.
      </P>

      <H2>7. KVKK Madde 11 Kapsamındaki Haklarınız</H2>
      <P>Veri sahibi olarak aşağıdaki haklara sahipsiniz:</P>
      <UL>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme ve buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>Silinmesini veya yok edilmesini isteme,</li>
        <li>İşlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize çıkan sonuca itiraz etme,</li>
        <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde giderilmesini talep etme.</li>
      </UL>

      <H2>8. Başvuru</H2>
      <P>
        Yukarıdaki haklarınıza ilişkin taleplerinizi{" "}
        <a className="text-cyan underline" href="mailto:info@fitnessvepazarlama.com">info@fitnessvepazarlama.com</a>{" "}
        adresine iletebilirsiniz. Talebiniz, KVKK&apos;da öngörülen süre içinde ücretsiz olarak sonuçlandırılır.
      </P>

      <Note>
        Bu aydınlatma metni bilgilendirme amaçlıdır; verilerinizin işlenmesine ilişkin ayrıntılar için{" "}
        <Link className="underline" href="/gizlilik">Gizlilik Politikası</Link> ve{" "}
        <Link className="underline" href="/cerez">Çerez Politikası</Link> ile birlikte değerlendirilmelidir.
      </Note>
    </LegalPage>
  );
}
