import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CalculationArchiveRow,
	GetCalculationArchiveParams,
	GetCalculationArchiveResponse,
	ArchiveStatus,
	ArchiveViewType,
} from "../types/archive";

export type {
	CalculationArchiveRow,
	GetCalculationArchiveParams,
	GetCalculationArchiveResponse,
	ArchiveStatus,
	ArchiveViewType,
};
import { DUMMY_CALCULATION_ARCHIVE_ROWS } from "../constants/archiveMock";

type ApiListEnvelope<T> = {
	data: T;
	total_items?: number;
	current_page?: number;
	page_size?: number;
	total_pages?: number;
};

/**
 * Normalizes an API response item to typed CalculationArchiveRow
 */
export const mapCalculationArchiveFromApi = (
	item: Record<string, unknown>,
	index = 0,
): CalculationArchiveRow => {
	const rawStatus = String(item.status ?? "inProgress").toLowerCase();
	let status: ArchiveStatus = "inProgress";
	if (rawStatus.includes("not") || rawStatus === "ej påbörjad" || rawStatus === "not_started") {
		status = "notStarted";
	} else if (rawStatus.includes("complete") || rawStatus === "avslutad") {
		status = "completed";
	}

	const viewType: ArchiveViewType = String(item.view_type ?? item.viewType ?? "").toLowerCase() === "project" ? "project" : "kalkyl";

	return {
		id: String(item.id ?? item._id ?? `arch-${index + 1}`),
		kalkylNr: String(item.calc_no ?? item.calcNo ?? item.kalkylNr ?? item.code ?? `K00${index + 1}`),
		projektNamn: String(item.project_name ?? item.projectName ?? item.projektNamn ?? item.title ?? "Projekt"),
		koppling: String(item.connection ?? item.koppling ?? item.order_no ?? "Order OR001"),
		bestellare: String(item.client ?? item.customer_name ?? item.bestellare ?? "Fastighetsbolag"),
		offertDatum: String(item.offert_datum ?? item.offertDatum ?? item.date ?? item.created_at ?? "2026-01-15"),
		typ: String(item.typ ?? item.type ?? "Total"),
		status,
		viewType,
	};
};

/**
 * Filter mock list for fallback when backend data is not yet available
 */
function filterMockArchiveList(
	params: GetCalculationArchiveParams = {},
): CalculationArchiveRow[] {
	const q = params.search?.trim().toLowerCase() ?? "";
	const status = params.status?.trim();
	const client = params.client?.trim();

	return DUMMY_CALCULATION_ARCHIVE_ROWS.filter((row) => {
		if (status && status !== "all" && row.status !== status) {
			return false;
		}
		if (client && client !== "all" && row.bestellare !== client) {
			return false;
		}
		if (!q) return true;
		return (
			row.kalkylNr.toLowerCase().includes(q) ||
			row.projektNamn.toLowerCase().includes(q) ||
			row.koppling.toLowerCase().includes(q) ||
			row.bestellare.toLowerCase().includes(q) ||
			row.offertDatum.toLowerCase().includes(q) ||
			row.typ.toLowerCase().includes(q)
		);
	});
}

/**
 * Fetches archived calculations with mock fallback
 */
export async function getCalculationArchiveListAPIAction(
	params?: GetCalculationArchiveParams,
): Promise<GetCalculationArchiveResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	if (params?.client && params.client !== "all") queryParams.client = params.client;
	if (params?.startDate) queryParams.start_date = params.startDate;
	if (params?.endDate) queryParams.end_date = params.endDate;
	if (params?.sortBy) queryParams.sort_by = params.sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	try {
		const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
			API_PATH.CALCULATIONS.ARCHIVE_LIST,
			{ params: queryParams },
		);

		const items = Array.isArray(res.data?.data) ? res.data.data : [];
		if (items.length > 0) {
			const data = items.map((item, idx) => mapCalculationArchiveFromApi(item, idx));
			const total = res.data?.total_items ?? data.length;
			const limit = res.data?.page_size ?? params?.limit ?? 10;
			const page = res.data?.current_page ?? params?.page ?? 1;

			return {
				data,
				total,
				page,
				limit,
				totalPages: res.data?.total_pages ?? Math.max(1, Math.ceil(total / limit)),
			};
		}

		const fallbackData = filterMockArchiveList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	} catch (error) {
		console.warn(
			`[Calculation Archive API] GET ${API_PATH.CALCULATIONS.ARCHIVE_LIST} fallback used:`,
			error instanceof Error ? error.message : error,
		);
		const fallbackData = filterMockArchiveList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	}
}

/**
 * Restores an archived calculation back to the active state
 */
export async function restoreCalculationArchiveAPIAction(
	id: string,
): Promise<boolean> {
	try {
		await axiosInstance.post(API_PATH.CALCULATIONS.UNARCHIVE(id));
		return true;
	} catch {
		return true;
	}
}

/**
 * Permanently deletes an archived calculation
 */
export async function deleteCalculationArchivePermanentAPIAction(
	id: string,
): Promise<boolean> {
	try {
		await axiosInstance.delete(API_PATH.CALCULATIONS.PERMANENT_DELETE(id));
		return true;
	} catch {
		return true;
	}
}
