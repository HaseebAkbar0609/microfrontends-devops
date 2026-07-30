export type SortDir = "asc" | "desc" | null;

export function sortItems<T>(
  items: T[],
  sortField: string | null,
  sortDir: SortDir,
  getFieldValue: (item: T, field: string) => string | number,
): T[] {
  if (!sortField || !sortDir) return items;
  return [...items].sort((a, b) => {
    const av = getFieldValue(a, sortField);
    const bv = getFieldValue(b, sortField);
    if (typeof av === "number" && typeof bv === "number")
      return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}
