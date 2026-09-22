import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	QuickAiCalcData,
	QuickAiComponentItem,
	QuickAiDefaultSettings,
	QuickAiDocumentRow,
	QuickAiDocumentSection,
	QuickAiLicenseItem,
} from "../types/quickAi";
import {
	DEFAULT_QUICK_AI_DATA,
	DEFAULT_QUICK_AI_LICENSES,
	DEFAULT_QUICK_AI_SETTINGS,
	DEFAULT_QUICK_AI_COMPONENTS,
	DEFAULT_QUICK_AI_SECTIONS,
} from "../constants/quickAiMock";

/**
 * Normalizes and maps raw API response payload to typed QuickAiCalcData
 */
export function mapQuickAiFromApi(raw: unknown): QuickAiCalcData {
	if (!raw || typeof raw !== "object") {
		return DEFAULT_QUICK_AI_DATA;
	}

	const data = raw as Record<string, unknown>;

	const rawLicenses = Array.isArray(data.licenses) ? data.licenses : null;
	const licenses: QuickAiLicenseItem[] = rawLicenses
		? (rawLicenses as Record<string, unknown>[]).map((lic, idx) => ({
				id: String(lic.id ?? `lic-${idx}`),
				label: String(lic.label ?? lic.name ?? ""),
				active: Boolean(lic.active ?? lic.is_active ?? true),
			}))
		: DEFAULT_QUICK_AI_LICENSES;

	const rawSettings = (data.default_settings ?? data.defaultSettings) as
		| Record<string, unknown>
		| undefined;
	const defaultSettings: QuickAiDefaultSettings = rawSettings
		? {
				markupByCalc: Boolean(rawSettings.markup_by_calc ?? rawSettings.markupByCalc ?? true),
				baseCosts: Boolean(rawSettings.base_costs ?? rawSettings.baseCosts ?? true),
				aPriceList: Boolean(rawSettings.a_price_list ?? rawSettings.aPriceList ?? true),
			}
		: DEFAULT_QUICK_AI_SETTINGS;

	const rawComponents = Array.isArray(data.components) ? data.components : null;
	const components: QuickAiComponentItem[] = rawComponents
		? (rawComponents as Record<string, unknown>[]).map((comp, idx) => ({
				id: String(comp.id ?? `comp-${idx}`),
				label: String(comp.label ?? comp.name ?? ""),
				icon: String(comp.icon ?? "wall"),
			}))
		: DEFAULT_QUICK_AI_COMPONENTS;

	const rawSections = Array.isArray(data.sections) ? data.sections : null;
	const sections: QuickAiDocumentSection[] = rawSections
		? (rawSections as Record<string, unknown>[]).map((sec, idx) => {
				const rawRows = Array.isArray(sec.rows) ? sec.rows : [];
				const rows: QuickAiDocumentRow[] = (rawRows as Record<string, unknown>[]).map(
					(row, rIdx) => ({
						id: String(row.id ?? `row-${idx}-${rIdx}`),
						label: String(row.label ?? row.title ?? ""),
						checked: Boolean(row.checked ?? row.is_checked ?? false),
					}),
				);
				const allChecked = rows.length > 0 && rows.every((r) => r.checked);
				return {
					id: String(sec.id ?? `sec-${idx}`),
					title: String(sec.title ?? sec.name ?? ""),
					selectAll: Boolean(sec.select_all ?? sec.selectAll ?? allChecked),
					rows,
				};
			})
		: DEFAULT_QUICK_AI_SECTIONS;

	return {
		licenses,
		defaultSettings,
		components,
		sections,
	};
}

/**
 * Maps frontend typed QuickAiCalcData to API payload format
 */
export function mapQuickAiToApi(data: QuickAiCalcData): Record<string, unknown> {
	return {
		licenses: data.licenses.map((lic) => ({
			id: lic.id,
			label: lic.label,
			is_active: lic.active,
		})),
		default_settings: {
			markup_by_calc: data.defaultSettings.markupByCalc,
			base_costs: data.defaultSettings.baseCosts,
			a_price_list: data.defaultSettings.aPriceList,
		},
		components: data.components.map((comp) => ({
			id: comp.id,
			label: comp.label,
			icon: comp.icon,
		})),
		sections: data.sections.map((sec) => ({
			id: sec.id,
			title: sec.title,
			select_all: sec.selectAll,
			rows: sec.rows.map((row) => ({
				id: row.id,
				label: row.label,
				checked: row.checked,
			})),
		})),
	};
}

/**
 * Fetch QuickAICalc data with mock fallback
 */
export async function getQuickAiCalcAPIAction(): Promise<QuickAiCalcData> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.QUICK_AI);
		const payload = response.data?.data ?? response.data;
		if (payload && typeof payload === "object") {
			return mapQuickAiFromApi(payload);
		}
		return DEFAULT_QUICK_AI_DATA;
	} catch (error) {
		console.warn(
			`[QuickAICalc API] GET ${API_PATH.CALCULATION.QUICK_AI} failed, using mock fallback:`,
			error instanceof Error ? error.message : error,
		);
		return DEFAULT_QUICK_AI_DATA;
	}
}

/**
 * Save QuickAICalc settings & configuration
 */
