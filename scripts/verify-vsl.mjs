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
  "questionBreakdown",
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

assertIncludes(
  "lib/tracking.ts",
  "captureAttribution();",
  "Server event öncesi attribution yakalama korunmalı",
);

console.log("VSL smoke checks passed.");
