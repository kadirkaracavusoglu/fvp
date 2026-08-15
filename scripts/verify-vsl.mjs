import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

const root = cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assertIncludes(file, needle, label) {
  const source = read(file);
  if (!source.includes(needle)) {
    throw new Error(`${label}: ${file} içinde bulunamadı: ${needle}`);
  }
}

function assertNotIncludes(file, needle, label) {
  const source = read(file);
  if (source.includes(needle)) {
    throw new Error(`${label}: ${file} içinde olmamalı: ${needle}`);
  }
}

const calendarId = "SSw6HZHR3j9veTWH8xTp";

assertIncludes(
  "lib/funnel.ts",
  `https://link.fitsistem.co/widget/booking/${calendarId}`,
  "GHL takvim URL'i singular widget/booking olmalı",
);
assertNotIncludes(
  "lib/funnel.ts",
  "widget/bookings/",
  "Eski çoğul GHL takvim URL'i geri gelmemeli",
);

for (const field of [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
]) {
  assertIncludes(
    "app/vsl/randevu/page.tsx",
    field,
    `Randevu iframe'i ${field} taşımalı`,
  );
}

assertIncludes(
  "app/vsl/randevu/page.tsx",
  'href="/vsl/tesekkurler"',
  "Randevu sonrası teşekkür sayfasına geçiş olmalı",
);
assertIncludes(
  "app/vsl/randevu/page.tsx",
  "Takvimi yeni sekmede aç",
  "Randevu sayfasında GHL domain fallback CTA'sı görünmeli",
);
assertIncludes(
  "app/vsl/randevu/page.tsx",
  'scrolling="yes"',
  "Randevu iframe'i saat seçimi sonrası scroll kilitlememeli",
);
assertIncludes(
  "app/vsl/randevu/page.tsx",
  'overflow: "auto"',
  "Randevu iframe'i iç form taşınca scroll edilebilir olmalı",
);
for (const permission of [
  "private-state-token-issuance",
  "private-state-token-redemption",
]) {
  assertIncludes(
    "app/vsl/randevu/page.tsx",
    permission,
    `Randevu iframe'i Turnstile ${permission} iznini taşımalı`,
  );
}

assertIncludes(
  "app/vsl/tesekkurler/page.tsx",
  "https://www.youtube.com/watch?v=L_2y4a_k5hY&t=24s",
  "Teşekkür sayfası görüşme öncesi YouTube videosunu taşımalı",
);
assertIncludes(
  "app/vsl/tesekkurler/page.tsx",
  "vsl_thankyou_view",
  "Teşekkür sayfası görüntülenme event'i göndermeli",
);
assertIncludes(
  "app/vsl/tesekkurler/page.tsx",
  "vsl_thankyou_video_click",
  "Teşekkür sayfası video tıklama event'i göndermeli",
);

for (const field of [
  "attributionSource",
  "utmSource",
  "utmContent",
  "utm_source",
  "utm_content",
  "landingUrl",
  "firstLandingUrl",
]) {
  assertIncludes("lib/ghl.ts", field, `GHL payload ${field} alanını taşımalı`);
}

for (const field of [
  'name="firstName"',
  'name="lastName"',
  'name="email"',
  'name="phone"',
  'name="instagram"',
  'name="businessName"',
  'name="websiteUrl"',
]) {
  assertIncludes(
    "app/vsl/basvuru/page.tsx",
    field,
    `Başvuru formu ${field} alanını taşımalı`,
  );
}

for (const field of ['name="firstName"', 'name="lastName"', 'name="email"']) {
  assertIncludes(
    "components/lp/VslFunnel.tsx",
    field,
    `Opt-in formu ${field} alanını taşımalı`,
  );
}
assertIncludes(
  "components/lp/VslFunnel.tsx",
  "h-12 w-12",
  "Opt-in video play butonu yüzü kapatmayacak kadar küçük olmalı",
);
assertIncludes(
  "components/lp/VslFunnel.tsx",
  "translate-y-7",
  "Opt-in video play butonu çene hizasının hafif altında durmalı",
);
assertIncludes(
  "components/lp/VslFunnel.tsx",
  "items-center justify-center",
  "Opt-in video play butonu kompozisyonda ortalı olmalı",
);
assertNotIncludes(
  "components/lp/VslFunnel.tsx",
  "inset-1.5 rounded-full border",
  "Opt-in video play butonunda ikinci iç halka olmamalı",
);
assertNotIncludes(
  "components/lp/VslFunnel.tsx",
  "h-24 w-24",
  "Opt-in video play butonu eski büyük boyuta dönmemeli",
);

for (const event of [
  "vsl_min1",
  "vsl_min3",
  "vsl_min5",
  "vsl_min10",
  "vsl_calendar_loaded",
  "vsl_thankyou_video_click",
]) {
  assertIncludes(
    "lib/vsl-panel.ts",
    event,
    `Panel ${event} KPI sinyalini okumalı`,
  );
}

for (const field of [
  "qualifiedApplications",
  "hotApplications",
  "utmCaptured",
]) {
  assertIncludes(
    "lib/vsl-panel.ts",
    field,
    `Panel ${field} sözleşmesini korumalı`,
  );
  assertIncludes(
    "app/vsl/panel/PanelView.tsx",
    field,
    `Panel UI ${field} alanını göstermeli`,
  );
}

for (const text of [
  "Komuta Merkezi",
  "Ana KPI",
  "Ana Huni",
  "Kanal Kırılımı",
]) {
  assertIncludes(
    "app/vsl/panel/PanelView.tsx",
    text,
    `Panel UI ${text} alanını göstermeli`,
  );
}

for (const text of [
  "FvP VSL Panel",
  "Başvuru Cevap Kırılımı",
  "Son Başvurular",
  "Takip Sağlığı",
]) {
  assertNotIncludes(
    "app/vsl/panel/PanelView.tsx",
    text,
    `Panel UI ${text} bölümünü göstermemeli`,
  );
}

assertNotIncludes(
  "app/vsl/panel/page.tsx",
  "VSL Panel",
  "Panel giriş ekranı genel panel adı kullanmalı",
);

for (const file of ["app/vsl/panel/page.tsx", "app/vsl/panel/actions.ts"]) {
  assertIncludes(
    file,
    "process.env.FVP_PANEL_KEY, process.env.PANEL_KEY",
    `${file} FVP_PANEL_KEY ve PANEL_KEY anahtarlarını beraber kabul etmeli`,
  );
  assertIncludes(
    file,
    ".trim()",
    `${file} panel anahtarını boşluklara karşı normalize etmeli`,
  );
}

assertIncludes(
  "lib/tracking.ts",
  "captureAttribution();",
  "Server event öncesi attribution yakalama korunmalı",
);

console.log("VSL smoke checks passed.");
