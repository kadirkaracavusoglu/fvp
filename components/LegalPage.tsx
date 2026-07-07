import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold leading-tight text-[#0d204d] sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-gray-400">Son güncelleme: {updated}</p>
      {intro && <p className="mt-6 text-lg leading-relaxed text-[#33405c]">{intro}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-10 text-xl font-bold text-[#0d204d]">{children}</h2>
);

export const P = ({ children }: { children: ReactNode }) => (
  <p className="mt-3 leading-relaxed text-[#33405c]">{children}</p>
);

export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-[#33405c]">{children}</ul>
);

export const Note = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-xl border border-[#e6e8ea] bg-[#f4f6f9] p-5 text-sm leading-relaxed text-[#5b6472]">
    {children}
  </div>
);