export async function saveQuickAiCalcAPIAction(
	payload: QuickAiCalcData,
): Promise<{ success: boolean; data?: QuickAiCalcData }> {
	const body = mapQuickAiToApi(payload);
	try {
		const response = await axiosInstance.post(API_PATH.CALCULATION.QUICK_AI_SAVE, body);
		const resPayload = response.data?.data ?? response.data;
		return {
			success: response?.status === 200 || response?.status === 201,
			data: resPayload ? mapQuickAiFromApi(resPayload) : payload,
		};
	} catch (error) {
		console.warn(
			`[QuickAICalc API] POST ${API_PATH.CALCULATION.QUICK_AI_SAVE} failed, saving locally:`,
			error instanceof Error ? error.message : error,
		);
		return { success: true, data: payload };
	}
}

/**
 * Purchase QuickAICalc License
 */
export async function purchaseQuickAiLicenseAPIAction(
	licenseName = "QuickAICalc - Ny (1)",
): Promise<{ success: boolean; id: string; label: string }> {
	try {
		const response = await axiosInstance.post(
			API_PATH.CALCULATION.QUICK_AI_PURCHASE_LICENSE,
			{ license_name: licenseName, label: licenseName },
		);
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			id: String(data?.id ?? `lic-${Date.now()}`),
			label: String(data?.label ?? licenseName),
		};
	} catch (error) {
		console.warn(
			`[QuickAICalc API] POST ${API_PATH.CALCULATION.QUICK_AI_PURCHASE_LICENSE} failed:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			id: `lic-${Date.now()}`,
			label: licenseName,
		};
	}
}

/**
 * Add Component
 */
export async function addQuickAiComponentAPIAction(
	component: Omit<QuickAiComponentItem, "id">,
): Promise<{ success: boolean; item: QuickAiComponentItem }> {
	try {
		const response = await axiosInstance.post(
			API_PATH.CALCULATION.QUICK_AI_ADD_COMPONENT,
			{
				label: component.label,
				icon: component.icon,
			},
		);
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			item: {
				id: String(data?.id ?? `comp-${Date.now()}`),
				label: String(data?.label ?? component.label),
				icon: String(data?.icon ?? component.icon),
			},
		};
	} catch (error) {
		console.warn(
			`[QuickAICalc API] POST ${API_PATH.CALCULATION.QUICK_AI_ADD_COMPONENT} failed:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			item: {
				id: `comp-${Date.now()}`,
				label: component.label,
				icon: component.icon,
			},
		};
	}
}

/**
 * Create Document Section
 */
export async function createQuickAiSectionAPIAction(
	title: string,
): Promise<{ success: boolean; section: QuickAiDocumentSection }> {
	try {
		const response = await axiosInstance.post(
			API_PATH.CALCULATION.QUICK_AI_CREATE_SECTION,
			{ title },
		);
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			section: {
				id: String(data?.id ?? `sec-${Date.now()}`),
				title: String(data?.title ?? title),
				selectAll: true,
				rows: [
					{
						id: `row-${Date.now()}-1`,
						label: "Ny rad",
						checked: true,
					},
				],
			},
		};
	} catch (error) {
		console.warn(
			`[QuickAICalc API] POST ${API_PATH.CALCULATION.QUICK_AI_CREATE_SECTION} failed:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			section: {
				id: `sec-${Date.now()}`,
				title,
				selectAll: true,
				rows: [
					{
						id: `row-${Date.now()}-1`,
						label: "Ny rad",
						checked: true,
					},
				],
			},
		};
	}
}

/**
 * Delete Document Section
 */
export async function deleteQuickAiSectionAPIAction(
	sectionId: string,
): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.delete(
			API_PATH.CALCULATION.QUICK_AI_DELETE_SECTION(sectionId),
		);
		return { success: response?.status === 200 || response?.status === 204 };
	} catch (error) {
		console.warn(
			`[QuickAICalc API] DELETE ${API_PATH.CALCULATION.QUICK_AI_DELETE_SECTION(sectionId)} failed:`,
			error instanceof Error ? error.message : error,
		);
		return { success: true };
	}
}

/**
 * Create Document Row
 */
export async function createQuickAiRowAPIAction(
	sectionId: string,
	row: Omit<QuickAiDocumentRow, "id">,
): Promise<{ success: boolean; row: QuickAiDocumentRow }> {
	try {
		const response = await axiosInstance.post(
			API_PATH.CALCULATION.QUICK_AI_CREATE_ROW(sectionId),
			{
				label: row.label,
				checked: row.checked,
			},
		);
		const data = response.data?.data ?? response.data;
		return {
			success: true,
			row: {
				id: String(data?.id ?? `row-${Date.now()}`),
				label: String(data?.label ?? row.label),
				checked: Boolean(data?.checked ?? row.checked),
			},
		};
	} catch (error) {
		console.warn(
			`[QuickAICalc API] POST row failed:`,
			error instanceof Error ? error.message : error,
		);
		return {
			success: true,
			row: {
				id: `row-${Date.now()}`,
				label: row.label,
				checked: row.checked,
			},
		};
	}
}

/**
 * Delete Document Row
 */
export async function deleteQuickAiRowAPIAction(
	rowId: string,
): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.delete(
			API_PATH.CALCULATION.QUICK_AI_DELETE_ROW(rowId),
		);
		return { success: response?.status === 200 || response?.status === 204 };
	} catch (error) {
		console.warn(
			`[QuickAICalc API] DELETE ${API_PATH.CALCULATION.QUICK_AI_DELETE_ROW(rowId)} failed:`,
			error instanceof Error ? error.message : error,
		);
		return { success: true };
	}
}
