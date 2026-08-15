import {
  PANEL_RANGES,
  type FunnelStep,
  type VslPanelData,
} from "@/lib/vsl-panel";

function fmtDate(value: string) {
  return new Date(value).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  });
}

function pct(value: number | null) {
  return value == null ? "—" : `%${value.toLocaleString("tr-TR")}`;
}

function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[#e6e8ea] bg-white p-4 shadow-[0_10px_30px_rgba(13,32,77,0.04)]">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-3xl font-black tabular-nums text-[#0d204d]">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function FunnelCard({ title, steps }: { title: string; steps: FunnelStep[] }) {
  const top = steps[0]?.count || 0;
  const empty = steps.every((s) => s.count === 0);
  return (
    <section className="rounded-xl border border-[#e6e8ea] bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d204d]">
        {title}
      </h2>
      {empty ? (
        <p className="mt-5 rounded-lg bg-[#f4f6f9] px-4 py-6 text-center text-sm text-gray-400">
          Bu aralıkta veri yok.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {steps.map((step, i) => {
            const width = top
              ? Math.max(2, Math.round((step.count / top) * 100))
              : 0;
            return (
              <div key={step.key}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-[#0d204d]">
                    {step.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-gray-400">
                    <strong className="text-[#0d204d]">{step.count}</strong>
                    {i > 0 && (
                      <span className="ml-2 font-semibold text-[#0d204d]">
                        {pct(step.pct)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f4f6f9]">
                  <div
                    className="h-full rounded-full bg-[#0d204d]"
                    style={{ width: `${step.count ? width : 0}%` }}
                  />
                </div>
                {i > 0 && step.pctPrev != null && step.pctPrev !== step.pct && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    önceki adımın {pct(step.pctPrev)}&apos;i
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function PanelView({
  data,
  logout,
}: {
  data: VslPanelData;
  logout: () => void;
}) {
  const active = data.range;
  return (
    <div className="min-h-screen bg-[#f4f6f9] px-5 py-8 text-[#0d204d]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d204d]">
              Komuta Merkezi
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Fitness ve Pazarlama · {data.startDate} → {data.endDate} · son
              güncelleme {fmtDate(data.generatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PANEL_RANGES.map((r) => (
              <a
                key={r.key}
                href={`/vsl/panel?range=${r.key}`}
                className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                  active === r.key
                    ? "border-[#0d204d] bg-[#0d204d] text-white"
                    : "border-[#e6e8ea] bg-white text-gray-400 hover:text-[#0d204d]"
                }`}
              >
                {r.label}
              </a>
            ))}
            <form action={logout}>
              <button className="rounded-full border border-[#e6e8ea] bg-white px-3 py-2 text-xs font-semibold text-gray-400 hover:text-[#0d204d]">
                Çıkış
              </button>
            </form>
          </div>
        </header>

        {!data.ok ? (
          <div className="rounded-xl border border-[#e6e8ea] bg-white p-8 text-center">
            <p className="font-semibold">Veri okunamadı</p>
            <p className="mt-1 text-sm text-gray-400">{data.error}</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-400">
              Ana KPI&apos;lar FvP başvuru sistemindeki gerçek karar adımlarını
              gösterir.
            </p>
            <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Kpi
                label="Ziyaret"
                value={String(data.kpi.visits)}
                sub="sayfayı gördü"
              />
              <Kpi
                label="Opt-in"
                value={String(data.kpi.optins)}
                sub={`ziyaret → opt-in ${pct(data.kpi.optinRate)}`}
              />
              <Kpi
                label="Başvuru"
                value={String(data.kpi.applications)}
                sub={`opt-in → başvuru ${pct(data.kpi.applicationRate)}`}
              />
              <Kpi
                label="Nitelikli"
                value={String(data.kpi.qualifiedApplications)}
                sub="orta + yüksek öncelik"
              />
              <Kpi
                label="Sıcak"
                value={String(data.kpi.hotApplications)}
                sub="yüksek öncelik"
              />
              <Kpi
                label="Randevu"
                value={String(data.kpi.booked)}
                sub={`başvuru → randevu ${pct(data.kpi.bookedRate)}`}
              />
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <Kpi
                label="Video kilidi"
                value={String(data.kpi.popupOpens)}
                sub="CTA ile açmak istedi"
              />
              <Kpi
                label="Video play"
                value={String(data.kpi.plays)}
                sub={`opt-in → play ${pct(data.kpi.playRate)}`}
              />
              <Kpi
                label="5 dk izleme"
                value={String(data.kpi.watch5m)}
                sub={`play → 5 dk ${pct(data.kpi.watch5Rate)}`}
              />
              <Kpi
                label="Takvim"
                value={`${data.kpi.calendarLoaded}/${data.kpi.calendarViews}`}
                sub={`yükleme / görüntüleme ${pct(data.kpi.calendarLoadRate)}`}
              />
              <Kpi
                label="UTM yakalama"
                value={String(data.kpi.utmCaptured)}
                sub={`lead UTM ${pct(data.kpi.utmRate)}`}
              />
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <FunnelCard title="Ana Huni" steps={data.funnel} />
              <FunnelCard title="Başvuru Formu" steps={data.form} />
              <FunnelCard title="Video Derinliği" steps={data.video} />
            </div>

            <section className="mt-4 rounded-xl border border-[#e6e8ea] bg-white p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide">
                Kanal Kırılımı
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="pb-2">Kanal</th>
                      <th className="pb-2 text-right">Ziyaret</th>
                      <th className="pb-2 text-right">Opt-in</th>
                      <th className="pb-2 text-right">Başvuru</th>
                      <th className="pb-2 text-right">Takvim</th>
                      <th className="pb-2 text-right">Randevu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channels.map((ch) => (
                      <tr key={ch.key} className="border-t border-[#e6e8ea]">
                        <td className="py-3 font-semibold">{ch.label}</td>
                        <td className="py-3 text-right tabular-nums">
                          {ch.visits}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {ch.optins}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {ch.applications}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {ch.calendarViews}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {ch.booked}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
