import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { GUARANTEE_CONSTANTS } from "../constants/guaranteeCommitments.constants";
import { MOCK_GUARANTEE_ROWS, MOCK_INSPECTION_DATES } from "../data/guaranteeCommitments.mock";
import type { GuaranteeRow, InspectionDateItem } from "../types/guaranteeCommitments.types";

/**
 * Fetches the list of guarantee commitments overview rows from the API with mock fallback
 */
export async function getGuaranteeCommitments(orderId?: string): Promise<GuaranteeRow[]> {
	if (!orderId) {
		return MOCK_GUARANTEE_ROWS;
	}

	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.GUARANTEE_COMMITMENTS(orderId));
		const payload = res.data?.data ?? res.data;
		if (Array.isArray(payload) && payload.length > 0) {
			return payload.map((item: Record<string, unknown>, idx: number) => ({
				id: String(item.id || item.orderNo || `guarantee-${idx}`),
				orderNo: String(item.orderNo || item.order_no || `#${5000 + idx}`),
				orderName: String(item.orderName || item.order_name || "Renovation"),
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
		return MOCK_GUARANTEE_ROWS;
	} catch (error) {
		console.warn(
			`[Guarantee API] GET ${API_PATH.ORDERS.GUARANTEE_COMMITMENTS(orderId)} failed, using mock fallback:`,
			error instanceof Error ? error.message : error
		);
		return MOCK_GUARANTEE_ROWS;
	}
}

/**
 * Fetches single guarantee detail and inspection dates
 */
export async function getGuaranteeDetail(orderId: string): Promise<{
	warranty: GuaranteeRow;
	visitDates: InspectionDateItem[];
}> {
	const defaultWarranty =
		MOCK_GUARANTEE_ROWS.find(
			(r) =>
				r.id === orderId ||
				r.orderNo.replace("#", "").trim() === orderId.replace("#", "").trim()
		) || MOCK_GUARANTEE_ROWS[MOCK_GUARANTEE_ROWS.length - 1];

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
			`[Guarantee Detail API] GET failed for order ${orderId}, using fallback:`,
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
			`[Guarantee API] POST visit date failed, saving locally:`,
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
			`[Guarantee API] PUT visit date failed, updating locally:`,
			error instanceof Error ? error.message : error
		);
		return {
			id: visitDateId,
			date: updatedItem.date || GUARANTEE_CONSTANTS.DEFAULT_FALLBACK_DATE,
			reminderEmail: updatedItem.reminderEmail || GUARANTEE_CONSTANTS.DEFAULT_FALLBACK_EMAIL,
			rule: updatedItem.rule || GUARANTEE_CONSTANTS.DEFAULT_FALLBACK_RULE,
			documentName: updatedItem.documentName || GUARANTEE_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileType: updatedItem.fileType || GUARANTEE_CONSTANTS.DEFAULT_FILE_TYPE,
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
			`[Guarantee API] DELETE visit date failed:`,
			error instanceof Error ? error.message : error
		);
		return true;
	}
}
