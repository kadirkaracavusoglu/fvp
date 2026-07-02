import { redirect } from "next/navigation";

// Bulunamayan tüm sayfaları (kırık link, yanlış URL) ana sayfaya yönlendir
export default function NotFound() {
  redirect("/");
}
