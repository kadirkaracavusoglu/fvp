export const MACFIT = {
  path: "/fitsistem-macfit-vaka",
  formType: "macfit_optin",
  cookie: "fvp_macfit_access",
  // MACFit videosu hazır olduğunda bu alana YouTube video kimliği eklenecek.
  videoId: "",
  calendarUrl: "https://link.fitsistem.co/widget/booking/SSw6HZHR3j9veTWH8xTp",
} as const;

export const MACFIT_QUESTIONS = [
  { key: "activeMembers", label: "Salonunda yaklaşık kaç aktif üye var?", options: ["Henüz açılmadı", "100’den az", "100–300", "301–600", "601–1.000", "1.000 üzeri"] },
  { key: "capacity", label: "Salonun şu anda kaç yeni üye daha alabilecek kapasitede?", options: ["Şu anda doluyuz", "50’den az", "50–100", "101–200", "200’den fazla", "Emin değilim"] },
  { key: "advertising", label: "Salonun için aktif olarak reklam veriyor musun?", options: ["Evet", "Daha önce verdim, şu anda vermiyorum", "Hayır, hiç vermedim"] },
  { key: "problem", label: "Şu anda salonunda seni en çok zorlayan durum hangisi?", options: ["Yeni üye başvuruları yeterli değil.", "İnsanlar fiyat soruyor ama kayıt olmuyor.", "Reklam veriyorum ama istediğim sonucu alamıyorum.", "Üyeler süreleri bitince devam etmiyor.", "Salonla ilgili her şey bana kalıyor, büyümeye zaman ayıramıyorum.", "Başka bir sorun yaşıyorum."] },
  { key: "goal", label: "Önümüzdeki 3 ayda en çok neyi başarmak istiyorsun?", options: ["Daha fazla yeni üye kazanmak.", "Fiyat soran daha fazla kişiyi üyeliğe dönüştürmek.", "Mevcut üyelerin devam etmesini sağlamak.", "Sürekli indirim yapmadan üyelik satabilmek.", "İşlerin sadece bana bağlı olmadığı bir düzen kurmak.", "Başka bir hedefim var."] },
] as const;

export type MacfitAnswers = Record<(typeof MACFIT_QUESTIONS)[number]["key"], string> & { problemOther: string; goalOther: string };
export type MacfitContact = { firstName: string; lastName: string; email: string; phone: string; instagram: string };
export type MacfitSubmission = MacfitContact & { answers: MacfitAnswers };

export function normalizeMacfitPhone(raw: string): string | null {
  const compact = raw.trim().replace(/[\s().-]/g, "");
  if (/^\+905\d{9}$/.test(compact)) return compact;
  if (/^905\d{9}$/.test(compact)) return `+${compact}`;
  if (/^05\d{9}$/.test(compact)) return `+9${compact}`;
  if (/^5\d{9}$/.test(compact)) return `+90${compact}`;
  return null;
}

// Instagram kullanıcı adını tek yerde normalize et — istemci (1. adım) ve sunucu
// aynı kuralı kullansın. Aksi hâlde geçersiz ad 1. adımı geçer, hata ancak 2. adımda
// gönderince çıkar ve kullanıcı alanı göremediği için takılır.
export function normalizeMacfitInstagram(raw: string): string | null {
  const handle = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, ""); // instagram.com/salon/?hl=tr gibi linkleri de kabul et
  return /^[a-zA-Z0-9._]{1,30}$/.test(handle) ? handle : null;
}

export const MACFIT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMacfitSubmission(input: unknown): { data: MacfitSubmission; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Form bilgilerini kontrol et." };
  const body = input as Record<string, unknown>;
  const value = (v: unknown, max = 120) => typeof v === "string" && v.length <= max ? v.trim() : "";
  const firstName = value(body.firstName, 80), lastName = value(body.lastName, 80);
  const email = value(body.email, 254).toLowerCase();
  const phone = normalizeMacfitPhone(value(body.phone, 40));
  const instagram = normalizeMacfitInstagram(value(body.instagram, 150));
  if (!firstName || !lastName) return { error: "Adını ve soyadını gir." };
  if (!MACFIT_EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta adresi gir." };
  if (!phone) return { error: "Telefonunu 05XX XXX XX XX biçiminde gir." };
  if (!instagram) return { error: "Salonunun Instagram kullanıcı adını gir (ör. @salonadi)." };
  const raw = body.answers && typeof body.answers === "object" ? body.answers as Record<string, unknown> : {};
  const answers = {} as MacfitAnswers;
  for (const q of MACFIT_QUESTIONS) {
    const answer = value(raw[q.key], 200);
    if (!(q.options as readonly string[]).includes(answer)) return { error: `Lütfen yanıtla: ${q.label}` };
    answers[q.key] = answer;
  }
  answers.problemOther = answers.problem === "Başka bir sorun yaşıyorum." ? value(raw.problemOther, 500) : "";
  answers.goalOther = answers.goal === "Başka bir hedefim var." ? value(raw.goalOther, 500) : "";
  if (answers.problem === "Başka bir sorun yaşıyorum." && !answers.problemOther) return { error: "Yaşadığın sorunu kısaca yaz." };
  if (answers.goal === "Başka bir hedefim var." && !answers.goalOther) return { error: "Hedefini kısaca yaz." };
  return { data: { firstName, lastName, email, phone, instagram: `@${instagram}`, answers } };
}
