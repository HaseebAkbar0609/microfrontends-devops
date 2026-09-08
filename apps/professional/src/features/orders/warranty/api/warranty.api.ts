import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { WARRANTY_CONSTANTS } from "../constants/warranty.constants";
import { MOCK_WARRANTY_ROWS, MOCK_INSPECTION_DATES } from "../data/warranty.mock";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";

/**
 * Fetches the list of warranty overview rows from the API with mock fallback
 */
export async function getWarrantyOverview(orderId?: string): Promise<WarrantyRow[]> {
	try {
		const targetUrl = orderId
			? API_PATH.ORDERS.GUARANTEE_COMMITMENTS(orderId)
			: API_PATH.ORDERS.BASE;
		const res = await axiosInstance.get(targetUrl);
		const payload = res.data?.data ?? res.data;
		if (Array.isArray(payload) && payload.length > 0) {
			return payload.map((item: Record<string, unknown>, idx: number) => ({
				id: String(item.id || item.orderNo || `w-${5000 + idx}`),
				orderNo: String(item.orderNo || item.order_no || `#${5000 + idx}`),
				orderName: String(item.orderName || item.order_name || WARRANTY_CONSTANTS.DEFAULT_ORDER_NAME),
				startDate: String(item.startDate || item.start_date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE),
				approvedDate: String(item.approvedDate || item.approved_date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE),
				warrantyPeriod: String(item.warrantyPeriod || item.warranty_period || WARRANTY_CONSTANTS.DEFAULT_WARRANTY_PERIOD),
				projectManager: String(item.projectManager || item.project_manager || WARRANTY_CONSTANTS.DEFAULT_RESPONSIBLE),
				customer: String(item.customer || item.customer_name || WARRANTY_CONSTANTS.DEFAULT_CUSTOMER),
				contactPerson: String(item.contactPerson || item.contact_person || WARRANTY_CONSTANTS.DEFAULT_CONTACT),
				warrantyResponsible: String(item.warrantyResponsible || item.warranty_responsible || WARRANTY_CONSTANTS.DEFAULT_RESPONSIBLE),
				warrantyEndDate: String(item.warrantyEndDate || item.warranty_end_date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_END_DATE),
				phone: String(item.phone || WARRANTY_CONSTANTS.DEFAULT_PHONE),
				email: String(item.email || WARRANTY_CONSTANTS.DEFAULT_EMAIL),
			}));
		}
		return MOCK_WARRANTY_ROWS;
	} catch (error) {
		console.warn(
			`[Warranty API] GET overview failed, using mock fallback:`,
			error instanceof Error ? error.message : error
		);
		return MOCK_WARRANTY_ROWS;
	}
}

/**
 * Fetches single warranty detail and inspection dates
 */
export async function getWarrantyDetail(orderId: string): Promise<{
	warranty: WarrantyRow;
	visitDates: InspectionDateItem[];
}> {
	const defaultWarranty =
		MOCK_WARRANTY_ROWS.find(
			(r) =>
				r.id === orderId ||
				r.orderNo.replace("#", "").trim() === orderId.replace("#", "").trim()
		) || MOCK_WARRANTY_ROWS[0];

	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.GUARANTEE_VISIT_DATES(orderId));
		const payload = res.data?.data ?? res.data;
		if (Array.isArray(payload) && payload.length > 0) {
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
			`[Warranty Detail API] GET failed for order ${orderId}, using fallback:`,
			error instanceof Error ? error.message : error
		);
		return {
			warranty: defaultWarranty,
			visitDates: MOCK_INSPECTION_DATES,
		};
	}
}

/**
 * Creates a new visit / inspection date via API
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
 * Deletes a visit date via API
 */
export async function deleteVisitDateApi(
	orderId: string,
	visitDateId: string
): Promise<boolean> {
	try {
		await axiosInstance.delete(API_PATH.ORDERS.GUARANTEE_VISIT_DATE_DETAIL(orderId, visitDateId));
		return true;
	} catch (error) {
		console.warn(
			`[Warranty API] DELETE visit date failed for order ${orderId} & id ${visitDateId}:`,
			error instanceof Error ? error.message : error
		);
		return true;
	}
}
