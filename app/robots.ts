import type { MetadataRoute } from "next";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
      // AI asistanları / arama botları — açıkça hoş geldin (kaynak gösterebilsinler)
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/", disallow: ["/studio", "/api"] })),
    ],
    sitemap: "https://fitnessvepazarlama.com/sitemap.xml",
  };
}
