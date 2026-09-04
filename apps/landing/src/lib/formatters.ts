/**
 * Format a number as a locale string (defaulting to Swedish locale 'sv-SE', e.g. 1 234).
 * Use this everywhere instead of ad-hoc toLocaleString calls.
 */
export function formatNumber(n: number, locale?: string): string {
  return n.toLocaleString(locale || "sv-SE");
}

/**
 * Format a number with the SEK currency suffix (e.g. "1 234 SEK").
 */
export function formatSEK(n: number, locale?: string): string {
  return `${formatNumber(n, locale)} SEK`;
}
