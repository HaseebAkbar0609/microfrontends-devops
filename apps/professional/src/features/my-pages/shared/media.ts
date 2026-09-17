import { BASE_API_VERSION } from "@/constants/api";
import { safeExternalUrl } from "@/lib/safeUrl";

export function resolveMyPagesMediaUrl(value: string): string {
  const safe = safeExternalUrl(value);
  if (!safe) throw new Error("MY_PAGES_INVALID_MEDIA_URL");
  // Local storage returns an API-relative signed URL; frontend and API can be
  // deployed on different origins, including local development.
  return safe.startsWith("/") && /^https?:\/\//.test(BASE_API_VERSION)
    ? new URL(safe, BASE_API_VERSION).href : safe;
}
