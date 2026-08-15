"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function panelKeys() {
  return [process.env.FVP_PANEL_KEY, process.env.PANEL_KEY]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

export async function login(formData: FormData) {
  const key = String(formData.get("key") || "").trim();
  const keys = panelKeys();
  if (!keys.length || !keys.includes(key)) redirect("/vsl/panel?e=1");

  const jar = await cookies();
  jar.set("fvp_panel_auth", key, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  redirect("/vsl/panel");
}

export async function logout() {
  const jar = await cookies();
  jar.delete("fvp_panel_auth");
  redirect("/vsl/panel");
}
