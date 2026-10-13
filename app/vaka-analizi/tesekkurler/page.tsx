"use client";

// A/B testi B varyantı (/vaka-analizi) — /vaka-hande/tesekkurler ile aynı içerik, ayrı adres.

import { useEffect } from "react";
import { captureAttribution, track, trackServer } from "@/lib/tracking";
import { OnGorusmeEgitimi } from "@/components/lp/OnGorusmeEgitimi";

// SOSYAL KANIT — gerçek içerik Kadir'den gelir (uydurma YASAK).
// Doldurulunca aşağıdaki bölüm otomatik görünür; boşken hiç render olmaz.
const KANITLAR: { ad: string; sonuc: string; alinti: string; detay?: string }[] = [];

export default function VakaAnaliziTesekkurlerPage() {
  useEffect(() => {
    captureAttribution();
    track("vsl_thankyou_view", { location: "vaka-analizi" });
    trackServer("vsl_thankyou_view");
  }, []);

  return (
    <div className="glow-bg min-h-screen px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* 1. ONAY */}
        <div className="text-center">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            Randevunuz oluşturuldu
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
            Randevunuz hazır. Görüşmeden önce üç şey yeterli.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Görüşmede genel konulara zaman harcamak yerine doğrudan sizin işinize
            bakmak istiyorum. Bunun için aşağıdaki üç adım yeterli.
          </p>
        </div>

        {/* 2. ÜÇ HAZIRLIK — ilk adım: randevu maili (katılımı artırır) */}
        <div className="mt-10 rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-sm sm:p-8">
          <ul className="space-y-6 text-sm text-gray-500">
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                1
              </span>
              <span>
                <strong className="text-[#0d204d]">
                  E-posta kutunuzu kontrol edin.
                </strong>{" "}
                Görüşmenin saati ve bağlantısı e-posta adresinize gönderildi.
                Birkaç dakikada gelmezse spam ve promosyonlar klasörüne bakın.
                Maili bulunca görüşmeyi takviminize ekleyin; saat geldiğinde
                aklınızda olsun.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                2
              </span>
              <span>
                <strong className="text-[#0d204d]">
                  Önümüzdeki 90 günde neyi değiştirmek istediğinizi düşünün.
                </strong>{" "}
                Daha fazla danışan almak, daha fazla kişiye ulaşmak, gelirinizi
                artırmak ya da işinizi düzene sokmak olabilir. Sizin için en
                önemli olanı netleştirin.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                3
              </span>
              <span>
                <strong className="text-[#0d204d]">
                  Bildiğiniz rakamları yanınızda bulundurun.
                </strong>{" "}
                Son aylarda aşağı yukarı ne kadar ciro yaptığınızı, kaç kişinin
                size ulaştığını, kaç görüşme ve kaç satış yaptığınızı not alın.
                Hepsini bilmeniz şart değil.
              </span>
            </li>
          </ul>
        </div>

        {/* 3. HANDE HATIRLATMASI — video zaten izlendi, sadece bağ kuruyoruz */}
        <div className="mt-10 rounded-2xl border border-[#e6e8ea] bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500">
            Az önce Hande Hoca&apos;nın vaka analizini izlediniz. Onun da başında aynı
            sorular vardı: &quot;Nereden başlamalıyım, zamanım olur mu, teknik
            kısımları kaldırabilir miyim?&quot; Görüşmede sizin işinize bakacağız.
            Fitsistem&apos;in hangi parçasından başlamanız gerektiğini ve
            mükemmelini beklemeden nasıl ilerleyeceğinizi birlikte
            netleştireceğiz.
          </p>
        </div>

        {/* 4. GÖRÜŞME ÖNCESİ EĞİTİM — sayfa boş kalmasın, görüşmeye hazırlıklı gelsin */}
        <OnGorusmeEgitimi
          location="vaka-analizi"
          videoId="Nqq7-YbvEhE"
          heading="Görüşmeye kadar izleyebileceğiniz kısa bir video"
          description="Salonu arkada bırakıp online koçluk işimizi nasıl kurduğumuzu, bir danışanımla antrenman yaparken anlattığım yaklaşık 32 dakikalık video. Görüşmeden önce izlerseniz temel konulara zaman ayırmadan doğrudan sizin işinize odaklanabiliriz. Hepsini izlemeniz şart değil."
          iframeTitle="Online fitness koçluk işini nasıl kurduk"
          buttonLabel="Videoyu YouTube'da İzle →"
        />

        {/* 5. SOSYAL KANIT — yalnızca gerçek içerik girilince görünür */}
        {KANITLAR.length > 0 && (
          <div className="mt-14">
            <h2 className="text-center text-xl font-bold text-[#0d204d] sm:text-2xl">
              Onlar da buradan başladı
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {KANITLAR.map((k) => (
                <div
                  key={k.ad}
                  className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-sm sm:p-6"
                >
                  <span className="inline-block rounded-full bg-[#0d204d] px-3 py-1 text-[11px] font-bold text-white">
                    {k.sonuc}
                  </span>
                  <blockquote className="mt-3 border-l-2 border-[#0d204d] pl-4 text-[15px] font-semibold leading-relaxed text-[#0d204d]">
                    “{k.alinti}”
                  </blockquote>
                  {k.detay && (
                    <p className="mt-3 text-[14px] leading-[1.7] text-gray-500">
                      {k.detay}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-semibold text-gray-400">
                    {k.ad}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
