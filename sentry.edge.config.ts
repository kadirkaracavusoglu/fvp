import * as Sentry from "@sentry/nextjs";

// Sentry — DSN yoksa hiç açılmaz.
// Sabit DSN YAZMA: site başka marka için klonlanırsa hatalar yanlış hesaba düşer.

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
Sentry.init({
  dsn: DSN,
  tracesSampleRate: 0.1,
  enabled: Boolean(DSN) && process.env.NODE_ENV === "production",
});
