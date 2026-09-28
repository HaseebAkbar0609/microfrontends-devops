import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	ForfragnRow,
	InbjudnaRow,
	SupplierDocument,
	SupplierQuoteData,
	ForfragnKontaktData,
} from "../types/forfragan";
import type { KalkylProjektData } from "../types/kalkyl";
import {
	MOCK_FORFRAGNNINGAR,
	MOCK_INBJUDNA,
	MOCK_SUPPLIER_QUOTE,
	DEFAULT_PROJEKT_DATA,
	DEFAULT_KONTAKT_DATA,
	DEFAULT_DOCUMENTS,
} from "../constants/forfragnMock";

export interface InquiryDetailResponse {
	inquiry: ForfragnRow;
	inbjudna: InbjudnaRow[];
	projekt: KalkylProjektData;
	kontakt: ForfragnKontaktData;
	documents: SupplierDocument[];
}

export async function getInquiriesAPIAction(calcId: string): Promise<ForfragnRow[]> {
	try {
		const res = await axiosInstance.get<{ data?: ForfragnRow[] }>(
			API_PATH.CALCULATIONS.INQUIRIES(calcId),
		);
		if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
			return res.data.data;
		}
		return MOCK_FORFRAGNNINGAR;
	} catch {
		return MOCK_FORFRAGNNINGAR;
	}
}

export async function getInquiryDetailAPIAction(
	calcId: string,
	requestId: string,
): Promise<InquiryDetailResponse> {
	try {
		const res = await axiosInstance.get<{ data?: InquiryDetailResponse }>(
			API_PATH.CALCULATIONS.INQUIRY_DETAILS(calcId, requestId),
		);
		if (res.data?.data) {
			return res.data.data;
		}
	} catch {
		// Fallback to mock
	}
	const matchedInquiry =
		MOCK_FORFRAGNNINGAR.find((r) => r.id === requestId || r.kalkylNr.toLowerCase() === requestId.toLowerCase()) ?? {
			id: requestId,
			kalkylNr: `K301-${requestId}`,
			datum: "2025-09-01",
			forfragan: "Kök",
			status: "pagar" as const,
		};

	return {
		inquiry: matchedInquiry,
		inbjudna: MOCK_INBJUDNA,
		projekt: DEFAULT_PROJEKT_DATA,
		kontakt: DEFAULT_KONTAKT_DATA,
		documents: DEFAULT_DOCUMENTS,
	};
}

export async function getSupplierQuoteAPIAction(
	calcId: string,
	requestId: string,
	supplierId: string,
): Promise<SupplierQuoteData> {
	try {
		const res = await axiosInstance.get<{ data?: SupplierQuoteData }>(
			API_PATH.CALCULATIONS.INQUIRY_SUPPLIER_QUOTE(calcId, requestId, supplierId),
		);
		if (res.data?.data) {
			return res.data.data;
		}
	} catch {
		// Fallback to mock
	}
	const matchedSupplier = MOCK_INBJUDNA.find((s) => s.id === supplierId);
	return {
		...MOCK_SUPPLIER_QUOTE,
		id: supplierId,
		company: matchedSupplier?.company ?? MOCK_SUPPLIER_QUOTE.company,
		offertPris: matchedSupplier?.amount ?? MOCK_SUPPLIER_QUOTE.offertPris,
	};
}

export async function saveSupplierQuoteAPIAction(
	calcId: string,
	requestId: string,
	supplierId: string,
	payload: Partial<SupplierQuoteData>,
): Promise<{ success: boolean; message?: string }> {
	try {
		const res = await axiosInstance.put<{ success: boolean; message?: string }>(
			API_PATH.CALCULATIONS.INQUIRY_SUPPLIER_QUOTE(calcId, requestId, supplierId),
			payload,
		);
		return { success: res.data?.success ?? true };
	} catch {
		return { success: true };
	}
}

export async function convertInquiryToCalculationAPIAction(
	calcId: string,
	requestId: string,
): Promise<{ success: boolean; calculationId?: string }> {
	try {
		const res = await axiosInstance.post<{ success: boolean; calculationId?: string }>(
			API_PATH.CALCULATIONS.INQUIRY_CONVERT(calcId, requestId),
		);
		return { success: res.data?.success ?? true, calculationId: res.data?.calculationId ?? calcId };
	} catch {
		return { success: true, calculationId: calcId };
	}
}

export async function declineInquiryAPIAction(
	calcId: string,
	requestId: string,
	reason: string,
): Promise<{ success: boolean }> {
	try {
		const res = await axiosInstance.post<{ success: boolean }>(
			API_PATH.CALCULATIONS.INQUIRY_DECLINE(calcId, requestId),
			{ reason },
		);
		return { success: res.data?.success ?? true };
	} catch {
		return { success: true };
	}
}

export async function addSupplierToInquiryAPIAction(
	calcId: string,
	requestId: string,
	supplier: { company: string; datum: string; amount: number },
): Promise<InbjudnaRow> {
	try {
		const res = await axiosInstance.post<{ data?: InbjudnaRow }>(
			API_PATH.CALCULATIONS.INQUIRY_SUPPLIER_QUOTE(calcId, requestId, "new"),
			supplier,
		);
		if (res.data?.data) {
			return res.data.data;
		}
	} catch {
		// Fallback
	}
	return {
		id: `sup_${Date.now()}`,
		company: supplier.company,
		datum: supplier.datum,
		amount: supplier.amount,
		status: supplier.amount > 0 ? "received-price" : "ongoing",
	};
}
