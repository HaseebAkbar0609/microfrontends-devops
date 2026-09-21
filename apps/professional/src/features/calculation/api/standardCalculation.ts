import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	MarkupRow,
	LaborRow,
	StandardCalculationData,
} from "../types/kalkyl";
import { DEFAULT_STANDARD_CALCULATION_DATA } from "../constants/standardMock";

type ApiStandardCalculationResponse = {
	data?: {
		id?: string;
		calc_no?: string;
		project_name?: string;
		markups?: Array<{ id: string; title: string; markup_percentage?: string; markupPercentage?: string }>;
		base_costs?: Array<{ id: string; title: string; markup_percentage?: string; markupPercentage?: string }>;
		labor_costs?: Array<{
			id: string;
			item: string;
			description: string;
			quantity: string;
			unit: string;
			a_price?: string;
			aPrice?: string;
		}>;
	};
};

export const mapStandardCalculationFromApi = (
	raw: ApiStandardCalculationResponse["data"],
): StandardCalculationData => {
	if (!raw) return DEFAULT_STANDARD_CALCULATION_DATA;

	const markups: MarkupRow[] = Array.isArray(raw.markups)
		? raw.markups.map((m) => ({
				id: String(m.id || `markup-${Date.now()}`),
				title: String(m.title || ""),
				markupPercentage: String(m.markupPercentage ?? m.markup_percentage ?? "10"),
			}))
		: DEFAULT_STANDARD_CALCULATION_DATA.markups;

	const baseCosts: MarkupRow[] = Array.isArray(raw.base_costs)
		? raw.base_costs.map((b) => ({
				id: String(b.id || `base-${Date.now()}`),
				title: String(b.title || ""),
				markupPercentage: String(b.markupPercentage ?? b.markup_percentage ?? "10"),
			}))
		: DEFAULT_STANDARD_CALCULATION_DATA.baseCosts;

	const laborCosts: LaborRow[] = Array.isArray(raw.labor_costs)
		? raw.labor_costs.map((l) => ({
				id: String(l.id || `labor-${Date.now()}`),
				item: String(l.item || ""),
				description: String(l.description || ""),
				quantity: String(l.quantity || "0"),
				unit: String(l.unit || "hour"),
				aPrice: String(l.aPrice ?? l.a_price ?? "0"),
			}))
		: DEFAULT_STANDARD_CALCULATION_DATA.laborCosts;

	return {
		id: raw.id ?? DEFAULT_STANDARD_CALCULATION_DATA.id,
		calcNo: raw.calc_no ?? DEFAULT_STANDARD_CALCULATION_DATA.calcNo,
		projectName: raw.project_name ?? DEFAULT_STANDARD_CALCULATION_DATA.projectName,
		markups,
		baseCosts,
		laborCosts,
	};
};

export async function getStandardCalculationAPIAction(
	calculationId: string = "default",
): Promise<StandardCalculationData> {
	try {
		const res = await axiosInstance.get<ApiStandardCalculationResponse>(
			API_PATH.CALCULATIONS.STANDARD(calculationId),
		);
		if (res.data?.data) {
			return mapStandardCalculationFromApi(res.data.data);
		}
		return DEFAULT_STANDARD_CALCULATION_DATA;
	} catch {
		return DEFAULT_STANDARD_CALCULATION_DATA;
	}
}

export async function saveStandardMarkupAPIAction(
	calculationId: string = "default",
	rows: MarkupRow[],
): Promise<boolean> {
	try {
		await axiosInstance.post(
			API_PATH.CALCULATIONS.STANDARD_MARKUP(calculationId),
			{ markups: rows },
		);
		return true;
	} catch {
		return false;
	}
}

export async function saveStandardBaseCostsAPIAction(
	calculationId: string = "default",
	rows: MarkupRow[],
): Promise<boolean> {
	try {
		await axiosInstance.post(
			API_PATH.CALCULATIONS.STANDARD_BASE_COSTS(calculationId),
			{ base_costs: rows },
		);
		return true;
	} catch {
		return false;
	}
}

export async function saveStandardLaborCostsAPIAction(
	calculationId: string = "default",
	rows: LaborRow[],
): Promise<boolean> {
	try {
		await axiosInstance.post(
			API_PATH.CALCULATIONS.STANDARD_LABOR_COSTS(calculationId),
			{ labor_costs: rows },
		);
		return true;
	} catch {
		return false;
	}
}

export async function deleteStandardCostSectionAPIAction(
	calculationId: string = "default",
	sectionId: string,
): Promise<boolean> {
	try {
		await axiosInstance.delete(
			API_PATH.CALCULATIONS.STANDARD_SECTION_DELETE(calculationId, sectionId),
		);
		return true;
	} catch {
		return false;
	}
}
