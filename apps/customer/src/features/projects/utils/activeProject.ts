import { resumeDraftPath } from "@/features/quote/constants";
import type { ActiveProject } from "../types";

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

/** Newest first, as the API orders each list: project codes (P-YYYY-NNNNNN) grow with creation */
export function byNewestFirst(a: ActiveProject, b: ActiveProject): number {
  return b.referenceNo.localeCompare(a.referenceNo, undefined, {
    numeric: true,
  });
}

/** A draft opens the wizard to continue it; anything else opens the project */
export function projectHref(project: ActiveProject): string {
  return project.isCompleted === false
    ? resumeDraftPath(project.id)
    : `/projectmanagement/${project.id}`;
}
