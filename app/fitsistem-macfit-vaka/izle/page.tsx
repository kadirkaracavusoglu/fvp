import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MACFIT } from "@/lib/macfit-funnel";
import { readMacfitAccess } from "@/lib/macfit-access";
import { MacfitWatch } from "./MacfitWatch";
export default async function MacfitWatchPage() {
  if (!readMacfitAccess((await cookies()).get(MACFIT.cookie)?.value)) redirect(MACFIT.path);
  return <MacfitWatch />;
}
