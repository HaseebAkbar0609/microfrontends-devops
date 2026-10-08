import type { Quote } from "@/features/quote/types/types";
import {
	isProjectCreationMode,
	PROJECT_STATUS_FILTER_OPTIONS,
} from "@/features/quote/constants";
import { formatProjectTypeLabel } from "@/features/quote/utils/formatProjectType";

const VALID_QUOTE_STATUS = new Set<string>(
	PROJECT_STATUS_FILTER_OPTIONS.map((o) => o.value),
);

function s(v: unknown): string {
	if (v == null || v === "") return "";
	return String(v).trim();
}

function priceSEK(v: unknown): string {
	if (v == null || v === "") return "0 SEK";
	if (typeof v === "number") return `${v.toLocaleString("sv-SE")} SEK`;
	const t = String(v).trim();
	return t.toLowerCase().endsWith("sek") ? t : `${t} SEK`;
}

function categoryLabelsFromRow(row: Record<string, unknown>): string[] {
	const subs = row.subcategories;
	if (Array.isArray(subs) && subs.length > 0) {
		const names = subs
			.map((item) =>
				item != null && typeof item === "object" && "name" in item
					? s((item as { name?: unknown }).name)
					: "",
			)
			.filter(Boolean);
		if (names.length > 0) return names;
	}
	const single = s(row.category) || s(row.category_name);
	if (single) return [single];
	return ["-"];
}

/**
 * Normalizes API `quote_status` (or legacy `status`) to a PROJECT_STATUS_FILTER_OPTIONS value.
 */
function normalizeQuoteStatus(row: Record<string, unknown>): string {
	if (s(row.status).toLowerCase() === "draft") return "draft";
	const raw = s(row.quote_status) || s(row.status);
	if (!raw) return "waiting_for_quote";

	const normalized = raw.toLowerCase().replace(/\s+/g, "_");

	if (VALID_QUOTE_STATUS.has(normalized)) return normalized;

	if (normalized === "not_reviewed") return "not_reviewd";
	if (normalized === "received_quote") return "recieved_quote";

	const lower = raw.toLowerCase();
	if (lower.includes("received") && lower.includes("quote")) {
		return "recieved_quote";
	}
	if (lower.includes("invit")) return "opened";
	if (
		lower.includes("waiting") ||
		lower === "pending" ||
		lower === "draft" ||
		lower === "active"
	) {
		return "waiting_for_quote";
	}
	if (lower.includes("approved") && !lower.includes("quote")) {
		return "approved";
	}

	return "waiting_for_quote";
}

/** Maps one GET /api/v1/project/list item to a table row. */
export function mapProjectRowToQuote(row: Record<string, unknown>): Quote | null {
	const id = s(row.project_id) || s(row.id);
	if (!id) return null;

	const rawType = row.project_type ?? row.type;
	const projectTypeStr = rawType != null && s(rawType) ? s(rawType) : undefined;

	const completedRaw =
		row.is_completed ?? row.is_comoleted ?? row.is_completed_flag;
	const is_completed =
		typeof completedRaw === "boolean"
			? completedRaw
			: completedRaw != null && completedRaw !== ""
				? String(completedRaw).toLowerCase() === "true" ||
					String(completedRaw) === "1"
				: undefined;

	const categoryLabels = categoryLabelsFromRow(row);

	return {
		id,
		refNo: s(row.ref_no) || s(row.reference_number) || s(row.project_number),
		projectName: s(row.project_name) || s(row.name) || "-",
		project_type: projectTypeStr,
		type: formatProjectTypeLabel(rawType),
		category: categoryLabels.join(", "),
		categories: categoryLabels,
		receivedQuotes:
			s(row.received_quotes) ||
			s(row.quotes_received) ||
			s(row.quotes_summary) ||
			s(row.received_quote_count) ||
			"0",
		lowestPrice: priceSEK(
			row.lowest_price ?? row.lowest_price_formatted ?? row.min_price,
		),
		highestPrice: priceSEK(
			row.highest_price ?? row.highest_price_formatted ?? row.max_price,
		),
		quote_status: normalizeQuoteStatus(row),
		...(is_completed !== undefined ? { is_completed } : {}),
		...(isProjectCreationMode(row.creation_mode)
			? { creation_mode: row.creation_mode }
			: {}),
	};
}

/** Supports `{ data: T[] }` or `{ data: { items, total } }` list envelopes. */
export function parseProjectListResponse(body: unknown): {
	items: Record<string, unknown>[];
	total: number;
} | null {
	if (!body || typeof body !== "object") return null;
	const b = body as Record<string, unknown>;
	const data = b.data;

	if (data && typeof data === "object" && !Array.isArray(data) && "items" in data) {
		const inner = data as Record<string, unknown>;
		const items = inner.items;
		const total = Number(inner.total ?? inner.total_items ?? b.total_items ?? 0);
		if (Array.isArray(items)) {
			return {
				items: items.filter(
					(x): x is Record<string, unknown> =>
						x != null && typeof x === "object" && !Array.isArray(x),
				),
				total,
			};
		}
	}

	if (Array.isArray(data)) {
		return {
			items: data.filter(
				(x): x is Record<string, unknown> =>
					x != null && typeof x === "object" && !Array.isArray(x),
			),
			total: Number(b.total_items ?? b.total ?? data.length),
		};
	}

	return null;
}
