"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function panelKey() {
  return process.env.FVP_PANEL_KEY || process.env.PANEL_KEY || "";
}

export async function login(formData: FormData) {
  const key = String(formData.get("key") || "");
  const expected = panelKey();
  if (!expected || key !== expected) redirect("/vsl/panel?e=1");

  const jar = await cookies();
  jar.set("fvp_panel_auth", expected, {
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
