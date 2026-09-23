import { redirect } from "next/navigation";

// 23 Eyl 2026: B varyantında opt-in kapısı kaldırıldı, video ana sayfada oynuyor.
// Eski bağlantıyla gelen ana sayfaya gönderilir.
export default function VakaAnaliziIzlePage() {
  redirect("/vaka-analizi");
}
