import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import type { SortDir } from "./tableSort";

export function renderSortIcon(
  field: string,
  activeSortField: string | null,
  activeSortDir: SortDir,
) {
  if (activeSortField !== field)
    return <ArrowUpDown size={14} className="shrink-0 text-slate-400" />;
  if (activeSortDir === "asc")
    return <ChevronUp size={14} className="shrink-0" />;
  return <ChevronDown size={14} className="shrink-0" />;
}
