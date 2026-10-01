import { PROTOCOL_TYPE_LABELS } from "@/features/project/production/protokoll/projectProtocol.config";
import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import type {
	ForecastProtocol,
	ForecastProtocolListFilters,
	ForecastProtocolSortField,
} from "../types/forecastProtocols.types";

/** Turns a translation key into the reader's text. */
export type ProtocolLabel = (key: TranslationKeys) => string;

/**
 * Whether a protocol belongs in the register as filtered and searched. Search
 * reads what the reader sees: the file's name and the type's label.
 */
export function matchesProtocol(
	protocol: ForecastProtocol,
	filters: ForecastProtocolListFilters,
	query: string,
	label: ProtocolLabel,
): boolean {
	if (filters.type && protocol.type !== filters.type) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [protocol.fileName, label(PROTOCOL_TYPE_LABELS[protocol.type])]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(
	protocol: ForecastProtocol,
	field: ForecastProtocolSortField,
	label: ProtocolLabel,
): string {
	if (field === "type") return label(PROTOCOL_TYPE_LABELS[protocol.type]);
	return protocol[field];
}

/**
 * Protocols in header order, compared in the app's language with numbers
 * inside a name read as numbers, so Byggmöte 2 follows Byggmöte 1 and Swedish
 * å, ä and ö sort after z. With no sort the register's own order — newest
 * meeting first — stands.
 */
export function sortProtocols(
	protocols: ForecastProtocol[],
	field: ForecastProtocolSortField | null,
	dir: SortDir,
	label: ProtocolLabel,
	locale: string,
): ForecastProtocol[] {
	if (!field || !dir) return protocols;

	const factor = dir === "asc" ? 1 : -1;
	return [...protocols].sort(
		(a, b) =>
			factor *
			sortValue(a, field, label).localeCompare(sortValue(b, field, label), locale, {
				sensitivity: "base",
				numeric: true,
			}),
	);
}
