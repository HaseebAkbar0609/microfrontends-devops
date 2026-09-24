import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CalculationStatRow,
	CalculationStatKpis,
	GetCalculationStatisticsParams,
	GetCalculationStatisticsResponse,
} from "../types/statistics";
import {
	DUMMY_CALCULATION_STAT_KPIS,
	DUMMY_CALCULATION_STAT_ROWS,
} from "../constants/statisticsMock";

/**
 * Normalizes an API response item to typed CalculationStatRow
 */
export function mapStatRowFromApi(
	item: Record<string, unknown>,
	index = 0,
): CalculationStatRow {
	return {
		id: String(item.id ?? item._id ?? `stat-${index + 1}`),
		datum: String(item.datum ?? item.date ?? item.createdAt ?? "2025-12-01 - 2025-12-30"),
		bestellare: String(item.bestellare ?? item.client ?? item.customerName ?? "Fastighetsbolaget"),
		kategori: String(item.kategori ?? item.category ?? "Service"),
		typ: String(item.typ ?? item.type ?? "B2B"),
		entreprenadform: String(item.entreprenadform ?? item.contractType ?? "Totalentreprenad"),
		antalOffert: Number(item.antalOffert ?? item.offersCount ?? item.totalOffers ?? 0),
		vunna: Number(item.vunna ?? item.won ?? 0),
		forlorade: Number(item.forlorade ?? item.lost ?? 0),
	};
}

/**
 * Filters mock list for fallback when API is unavailable
 */
function filterMockStatList(
	params: GetCalculationStatisticsParams = {},
): CalculationStatRow[] {
	const q = params.search?.trim().toLowerCase() ?? "";
	const bestellare = params.bestellare?.trim() ?? "";
	const categories = params.kategori ?? [];
	const types = params.typ ?? [];
	const entreprenadform = params.entreprenadform?.trim() ?? "";

	return DUMMY_CALCULATION_STAT_ROWS.filter((row) => {
		if (bestellare && bestellare !== "all" && row.bestellare !== bestellare) {
			return false;
		}
		if (categories.length > 0 && !categories.includes(row.kategori)) {
			return false;
		}
		if (types.length > 0 && !types.includes(row.typ)) {
			return false;
		}
		if (entreprenadform && entreprenadform !== "all" && row.entreprenadform !== entreprenadform) {
			return false;
		}
		if (!q) return true;
		return (
			row.bestellare.toLowerCase().includes(q) ||
			row.kategori.toLowerCase().includes(q) ||
			row.typ.toLowerCase().includes(q) ||
			row.datum.toLowerCase().includes(q) ||
			row.entreprenadform.toLowerCase().includes(q)
		);
	});
}

/**
 * Fetches calculation statistics rows with fallback
 */
export async function getCalculationStatisticsAPIAction(
	params: GetCalculationStatisticsParams = {},
): Promise<GetCalculationStatisticsResponse> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.STATISTICS, {
			params: {
				search: params.search,
				bestellare: params.bestellare && params.bestellare !== "all" ? params.bestellare : undefined,
				kategori: params.kategori?.length ? params.kategori.join(",") : undefined,
				typ: params.typ?.length ? params.typ.join(",") : undefined,
				entreprenadform: params.entreprenadform && params.entreprenadform !== "all" ? params.entreprenadform : undefined,
				start_date: params.startDate,
				end_date: params.endDate,
				page: params.page,
				limit: params.limit,
				sort_by: params.sortBy,
				sort_order: params.sortOrder,
			},
		});

		const payload = response.data?.data ?? response.data;
		if (Array.isArray(payload)) {
			const data = payload.map((item, idx) =>
				mapStatRowFromApi(item as Record<string, unknown>, idx),
			);
			const total = Number(response.data?.total ?? data.length);
			const page = Number(response.data?.page ?? params.page ?? 1);
			const limit = Number(response.data?.limit ?? params.limit ?? 10);
			return {
				data,
				total,
				page,
				limit,
				totalPages: Math.max(1, Math.ceil(total / limit)),
			};
		}
		const fallbackData = filterMockStatList(params);
		return {
			data: fallbackData,
			total: fallbackData.length,
			page: 1,
			limit: 10,
			totalPages: Math.max(1, Math.ceil(fallbackData.length / 10)),
		};
	} catch (error) {
		console.warn(
			`[Calculation Statistics API] GET ${API_PATH.CALCULATION.STATISTICS} failed, using fallback:`,
			error instanceof Error ? error.message : error,
		);
		const fallbackData = filterMockStatList(params);
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
 * Fetches calculation statistics KPI cards summary with fallback
 */
export async function getCalculationStatisticsKpisAPIAction(
	params: Pick<GetCalculationStatisticsParams, "startDate" | "endDate"> = {},
): Promise<CalculationStatKpis> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.STATISTICS_KPIS, {
			params: {
				start_date: params.startDate,
				end_date: params.endDate,
			},
		});

		const data = response.data?.data ?? response.data;
		if (data && typeof data === "object") {
			return {
				totalOffers: Number(data.totalOffers ?? data.total ?? DUMMY_CALCULATION_STAT_KPIS.totalOffers),
				won: Number(data.won ?? data.totalWon ?? DUMMY_CALCULATION_STAT_KPIS.won),
				lost: Number(data.lost ?? data.totalLost ?? DUMMY_CALCULATION_STAT_KPIS.lost),
			};
		}
		return DUMMY_CALCULATION_STAT_KPIS;
	} catch (error) {
		console.warn(
			`[Calculation Statistics API] GET ${API_PATH.CALCULATION.STATISTICS_KPIS} failed, using fallback:`,
			error instanceof Error ? error.message : error,
		);
		return DUMMY_CALCULATION_STAT_KPIS;
	}
}
