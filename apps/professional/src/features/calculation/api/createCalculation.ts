import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { listOffersAPIAction } from "@/api-actions/offers";
import type { ActionResult, ApiResponse } from "@/types/api";
import type { CreateCalculationPayload } from "../types/kalkyl";

export interface OfferDropdownOption {
	id: string;
	code: string;
	title: string;
	clientName: string;
	address: string;
	city: string;
	email: string;
	phone: string;
	budget: string;
	date: string;
}

export const CALCULATION_COMPANY_OPTIONS: string[] = [];
export const CALCULATION_RESPONSIBLE_OPTIONS: string[] = [];

export const CALCULATION_ROLES = [
	"Kalkyl",
	"Kalkylansvarig",
	"Projektledare",
	"Ekonomi",
	"Arbetsledare",
];

export interface AvailableDocOption {
	id: string;
	namn: string;
	typ: "PDF" | "DOC" | "IMG";
	fileType: "pdf" | "doc" | "img";
}

export const CALCULATION_DOCUMENT_OPTIONS: AvailableDocOption[] = [];

export async function getCalculationAvailableDocumentsAPIAction(): Promise<AvailableDocOption[]> {
	// Calculation attachments have no persisted source yet.
	return [];
}

export async function createCalculationAPIAction(
	payload: CreateCalculationPayload,
): Promise<ActionResult<{ id: string; calcNo: string }>> {
	try {
		const res = await axiosInstance.post<ApiResponse<{ id: string; calc_no?: string; calcNo?: string }> & { success: boolean }>(
			API_PATH.CALCULATIONS.CREATE,
			payload,
		);
		if (res.data?.success && res.data.data?.id && (res.data.data.calcNo || res.data.data.calc_no)) {
			return {
				success: true,
				data: {
					id: res.data.data.id,
					calcNo: (res.data.data.calcNo || res.data.data.calc_no) as string,
				},
				error: null,
			};
		}
		return {
			success: false,
			data: null,
			error: "INVALID_RESPONSE",
		};
	} catch {
		return {
			success: false,
			data: null,
			error: "CALCULATION_CREATE_FAILED",
		};
	}
}

export async function getOffersForKalkylAction(): Promise<OfferDropdownOption[]> {
	try {
		const res = await listOffersAPIAction({
			status: "REQUESTED",
			pageSize: 50,
		});
		if (res.items && res.items.length > 0) {
			return res.items.filter((item) => item.id).map((item) => ({
				id: String(item.id),
				code: String(item.idNumber || item.id || ""),
				title: String(item.jobName || item.idNumber || "Offert"),
				clientName: String(item.contactName || "Klient"),
				address: String(item.municipality || ""),
				city: String(item.municipality || ""),
				email: String(item.contactEmail || ""),
				phone: String(item.contactPhone || ""),
				budget: item.totalPrice ? `${item.totalPrice.toLocaleString("sv-SE")} kr` : "",
				date: String(item.date || ""),
			}));
		}
		return [];
	} catch {
		return [];
	}
}
