import type { Metadata } from "next";
import { vakaMeta } from "@/lib/vaka-meta";

export const metadata: Metadata = vakaMeta({
  title: "Randevunuz hazır",
  path: "/vaka-analizi/tesekkurler",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
