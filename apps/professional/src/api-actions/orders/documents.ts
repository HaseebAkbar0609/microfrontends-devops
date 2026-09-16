/**
 * TFS-668: API Actions & Storage for Order Documents
 */

import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { DOCUMENTS_CONSTANTS } from "@/features/orders/documents/constants/documents.constants";
import { INITIAL_DOCUMENTS_MOCK } from "@/features/orders/documents/data/documents.mock";
import type { OrderDocumentItem, UploadDocumentPayload } from "@/features/orders/documents/types/documents.types";

function getStorageItems(): OrderDocumentItem[] {
	if (typeof window === "undefined") {
		return INITIAL_DOCUMENTS_MOCK;
	}

	try {
		const raw = localStorage.getItem(DOCUMENTS_CONSTANTS.STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(
				DOCUMENTS_CONSTANTS.STORAGE_KEY,
				JSON.stringify(INITIAL_DOCUMENTS_MOCK)
			);
			return INITIAL_DOCUMENTS_MOCK;
		}
		return JSON.parse(raw) as OrderDocumentItem[];
	} catch (e) {
		console.error("[documents.api] Failed to read storage:", e);
		return INITIAL_DOCUMENTS_MOCK;
	}
}

function setStorageItems(items: OrderDocumentItem[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(DOCUMENTS_CONSTANTS.STORAGE_KEY, JSON.stringify(items));
	} catch (e) {
		console.error("[documents.api] Failed to write storage:", e);
	}
}

export async function getOrderDocumentsList(orderId?: string): Promise<OrderDocumentItem[]> {
	const targetOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;
	try {
		const res = await axiosInstance.get<{ data?: OrderDocumentItem[]; success?: boolean }>(
			API_PATH.ORDERS.DOCUMENTS(targetOrderId)
		);
		const items = res.data?.data;
		if (Array.isArray(items) && items.length > 0) {
			setStorageItems(items);
			return items;
		}
	} catch (err) {
		console.warn("[documents.api] Fetching from API failed, using storage cache:", err);
	}

	const items = getStorageItems();
	if (!orderId) return items;
	return items.filter((item) => !item.orderId || item.orderId === orderId || item.orderId === DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID);
}

export async function uploadDocumentFile(
	file: File,
	onProgress?: (percent: number) => void
): Promise<string | undefined> {
	try {
		const formData = new FormData();
		formData.append("file", file);
		const res = await axiosInstance.post<{ url?: string; data?: { url?: string } }>(
			API_PATH.ORDERS.UPLOAD_FILE,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total && onProgress) {
						const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						onProgress(percent);
					}
				},
			}
		);
		if (onProgress) onProgress(100);
		return res?.data?.url || res?.data?.data?.url;
	} catch (err) {
		console.warn("[documents.api] Direct media upload failed:", err);
		return undefined;
	}
}

export async function createOrderDocument(
	payload: UploadDocumentPayload,
	orderId?: string
): Promise<OrderDocumentItem> {
	const items = getStorageItems();
	const targetOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;

	let fileUrl: string | undefined;
	if (payload.file instanceof File) {
		fileUrl = await uploadDocumentFile(payload.file);
	}

	const now = new Date();
	const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
	const fileExt = payload.fileName?.split(".").pop()?.toLowerCase() || "pdf";

	const newItem: OrderDocumentItem = {
		id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		orderId: targetOrderId,
		date: dateString,
		name: payload.name.trim(),
		fileName: payload.fileName || payload.name.trim(),
		fileType: fileExt,
		fileSize: payload.file?.size || 1024000,
		fileUrl,
		drawingNumber:
			payload.drawingNumber ||
			(payload.kind === DOCUMENTS_CONSTANTS.KINDS.DRAWING ? payload.name.trim() : undefined),
		category:
			payload.category ||
			(payload.kind === DOCUMENTS_CONSTANTS.KINDS.DRAWING ? DOCUMENTS_CONSTANTS.CATEGORIES.A_DRAWING : undefined),
		createdBy: DOCUMENTS_CONSTANTS.DEFAULT_USER_NAME,
		kind: payload.kind || DOCUMENTS_CONSTANTS.KINDS.DOCUMENT,
		isArchived: false,
		createdAt: now.toISOString(),
	};

	try {
		const res = await axiosInstance.post<{ data?: OrderDocumentItem }>(
			API_PATH.ORDERS.DOCUMENTS(targetOrderId),
			{
				...newItem,
			}
		);
		if (res.data?.data) {
			const saved = res.data.data;
			const updated = [saved, ...items];
			setStorageItems(updated);
			return saved;
		}
	} catch (err) {
		console.warn("[documents.api] API create failed, persisting locally:", err);
	}

	const updated = [newItem, ...items];
	setStorageItems(updated);
	return newItem;
}

export async function archiveOrderDocument(id: string, orderId?: string): Promise<OrderDocumentItem> {
	const targetOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;
	const items = getStorageItems();
	let target: OrderDocumentItem | undefined;

	try {
		const res = await axiosInstance.patch<{ data?: OrderDocumentItem }>(
			API_PATH.ORDERS.DOCUMENT_ARCHIVE(targetOrderId, id)
		);
		if (res.data?.data) {
			target = res.data.data;
		}
	} catch (err) {
		console.warn("[documents.api] API archive failed, updating locally:", err);
	}

	const updated = items.map((item) => {
		if (item.id === id) {
			target = target || {
				...item,
				isArchived: true,
				archivedAt: new Date().toISOString(),
			};
			return target;
		}
		return item;
	});

	setStorageItems(updated);
	if (!target) throw new Error("Document item not found");
	return target;
}

export async function restoreOrderDocument(id: string, orderId?: string): Promise<OrderDocumentItem> {
	const targetOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;
	const items = getStorageItems();
	let target: OrderDocumentItem | undefined;

	try {
		const res = await axiosInstance.patch<{ data?: OrderDocumentItem }>(
			API_PATH.ORDERS.DOCUMENT_RESTORE(targetOrderId, id)
		);
		if (res.data?.data) {
			target = res.data.data;
		}
	} catch (err) {
		console.warn("[documents.api] API restore failed, updating locally:", err);
	}

	const updated = items.map((item) => {
		if (item.id === id) {
			target = target || {
				...item,
				isArchived: false,
				archivedAt: undefined,
			};
			return target;
		}
		return item;
	});

	setStorageItems(updated);
	if (!target) throw new Error("Document item not found");
	return target;
}

export async function deleteOrderDocument(id: string, orderId?: string): Promise<boolean> {
	const targetOrderId = orderId || DOCUMENTS_CONSTANTS.DEFAULT_ORDER_ID;
	try {
		await axiosInstance.delete(API_PATH.ORDERS.DOCUMENT_DETAIL(targetOrderId, id));
	} catch (err) {
		console.warn("[documents.api] API delete failed, deleting locally:", err);
	}

	const items = getStorageItems();
	const updated = items.filter((item) => item.id !== id);
	setStorageItems(updated);
	return true;
}
