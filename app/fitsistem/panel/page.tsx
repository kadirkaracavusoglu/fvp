import { cookies } from "next/headers";
import {
  getVslPanelData,
  PANEL_RANGES,
  PANEL_FUNNELS,
  type PanelRange,
  type FunnelKey,
} from "@/lib/vsl-panel";
import { login, logout } from "./actions";
import { PanelView } from "./PanelView";

export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function panelKeys() {
  return [process.env.FVP_PANEL_KEY, process.env.PANEL_KEY]
    .map((key) => key?.trim())
    .filter((key): key is string => Boolean(key));
}

function authed(cookieVal?: string): boolean {
  return cookieVal ? panelKeys().includes(cookieVal) : false;
}

function isRange(value?: string): value is PanelRange {
  return PANEL_RANGES.some((r) => r.key === value);
}

function isFunnel(value?: string): value is FunnelKey {
  return PANEL_FUNNELS.some((f) => f.key === value);
}

export default async function VslPanelPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
    funnel?: string;
    from?: string;
    to?: string;
    e?: string;
  }>;
}) {
  const sp = await searchParams;
  const jar = await cookies();
  const isAuthed = authed(jar.get("fvp_panel_auth")?.value);

  if (!isAuthed) {
    const keyMissing = !panelKeys().length;
    return (
      <div className="glow-bg flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-[#0d204d]">Panel</h1>
          <p className="mt-2 text-sm text-gray-400">
            Bu alan yalnızca yöneticiye özeldir.
          </p>
          <form action={login} className="mt-6 space-y-3">
            <input
              name="key"
              type="password"
              autoFocus
              placeholder="Erişim anahtarı"
              className="w-full rounded-lg border border-[#e6e8ea] px-4 py-3 text-[#0d204d] outline-none focus:border-[#0d204d]"
            />
            {sp.e && (
              <p className="text-sm font-semibold text-red-600">
                Anahtar hatalı veya tanımlı değil.
              </p>
            )}
            {keyMissing && (
              <p className="text-xs text-gray-400">
                Prod için `FVP_PANEL_KEY` veya `PANEL_KEY` env tanımlanmalı.
              </p>
            )}
            <button className="btn-primary w-full px-6 py-3 text-sm">
              Giriş
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isDate = (v?: string) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const useCustom = sp.range === "custom" && isDate(sp.from) && isDate(sp.to);
  const range: PanelRange = useCustom
    ? "custom"
    : isRange(sp.range)
      ? sp.range
      : "week";
  const funnel = isFunnel(sp.funnel) ? sp.funnel : "fitsistem";
  const data = await getVslPanelData(
    range,
    funnel,
    useCustom ? { from: sp.from, to: sp.to } : undefined,
  );

  return (
    <PanelView
      data={data}
      logout={logout}
      funnel={funnel}
      customFrom={sp.from ?? ""}
      customTo={sp.to ?? ""}
    />
  );
}
