// Video izleme süresi — oynatıcı olayı → dakika + seviye (GHL alanları için).
// Hem istemci (VslWatch) hem sunucu (/api/vsl-progress) aynı tabloyu kullanır.

// Oynatıcının attığı olay → izlenen en ileri dakika. vsl_100 = videoyu bitirdi
// (vaka videoları ~27 dk).
export const WATCH_MINUTES: Record<string, number> = {
  vsl_play: 0,
  vsl_min1: 1,
  vsl_min3: 3,
  vsl_min5: 5,
  vsl_min10: 10,
  vsl_min15: 15,
  vsl_min20: 20,
  vsl_100: 27,
};

// GHL "VSL Video İzleme Seviyesi" seçenekleriyle BİREBİR aynı metinler.
export function watchLevel(minutes: number): string {
  if (minutes >= 27) return "Tamamladı";
  if (minutes >= 20) return "20 dk ve üzeri";
  if (minutes >= 10) return "10-20 dk";
  if (minutes >= 5) return "5-10 dk";
  if (minutes >= 1) return "1-5 dk";
  return "Oynattı, 1 dk'dan az";
}
