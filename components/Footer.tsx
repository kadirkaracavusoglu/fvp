import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const icerik = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Gündem", href: "/gundem" },
  { label: "Bülten", href: "/bulten" },
  { label: "Podcast", href: "/podcast" },
];

const kurumsal = [
  { label: "Danışmanlık", href: "/danismanlik" },
  { label: "Sponsorluk", href: "/sponsorluk" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "İletişim", href: "/iletisim" },
];

export function Footer() {
  return (
    <footer className="border-t border-navy-600 bg-navy-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        {/* Marka */}
        <div>
          <Image src="/fvp-logo.png" alt="Fitness ve Pazarlama" width={901} height={359} className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-gray-400">{SITE.belief}</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block text-sm text-gray-400 hover:text-cyan">
            {SITE.email}
          </a>
        </div>

        {/* İçerik */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">İçerik</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            {icerik.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-cyan">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kurumsal */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">Kurumsal</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            {kurumsal.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-cyan">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Katıl & Takip */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">Bize Katıl</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li><a href={SITE.cta.whatsapp} target="_blank" rel="noreferrer" className="hover:text-cyan">WhatsApp Topluluk</a></li>
            <li><a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="hover:text-cyan">Ücretsiz Görüşme</a></li>
          </ul>
          <div className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wider text-cyan">Takip Et</div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
            <li><a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="hover:text-cyan">Instagram</a></li>
            <li><a href={SITE.social.youtube} target="_blank" rel="noreferrer" className="hover:text-cyan">YouTube</a></li>
            <li><a href={SITE.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan">LinkedIn</a></li>
            <li><a href={SITE.social.spotify} target="_blank" rel="noreferrer" className="hover:text-cyan">Spotify</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-600 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Fitness ve Pazarlama · {SITE.belief}
      </div>
    </footer>
  );
}
