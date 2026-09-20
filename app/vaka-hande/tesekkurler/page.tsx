"use client";

import { useEffect } from "react";
import { captureAttribution, track, trackServer } from "@/lib/tracking";
import { OnGorusmeEgitimi } from "@/components/lp/OnGorusmeEgitimi";

// SOSYAL KANIT — gerçek içerik Kadir'den gelir (uydurma YASAK).
// Doldurulunca aşağıdaki bölüm otomatik görünür; boşken hiç render olmaz.
const KANITLAR: { ad: string; sonuc: string; alinti: string; detay?: string }[] = [];

export default function VakaHandeTesekkurlerPage() {
  useEffect(() => {
    captureAttribution();
    track("vsl_thankyou_view", { location: "vaka-hande" });
    trackServer("vsl_thankyou_view");
  }, []);

  return (
    <div className="glow-bg min-h-screen px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* 1. ONAY */}
        <div className="text-center">
          <span className="chip inline-block px-4 py-1 text-xs" data-active="true">
            Randevun oluşturuldu
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold leading-tight text-[#0d204d] sm:text-5xl">
            Randevun hazır. Görüşmeden önce üç şey yeterli.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
            Görüşmede zamanı genel konulara ayırmak yerine doğrudan senin işine
            odaklanmak istiyorum. Aşağıdaki üç adım bunun için yeterli.
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
                  E-posta kutunu kontrol et.
                </strong>{" "}
                Görüşmenin saati ve bağlantısı e-posta adresine gönderildi.
                Birkaç dakika içinde gelmediyse spam ve promosyonlar
                klasörlerine bak. Maili bulduğunda görüşmeyi takvimine ekle;
                o saatte aklında olsun.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                2
              </span>
              <span>
                <strong className="text-[#0d204d]">
                  Önümüzdeki 90 günde neyi değiştirmek istediğini düşün.
                </strong>{" "}
                Daha fazla danışan almak, daha fazla kişiye ulaşmak, gelirini
                artırmak veya işini daha düzenli hale getirmek olabilir. Senin
                için en önemli olan şeyi netleştir.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d204d] text-sm font-bold text-white">
                3
              </span>
              <span>
                <strong className="text-[#0d204d]">
                  Bildiğin rakamları yanında bulundur.
                </strong>{" "}
                Son birkaç ayda yaklaşık ne kadar ciro yaptığını, kaç kişinin
                sana ulaştığını, kaç görüşme yaptığını ve kaç satış yaptığını
                biliyorsan not al. Hepsini bilmek zorunda değilsin.
              </span>
            </li>
          </ul>
        </div>

        {/* 3. HANDE HATIRLATMASI — video zaten izlendi, sadece bağ kuruyoruz */}
        <div className="mt-10 rounded-2xl border border-[#e6e8ea] bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500">
            Az önce Hande Hoca&apos;nın sürecini izledin. Onun da başında aynı
            sorular vardı: &quot;Nereden başlamalıyım, zamanım olur mu, teknik
            kısımları kaldırabilir miyim?&quot; Görüşmede senin işine bakacağız;
            Fitsistem&apos;in hangi parçasından başlaman gerektiğini ve mükemmeli
            beklemeden nasıl ilerleyebileceğini birlikte netleştireceğiz.
          </p>
        </div>

        {/* 4. GÖRÜŞME ÖNCESİ EĞİTİM — sayfa boş kalmasın, görüşmeye hazırlıklı gelsin */}
        <OnGorusmeEgitimi location="vaka-hande" />

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
