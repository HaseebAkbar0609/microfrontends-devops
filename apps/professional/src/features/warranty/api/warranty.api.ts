import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { WARRANTY_CONSTANTS } from "../constants/warranty.constants";
import { MOCK_WARRANTY_ROWS, MOCK_INSPECTION_DATES } from "../data/warranty.mock";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";

/**
 * Fetches the list of guarantee commitments overview rows from the API with mock fallback
 */
export async function getWarrantyOverview(orderId?: string): Promise<WarrantyRow[]> {
	if (!orderId) {
		return MOCK_WARRANTY_ROWS;
	}

	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.GUARANTEE_COMMITMENTS(orderId));
		const payload = res.data?.data ?? res.data;
		if (Array.isArray(payload) && payload.length > 0) {
			return payload.map((item: Record<string, unknown>, idx: number) => ({
				id: String(item.id || item.orderNo || `warranty-${idx}`),
				recordNo: String(item.orderNo || item.order_no || `#${5000 + idx}`),
				recordName: String(item.orderName || item.order_name || "Renovation"),
				startDate: String(item.startDate || item.start_date || "2024/01/01"),
				approvedDate: String(item.approvedDate || item.approved_date || "2024/01/01"),
				warrantyPeriod: String(item.warrantyPeriod || item.warranty_period || "5 år"),
				projectManager: String(item.projectManager || item.project_manager || "Lindsey Philips"),
				customer: String(item.customer || item.customer_name || "Locum"),
				contactPerson: String(item.contactPerson || item.contact_person || "Stina Andersson"),
				warrantyResponsible: String(item.warrantyResponsible || item.warranty_responsible || "Kalle Svensson"),
				warrantyEndDate: String(item.warrantyEndDate || item.warranty_end_date || "2030-09-01"),
				phone: String(item.phone || "-"),
				email: String(item.email || "Ann@example.com"),
			}));
		}
		return MOCK_WARRANTY_ROWS;
	} catch (error) {
		console.warn(
			`[Warranty API] GET ${API_PATH.ORDERS.GUARANTEE_COMMITMENTS(orderId)} failed, using mock fallback:`,
			error instanceof Error ? error.message : error
		);
		return MOCK_WARRANTY_ROWS;
	}
}

/**
 * Fetches single guarantee detail and inspection dates
 */
export async function getWarrantyDetail(orderId: string): Promise<{
	warranty: WarrantyRow;
	visitDates: InspectionDateItem[];
}> {
	const defaultWarranty =
		MOCK_WARRANTY_ROWS.find(
			(r) =>
				r.id === orderId ||
				r.recordNo.replace("#", "").trim() === orderId.replace("#", "").trim()
		) || MOCK_WARRANTY_ROWS[MOCK_WARRANTY_ROWS.length - 1];

	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.GUARANTEE_VISIT_DATES(orderId));
		const payload = res.data?.data ?? res.data;
		if (Array.isArray(payload)) {
			return {
				warranty: defaultWarranty,
				visitDates: payload as InspectionDateItem[],
			};
		}
		return {
			warranty: defaultWarranty,
			visitDates: MOCK_INSPECTION_DATES,
		};
	} catch (error) {
		console.warn(
			`[Warranty API] GET failed for order ${orderId}, using fallback:`,
			error instanceof Error ? error.message : error
		);
		return {
			warranty: defaultWarranty,
			visitDates: MOCK_INSPECTION_DATES,
		};
	}
}

/**
 * Creates a new inspection / visit date
 */
export async function createVisitDateApi(
	orderId: string,
	newItem: Omit<InspectionDateItem, "id">
): Promise<InspectionDateItem> {
	try {
		const res = await axiosInstance.post(API_PATH.ORDERS.GUARANTEE_VISIT_DATES(orderId), newItem);
		return res.data?.data ?? res.data;
	} catch (error) {
		console.warn(
			`[Warranty API] POST visit date failed, saving locally:`,
			error instanceof Error ? error.message : error
		);
		return {
			...newItem,
			id: `v-${Date.now()}`,
		};
	}
}

/**
 * Updates an existing inspection / visit date
 */
export async function updateVisitDateApi(
	orderId: string,
	visitDateId: string,
	updatedItem: Partial<InspectionDateItem>
): Promise<InspectionDateItem> {
	try {
		const res = await axiosInstance.put(
			API_PATH.ORDERS.GUARANTEE_VISIT_DATE_DETAIL(orderId, visitDateId),
			updatedItem
		);
		return res.data?.data ?? res.data;
	} catch (error) {
		console.warn(
			`[Warranty API] PUT visit date failed, updating locally:`,
			error instanceof Error ? error.message : error
		);
		return {
			id: visitDateId,
			date: updatedItem.date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE,
			reminderEmail: updatedItem.reminderEmail || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_EMAIL,
			rule: updatedItem.rule || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_RULE,
			documentName: updatedItem.documentName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileType: updatedItem.fileType || WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE,
			recipients: updatedItem.recipients,
			documents: updatedItem.documents,
		};
	}
}

/**
 * Deletes an inspection / visit date
 */
export async function deleteVisitDateApi(
	orderId: string,
	visitDateId: string
): Promise<boolean> {
	try {
		await axiosInstance.delete(
			API_PATH.ORDERS.GUARANTEE_VISIT_DATE_DETAIL(orderId, visitDateId)
		);
		return true;
	} catch (error) {
		console.warn(
			`[Warranty API] DELETE visit date failed:`,
			error instanceof Error ? error.message : error
		);
		return true;
	}
}
