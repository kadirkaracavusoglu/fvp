import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MACFIT } from "@/lib/macfit-funnel";
import { readMacfitAccess } from "@/lib/macfit-access";
import { MacfitOptin } from "./MacfitOptin";
export default async function MacfitPage() {
  if (readMacfitAccess((await cookies()).get(MACFIT.cookie)?.value)) redirect(`${MACFIT.path}/izle`);
  return <MacfitOptin />;
}
