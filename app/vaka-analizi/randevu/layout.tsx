import type { Metadata } from "next";
import { vakaMeta } from "@/lib/vaka-meta";

export const metadata: Metadata = vakaMeta({
  title: "Görüşme saatinizi seçin",
  path: "/vaka-analizi/randevu",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
