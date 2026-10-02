import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getDynamicModuleItems } from "@/lib/modules";
import { SITE_URL } from "@/lib/site";

// Built once at `next build`, when src/pages is on disk: any page added there
// shows up in the sitemap on the next deploy without touching this file.
export const dynamic = "force-static";

const PAGES_DIR = path.join(process.cwd(), "src", "pages");
const PAGE_FILE = /\.(tsx|ts|jsx|js)$/;

// Routes that exist but should not be listed for search engines.
const EXCLUDED_ROUTES = new Set(["/login", "/register"]);
// Non-page files and folders under src/pages.
const IGNORED_SEGMENTS = new Set(["api", "_app", "_document", "_error", "404", "500"]);

function collectStaticRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name.replace(PAGE_FILE, "");
    // Dynamic segments ([slug]) are expanded from their data source below.
    if (IGNORED_SEGMENTS.has(name) || name.startsWith("[")) continue;
    if (entry.isDirectory()) {
      routes.push(...collectStaticRoutes(path.join(dir, entry.name), `${base}/${name}`));
    } else if (PAGE_FILE.test(entry.name)) {
      routes.push(name === "index" ? base || "/" : `${base}/${name}`);
    }
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = collectStaticRoutes(PAGES_DIR);
  // /professional/[slug] module pages. Items with their own href link to a
  // dedicated page that is already picked up above; /modules/[slug] is an alias
  // of the same content and is left out to avoid duplicate URLs.
  const moduleRoutes = getDynamicModuleItems()
    .filter((item) => !item.href)
    .map((item) => `/professional/${item.slug}`);

  const lastModified = new Date();
  return [...new Set([...staticRoutes, ...moduleRoutes])]
    .filter((route) => !EXCLUDED_ROUTES.has(route))
    .sort()
    .map((route) => ({
      url: `${SITE_URL}${route === "/" ? "" : route}`,
      lastModified,
      changeFrequency: "weekly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
