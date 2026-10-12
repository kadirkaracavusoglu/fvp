import type { Metadata } from "next";
import { vakaMeta } from "@/lib/vaka-meta";

export const metadata: Metadata = vakaMeta({
  title: "Başvuru formu",
  path: "/vaka-analizi/basvuru",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
