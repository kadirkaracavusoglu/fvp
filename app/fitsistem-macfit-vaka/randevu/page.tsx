import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MACFIT } from "@/lib/macfit-funnel";
import { readMacfitAccess } from "@/lib/macfit-access";
import { MacfitRandevu } from "./MacfitRandevu";

// Randevu sayfası da formu doldurmuş kişiye açık (izle ile aynı kilit).
export default async function MacfitRandevuPage() {
  if (!readMacfitAccess((await cookies()).get(MACFIT.cookie)?.value)) redirect(MACFIT.path);
  return <MacfitRandevu />;
}
