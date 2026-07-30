import { useState } from "react";
import type { SortDir } from "@/utils/tableSort";

export function useTableSort<K extends string>() {
  const [sortField, setSortField] = useState<K | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function toggleSort(field: K) {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField(null);
      setSortDir(null);
    }
  }

  return { sortField, sortDir, toggleSort };
}
