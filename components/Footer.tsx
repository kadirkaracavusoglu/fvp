import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const icerik = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Bülten", href: "/bulten" },
  { label: "Rehberler", href: "/rehber" },
  { label: "Podcast", href: "/podcast" },
];

const kurumsal = [
  { label: "Manifesto", href: "/manifesto" },
  { label: "Sponsorluk", href: "/sponsorluk" },
  { label: "İletişim", href: "/iletisim" },
];

const socials = [
  {
    label: "Instagram",
    href: SITE.social.instagram,
    icon: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z",
  },
  {
    label: "YouTube",
    href: SITE.social.youtube,
    icon: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  {
    label: "LinkedIn",
    href: SITE.social.linkedin,
    icon: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
  },
  {
    label: "Spotify",
    href: SITE.social.spotify,
    icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.22.36-.68.47-1.03.25-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 11-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.36.22.47.68.25 1.03zm1.47-3.27a.94.94 0 01-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 11-.54-1.8c4.37-1.32 9.79-.68 13.5 1.6.44.27.58.85.3 1.29zm.13-3.4C15.72 8.28 8.44 8.05 4.6 9.22a1.12 1.12 0 11-.65-2.15c4.41-1.34 12.45-1.08 16.6 1.38a1.12 1.12 0 11-1.15 1.92z",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-navy-600 bg-navy-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        {/* Marka */}
        <div>
          <Image src={SITE.logo.default} alt={SITE.name} width={901} height={359} className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-gray-400">{SITE.belief}</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block text-sm text-gray-400 hover:text-cyan">
            {SITE.email}
          </a>
          {/* Sosyal medya ikonları */}
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-600 text-gray-400 transition-colors hover:border-cyan hover:text-cyan"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* İçerik */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">İçerik</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            {icerik.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-cyan">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Kurumsal */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">Kurumsal</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            {kurumsal.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-cyan">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Katıl */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan">Bize Katıl</div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li><a href={SITE.cta.whatsapp} target="_blank" rel="noreferrer" className="hover:text-cyan">WhatsApp Topluluk</a></li>
            <li><a href={SITE.cta.gorusme} target="_blank" rel="noreferrer" className="hover:text-cyan">Ücretsiz Görüşme</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-600 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <Link href="/gizlilik" className="hover:text-cyan">Gizlilik</Link>
            <Link href="/kvkk" className="hover:text-cyan">KVKK</Link>
            <Link href="/cerez" className="hover:text-cyan">Çerez Politikası</Link>
            <Link href="/kosullar" className="hover:text-cyan">Kullanım Koşulları</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
