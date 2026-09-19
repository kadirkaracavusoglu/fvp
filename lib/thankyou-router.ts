// Ortak GHL takvimi için teşekkür sayfası yönlendiricisi (istemci tarafı).
//
// Neden: üç funnel (Fitsistem, Vaka-Hande, MACFit) şu an AYNI GHL takvimini
// kullanıyor ve takvimin randevu sonrası yönlendirmesi TEK adres:
// /vsl/tesekkurler → /fitsistem/tesekkurler. Vaka-Hande'den ya da salon
// sahiplerine yönelik MACFit'ten randevu alan kişi koçlara yazılmış Fitsistem
// teşekkür sayfasına düşüyor ve Fitsistem panelinde sayılıyordu.
//
// Çözüm: ziyaretçinin sitede EN SON gördüğü sayfa (captureAttribution her
// sayfada `page_url`'i günceller; randevu sayfaları da çağırıyor) hangi
// funnel'a aitse onun teşekkür sayfasına gönder. MACFit kendi takvimine
// geçince bu köprü onun için gereksizleşir ama zararsızdır.

const ATTR_KEY = "fvp_attribution";

// Sıra önemli: "/fitsistem-macfit-vaka" önce denetlenmeli.
const ROUTES: { prefix: string; target: string }[] = [
  { prefix: "/fitsistem-macfit-vaka", target: "/fitsistem-macfit-vaka/tesekkurler" },
  { prefix: "/vaka-hande", target: "/vaka-hande/tesekkurler" },
  { prefix: "/vaka-analizi", target: "/vaka-hande/tesekkurler" },
];

/** ÖNEMLİ: captureAttribution()'dan ÖNCE çağır — o, page_url'i bu sayfayla ezer. */
export function thankYouTargetFor(currentPath: string): string | null {
  let lastPath = "";
  try {
    const attr = JSON.parse(localStorage.getItem(ATTR_KEY) || "{}") as Record<string, string>;
    if (attr.page_url) lastPath = new URL(attr.page_url).pathname;
  } catch {
    return null;
  }
  const hit = ROUTES.find((r) => lastPath === r.prefix || lastPath.startsWith(`${r.prefix}/`));
  return hit && hit.target !== currentPath ? hit.target : null;
}

/** Sayfa takvim kutusunun (iframe) içinde mi açıldı? */
export function isInFrame(): boolean {
  try {
    return window.top !== window.self;
  } catch {
    return true; // farklı kökenli üst pencere → yine de çerçeve içindeyiz
  }
}
