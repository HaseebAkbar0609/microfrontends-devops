// Canonical public origin of the marketing site. Override per environment with
// NEXT_PUBLIC_SITE_URL; sitemap and robots URLs are built from it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://timeflowsystem.se").replace(/\/+$/, "");

export const SITE_HOST = new URL(SITE_URL).host;
