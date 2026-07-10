export interface ActiveProjectCompanySource {
  companyName?: string | null;
  company?: {
    name?: string | null;
  } | null;
  primaryContact?: {
    name?: string | null;
    companyName?: string | null;
  } | null;
}

const FALLBACK_COMPANY_NAMES = [
  "Bygg & Co AB",
  "Nordic Renovation AB",
  "Sundsvall Bygg AB",
  "Fasad & Tak AB",
] as const;

function normalizeOptionalString(value?: string | null): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function buildStableFallbackCompanyName(seed?: string | null): string {
  const baseSeed = normalizeOptionalString(seed) ?? "";
  let hash = 0;

  for (let index = 0; index < baseSeed.length; index += 1) {
    hash = (hash << 5) - hash + baseSeed.charCodeAt(index);
    hash |= 0;
  }

  const fallbackIndex = Math.abs(hash) % FALLBACK_COMPANY_NAMES.length;
  return FALLBACK_COMPANY_NAMES[fallbackIndex];
}

export function resolveCompanyName(
  source: ActiveProjectCompanySource,
  seed?: string | null,
): string {
  const resolvedCompanyName =
    normalizeOptionalString(source.companyName) ??
    normalizeOptionalString(source.company?.name) ??
    normalizeOptionalString(source.primaryContact?.companyName) ??
    normalizeOptionalString(source.primaryContact?.name);

  return resolvedCompanyName ?? buildStableFallbackCompanyName(seed);
}
