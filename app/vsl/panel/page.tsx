import { cookies } from "next/headers";
import {
  getVslPanelData,
  PANEL_RANGES,
  type PanelRange,
} from "@/lib/vsl-panel";
import { login, logout } from "./actions";
import { PanelView } from "./PanelView";

export const metadata = {
  title: "VSL Panel",
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
  return Boolean(cookieVal) && panelKeys().includes(cookieVal);
}

function isRange(value?: string): value is PanelRange {
  return PANEL_RANGES.some((r) => r.key === value);
}

export default async function VslPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; e?: string }>;
}) {
  const sp = await searchParams;
  const jar = await cookies();
  const isAuthed = authed(jar.get("fvp_panel_auth")?.value);

  if (!isAuthed) {
    const keyMissing = !panelKeys().length;
    return (
      <div className="glow-bg flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-[#0d204d]">VSL Panel</h1>
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

  const range = isRange(sp.range) ? sp.range : "week";
  const data = await getVslPanelData(range);

  return <PanelView data={data} logout={logout} />;
}
