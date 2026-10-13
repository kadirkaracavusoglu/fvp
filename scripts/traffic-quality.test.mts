// Çalıştır: node --experimental-strip-types scripts/traffic-quality.test.mts
import assert from "node:assert/strict";
import { dropReviewTraffic, hasDoubleEncodedUtmContent } from "../lib/traffic-quality.ts";

const url = (c: string, extra = "") =>
  `https://kadirkaracavusoglu.com/vaka-analizi?utm_source=ig&utm_medium=paid_social&utm_content=${c}${extra}`;
const a = (page_url?: string, utm_content?: string) => ({ page_url, utm_content });

// Çift kodlu değer → inceleme trafiği
assert.equal(hasDoubleEncodedUtmContent(a(url("Hook%2B3%2B-%2Bdo%25C4%259Fru"))), true);
assert.equal(hasDoubleEncodedUtmContent(a(url("Hook%2B-%2BZ2"))), true);
// Gerçek (tek kodlu) değer
assert.equal(hasDoubleEncodedUtmContent(a(url("Hook+1+-+payla%C5%9F%C4%B1m"))), false);
assert.equal(hasDoubleEncodedUtmContent(a(url("Hook+-+N1"))), false);
// Başka parametredeki %25 kuralı TETİKLEMEZ
assert.equal(hasDoubleEncodedUtmContent(a(url("Hook+-+N1", "&fbclid=ab%25cd"))), false);
// page_url yokken saklanan değere bakılır
assert.equal(hasDoubleEncodedUtmContent(a(undefined, "Hook+-+Z2")), true);
assert.equal(hasDoubleEncodedUtmContent(a(undefined, "Hook - N1")), false);
assert.equal(hasDoubleEncodedUtmContent(null), false);

// Oturumda eylem varsa ziyaret KALIR; yalnız görüntüleme ise ayıklanır
const bad = a(url("Hook%2B-%2BZ2"));
const rows = [
  { name: "vsl_optin_view", session_id: "bot1", attribution: bad },
  { name: "vsl_optin_view", session_id: "real", attribution: bad },
  { name: "vsl_optin_cta_click", session_id: "real", attribution: bad },
  { name: "vsl_optin_view", session_id: "ok", attribution: a(url("Hook+-+N1")) },
];
const r = dropReviewTraffic(rows);
assert.equal(r.removed, 1);
assert.deepEqual(r.rows.map((x) => x.session_id).sort(), ["ok", "real", "real"]);
console.log("traffic-quality: tüm testler geçti");
