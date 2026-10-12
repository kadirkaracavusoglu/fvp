import type { Metadata } from "next";
import { vakaMeta } from "@/lib/vaka-meta";

export const metadata: Metadata = vakaMeta({
  title: "Vaka analizi: Hande Hoca ile Fitsistem'i nasıl kurduk?",
  path: "/vaka-analizi/izle",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
