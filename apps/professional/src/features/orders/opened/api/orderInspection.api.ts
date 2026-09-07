import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	OrderInspectionItem,
	InspectionDocument,
	CreateInspectionInput,
} from "../types/orderInspection.types";

/**
 * Fetches all inspections for an order
 */
export async function getOrderInspections(
	orderId: string
): Promise<OrderInspectionItem[]> {
	const res = await axiosInstance.get(API_PATH.ORDERS.INSPECTIONS(orderId));
	if (res.data?.data && Array.isArray(res.data.data)) {
		return res.data.data;
	}
	if (Array.isArray(res.data)) {
		return res.data;
	}
	return [];
}

/**
 * Creates a new inspection for an order
 */
export async function createOrderInspection(
	orderId: string,
	newItem: CreateInspectionInput
): Promise<OrderInspectionItem> {
	const res = await axiosInstance.post(
		API_PATH.ORDERS.INSPECTIONS(orderId),
		newItem
	);
	return res.data?.data || res.data;
}

/**
 * Updates an existing inspection
 */
export async function updateOrderInspection(
	orderId: string,
	updatedItem: OrderInspectionItem
): Promise<OrderInspectionItem> {
	const res = await axiosInstance.patch(
		API_PATH.ORDERS.INSPECTION_DETAIL(orderId, updatedItem.id),
		updatedItem
	);
	return res.data?.data || res.data;
}

/**
 * Deletes an inspection
 */
export async function deleteOrderInspection(
	orderId: string,
	inspectionId: string
): Promise<boolean> {
	await axiosInstance.delete(
		API_PATH.ORDERS.INSPECTION_DETAIL(orderId, inspectionId)
	);
	return true;
}

/**
 * Uploads an inspection document/photo
 */
export async function uploadInspectionDocument(
	file: File
): Promise<InspectionDocument> {
	const formData = new FormData();
	formData.append("file", file);
	const res = await axiosInstance.post(API_PATH.ORDERS.UPLOAD_FILE, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	const data = res.data?.data || res.data;
	return {
		id: data?.id || `doc-${Date.now()}`,
		name: file.name,
		fileName: file.name,
		fileSize: file.size,
		fileType: file.name.split(".").pop()?.toLowerCase() || "pdf",
		url: data?.url || "#",
		uploadedAt: new Date().toISOString(),
	};
}
