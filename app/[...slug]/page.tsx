import { redirect } from "next/navigation";

// Eşleşmeyen tüm yollar (kırık link, yanlış URL) → ana sayfa
export default function CatchAll() {
  redirect("/");
}
