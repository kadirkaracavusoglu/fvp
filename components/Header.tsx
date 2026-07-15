"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${
        scrolled ? "border-b border-line shadow-[0_4px_20px_-12px_rgba(var(--navy-rgb),0.25)]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Fitness ve Pazarlama — Ana Sayfa">
          <Image
            src="/fvp-logo.png"
            alt="Fitness ve Pazarlama"
            width={901}
            height={359}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-navy" : "text-[#5b6472] hover:text-navy"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-navy" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobil buton */}
        <div className="flex items-center gap-2">
          <Link href="/ara" aria-label="Ara" className="rounded-full p-2 text-[#5b6472] transition-colors hover:text-navy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/bulten" className="btn-primary hidden px-5 py-2 text-sm sm:inline-block">
            Ücretsiz Kayıt Ol
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-2xl leading-none text-navy lg:hidden"
            aria-label="Menü"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-line bg-white px-5 py-3 lg:hidden">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  active ? "bg-[#f4f6f9] text-navy" : "text-[#5b6472] hover:bg-[#f4f6f9]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/bulten"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 px-4 py-2.5 text-center text-sm"
          >
            Ücretsiz Kayıt Ol
          </Link>
        </nav>
      )}
    </header>
  );
}
