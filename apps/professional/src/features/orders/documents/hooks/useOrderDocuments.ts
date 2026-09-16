/**
 * TFS-668: Custom hook for Order Documents Management
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
	getOrderDocumentsList,
	createOrderDocument,
	archiveOrderDocument,
	restoreOrderDocument,
	deleteOrderDocument,
} from "@/api-actions/orders/documents";
import { DOCUMENTS_CONSTANTS, type DocumentsSubTab } from "../constants/documents.constants";
import type { OrderDocumentItem, UploadDocumentPayload } from "../types/documents.types";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function useOrderDocuments(orderId?: string) {
	const t = useTranslate();
	const [items, setItems] = useState<OrderDocumentItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [subtab, setSubtab] = useState<DocumentsSubTab>(DOCUMENTS_CONSTANTS.SUBTABS.DOCUMENTS);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>(DOCUMENTS_CONSTANTS.FILTER_ALL);
	const [sortField, setSortField] = useState<"date" | "name" | "fileName" | "drawingNumber" | "category" | "createdBy">("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(DOCUMENTS_CONSTANTS.DEFAULT_PAGE_SIZE);

	// Dialog states
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<OrderDocumentItem | null>(null);

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getOrderDocumentsList(orderId);
			setItems(data);
		} catch (e) {
			console.error("[useOrderDocuments] Error loading data:", e);
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	// Reset page when search, filter or subtab changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, categoryFilter, subtab]);

	const handleSort = useCallback(
		(field: "date" | "name" | "fileName" | "drawingNumber" | "category" | "createdBy") => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder("asc");
			}
		},
		[sortField]
	);

	// Filter and sort items based on active subtab
	const filteredItems = useMemo(() => {
		return items
			.filter((item) => {
				// Subtab filtering
				if (subtab === DOCUMENTS_CONSTANTS.SUBTABS.ARCHIVE) {
					if (!item.isArchived) return false;
				} else {
					if (item.isArchived) return false;
					if (subtab === DOCUMENTS_CONSTANTS.SUBTABS.DOCUMENTS && item.kind !== "handling") return false;
					if (subtab === DOCUMENTS_CONSTANTS.SUBTABS.DRAWINGS && item.kind !== "ritning") return false;
				}

				// Category filter
				if (categoryFilter !== DOCUMENTS_CONSTANTS.FILTER_ALL && item.category && item.category !== categoryFilter) {
					return false;
				}

				// Search query
				if (searchQuery.trim()) {
					const query = searchQuery.toLowerCase().trim();
					const matchName = item.name?.toLowerCase().includes(query);
					const matchFileName = item.fileName?.toLowerCase().includes(query);
					const matchDrawingNumber = item.drawingNumber?.toLowerCase().includes(query);
					const matchCategory = item.category?.toLowerCase().includes(query);
					const matchCreatedBy = item.createdBy?.toLowerCase().includes(query);
					const matchDate = item.date?.toLowerCase().includes(query);
					return Boolean(matchName || matchFileName || matchDrawingNumber || matchCategory || matchCreatedBy || matchDate);
				}

				return true;
			})
			.sort((a, b) => {
				let aVal = a[sortField] || "";
				let bVal = b[sortField] || "";

				if (sortField === "date") {
					aVal = a.date || "";
					bVal = b.date || "";
				}

				const cmp = String(aVal).localeCompare(String(bVal), "sv");
				return sortOrder === "asc" ? cmp : -cmp;
			});
	}, [items, subtab, categoryFilter, searchQuery, sortField, sortOrder]);

	// Paginated items
	const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredItems.slice(start, start + pageSize);
	}, [filteredItems, currentPage, pageSize]);

	// Unique categories available for filter dropdown
	const availableCategories = useMemo(() => {
		const cats = new Set<string>();
		items.forEach((item) => {
			if (item.category) cats.add(item.category);
		});
		return Array.from(cats);
	}, [items]);

	const handleUpload = useCallback(
		async (payload: UploadDocumentPayload) => {
			try {
				const currentKind =
					subtab === DOCUMENTS_CONSTANTS.SUBTABS.DRAWINGS
						? "ritning"
						: "handling";

				await createOrderDocument(
					{
						...payload,
						kind: payload.kind || currentKind,
					},
					orderId
				);
				showToast("success", t(localizationConstants.orderHandlingarToastCreated));
				setIsUploadModalOpen(false);
				await loadData();
			} catch (e) {
				console.error("[useOrderDocuments] Upload error:", e);
			}
		},
		[subtab, orderId, t, loadData]
	);

	const handleArchive = useCallback(
		async (id: string) => {
			try {
				await archiveOrderDocument(id, orderId);
				showToast("success", t(localizationConstants.orderHandlingarToastArchived));
				await loadData();
			} catch (e) {
				console.error("[useOrderDocuments] Archive error:", e);
			}
		},
		[orderId, t, loadData]
	);

	const handleRestore = useCallback(
		async (id: string) => {
			try {
				await restoreOrderDocument(id, orderId);
				showToast("success", t(localizationConstants.orderHandlingarToastRestored));
				await loadData();
			} catch (e) {
				console.error("[useOrderDocuments] Restore error:", e);
			}
		},
		[orderId, t, loadData]
	);

	const confirmDelete = useCallback((item: OrderDocumentItem) => {
		setItemToDelete(item);
		setIsDeleteModalOpen(true);
	}, []);

	const handleDelete = useCallback(async () => {
		if (!itemToDelete) return;
		try {
			await deleteOrderDocument(itemToDelete.id, orderId);
			showToast("success", t(localizationConstants.orderHandlingarToastDeleted));
			setIsDeleteModalOpen(false);
			setItemToDelete(null);
			await loadData();
		} catch (e) {
			console.error("[useOrderDocuments] Delete error:", e);
		}
	}, [itemToDelete, orderId, t, loadData]);

	const handlePrint = useCallback(() => {
		if (typeof window !== "undefined") {
			window.print();
		}
	}, []);

	return {
		items: paginatedItems,
		totalCount: filteredItems.length,
		isLoading,
		subtab,
		setSubtab,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		availableCategories,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		isUploadModalOpen,
		setIsUploadModalOpen,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		itemToDelete,
		confirmDelete,
		handleUpload,
		handleArchive,
		handleRestore,
		handleDelete,
		handlePrint,
		reload: loadData,
	};
}
