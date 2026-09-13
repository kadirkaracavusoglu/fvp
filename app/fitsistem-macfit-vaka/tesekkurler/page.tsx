import Link from "next/link";
import { MACFIT } from "@/lib/macfit-funnel";
export default function MacfitThankYou() {
  return <div className="glow-bg flex min-h-screen items-center justify-center px-5 py-16"><div className="max-w-2xl text-center"><span className="chip inline-block px-4 py-1 text-xs" data-active="true">FİTSİSTEM</span><h1 className="mt-6 text-3xl font-bold sm:text-5xl">Görüşmede buluşalım.</h1><p className="mt-5 text-lg text-gray-400">Randevu detaylarını takvimden gelen onay mesajından kontrol edebilirsin. Görüşmede salonunun ihtiyaçlarını ve hedeflerini birlikte değerlendireceğiz.</p><Link href={`${MACFIT.path}/izle`} className="btn-primary mt-8 inline-block px-8 py-4">Video Sayfasına Dön →</Link></div></div>;
}
