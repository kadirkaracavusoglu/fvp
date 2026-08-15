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

function short(value: string, max = 90) {
  if (!value) return "—";
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
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
    <div className="rounded-xl border border-[#e6e8ea] bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold tabular-nums text-[#0d204d]">
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
            <h1 className="text-2xl font-bold">FvP VSL Panel</h1>
            <p className="mt-1 text-sm text-gray-400">
              {data.startDate} → {data.endDate} · son güncelleme{" "}
              {fmtDate(data.generatedAt)}
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
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi
                label="VSL ziyaret"
                value={String(data.kpi.visits)}
                sub="vsl_optin_view"
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
                label="Randevu"
                value={String(data.kpi.booked)}
                sub={`başvuru → randevu ${pct(data.kpi.bookedRate)}`}
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi
                label="Qualified"
                value={String(data.kpi.qualifiedApplications)}
                sub="orta + yüksek öncelik"
              />
              <Kpi
                label="Hot"
                value={String(data.kpi.hotApplications)}
                sub="yüksek öncelik"
              />
              <Kpi
                label="Video play"
                value={String(data.kpi.plays)}
                sub={`opt-in → play ${pct(data.kpi.playRate)}`}
              />
              <Kpi
                label="UTM yakalanan"
                value={String(data.kpi.utmCaptured)}
                sub={`lead UTM ${pct(data.kpi.utmRate)}`}
              />
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi label="Popup açan" value={String(data.kpi.popupOpens)} />
              <Kpi
                label="5 dk izleyen"
                value={String(data.kpi.watch5m)}
                sub={`play → 5 dk ${pct(data.kpi.watch5Rate)}`}
              />
              <Kpi
                label="Takvim yükleme"
                value={`${data.kpi.calendarLoaded}/${data.kpi.calendarViews}`}
                sub={`load oranı ${pct(data.kpi.calendarLoadRate)}`}
              />
              <Kpi
                label="Teşekkür video"
                value={`${data.kpi.thankyouVideoClicks}/${data.kpi.thankyouViews}`}
                sub="YouTube tıklama / görüntüleme"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <FunnelCard title="VSL Huni" steps={data.funnel} />
              <FunnelCard title="Başvuru Formu" steps={data.form} />
              <FunnelCard title="Video Derinliği" steps={data.video} />

              <section className="rounded-xl border border-[#e6e8ea] bg-white p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Takip Sağlığı
                </h2>
                <div className="mt-4 space-y-2">
                  {data.trackingHealth.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 rounded-lg bg-[#f4f6f9] px-3 py-2 text-sm"
                    >
                      <span>{item.label}</span>
                      <span
                        className={
                          item.state === "ok"
                            ? "font-semibold text-[#157347]"
                            : "font-semibold text-[#b45309]"
                        }
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
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

            <section className="mt-4 rounded-xl border border-[#e6e8ea] bg-white p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide">
                Başvuru Cevap Kırılımı
              </h2>
              {data.questionBreakdown.length ? (
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {data.questionBreakdown.map((row) => (
                    <div key={row.key} className="rounded-lg bg-[#f4f6f9] p-4">
                      <div className="text-sm font-semibold text-[#0d204d]">
                        {row.label}
                      </div>
                      <div className="mt-3 space-y-2">
                        {row.answers.map((answer) => (
                          <div
                            key={answer.label}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <span className="text-gray-400">
                              {answer.label}
                            </span>
                            <span className="font-semibold tabular-nums text-[#0d204d]">
                              {answer.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-[#f4f6f9] px-4 py-6 text-center text-sm text-gray-400">
                  Henüz cevap kırılımı yok.
                </p>
              )}
            </section>

            <section className="mt-4 rounded-xl border border-[#e6e8ea] bg-white p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide">
                Son Başvurular
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[1280px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="pb-2">Kişi</th>
                      <th className="pb-2">Skor</th>
                      <th className="pb-2">Segment</th>
                      <th className="pb-2">E-posta</th>
                      <th className="pb-2">Telefon</th>
                      <th className="pb-2">Instagram</th>
                      <th className="pb-2">Hedef</th>
                      <th className="pb-2">Darboğaz</th>
                      <th className="pb-2">UTM</th>
                      <th className="pb-2">Tip</th>
                      <th className="pb-2">Kanal</th>
                      <th className="pb-2">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLeads.length ? (
                      data.recentLeads.map((lead) => (
                        <tr
                          key={`${lead.email}-${lead.createdAt}`}
                          className="border-t border-[#e6e8ea]"
                        >
                          <td className="py-3 font-semibold">{lead.name}</td>
                          <td className="py-3 tabular-nums">
                            {lead.score ?? "—"}
                          </td>
                          <td className="py-3">{lead.segment || "—"}</td>
                          <td className="py-3">{lead.email || "—"}</td>
                          <td className="py-3">{lead.phone || "—"}</td>
                          <td className="py-3">{lead.instagram || "—"}</td>
                          <td className="py-3">{short(lead.goal)}</td>
                          <td className="py-3">{short(lead.bottlenecks)}</td>
                          <td className="py-3">
                            {short(
                              [
                                lead.utmSource,
                                lead.utmCampaign,
                                lead.utmContent,
                              ]
                                .filter(Boolean)
                                .join(" / "),
                              70,
                            )}
                          </td>
                          <td className="py-3">{lead.formType}</td>
                          <td className="py-3">{lead.channel}</td>
                          <td className="py-3">{fmtDate(lead.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="py-6 text-center text-gray-400"
                          colSpan={12}
                        >
                          Bu aralıkta başvuru yok.
                        </td>
                      </tr>
                    )}
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
