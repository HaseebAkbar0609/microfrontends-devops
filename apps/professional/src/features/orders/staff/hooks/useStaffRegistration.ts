"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { STAFF_CONSTANTS } from "../constants/staff.constants";
import type {
	StaffLedgerItem,
	StaffFilterState,
	AddStaffPayload,
} from "../types/staff.types";
import {
	getStaffLedgerAction,
	addStaffRegistrationAction,
	deleteStaffRegistrationAction,
} from "@/api-actions/orders/staff";
import { extractUniqueSuppliers } from "../utils/staff.utils";

export interface UseStaffRegistrationProps {
	orderId?: string;
}

export function useStaffRegistration({
	orderId = STAFF_CONSTANTS.DEFAULT_ORDER_ID,
}: UseStaffRegistrationProps = {}) {
	const t = useTranslate();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [items, setItems] = useState<StaffLedgerItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [filters, setFilters] = useState<StaffFilterState>({
		supplier: STAFF_CONSTANTS.ALL_SUPPLIERS_VALUE,
		startDate: STAFF_CONSTANTS.DEFAULT_DATE_START,
		endDate: STAFF_CONSTANTS.DEFAULT_DATE_END,
		isLoggedInNow: false,
		searchQuery: "",
	});

	const [sortField, setSortField] = useState<keyof StaffLedgerItem | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(STAFF_CONSTANTS.STORAGE_KEYS.PAGE_SIZE);
			return saved ? Number(saved) || STAFF_CONSTANTS.DEFAULT_PAGE_SIZE : STAFF_CONSTANTS.DEFAULT_PAGE_SIZE;
		}
		return STAFF_CONSTANTS.DEFAULT_PAGE_SIZE;
	});

	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
	const [confirmDeleteState, setConfirmDeleteState] = useState<{
		isOpen: boolean;
		item: StaffLedgerItem | null;
	}>({
		isOpen: false,
		item: null,
	});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getStaffLedgerAction(orderId, filters, { page, pageSize });
			if (res.success && res.data) {
				setItems(res.data.items);
				setTotalCount(res.data.totalCount);
			}
		} catch {
			// Gracefully handled in action
		} finally {
			setIsLoading(false);
		}
	}, [orderId, filters, page, pageSize]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const uniqueSuppliers = useMemo(() => {
		return extractUniqueSuppliers(items);
	}, [items]);

	const sortedItems = useMemo(() => {
		if (!sortField) return items;
		return [...items].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];
			if (valA === undefined || valA === null) return 1;
			if (valB === undefined || valB === null) return -1;
			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}
			const comp = String(valA).localeCompare(String(valB), "sv");
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [items, sortField, sortOrder]);

	const handleSort = useCallback((field: keyof StaffLedgerItem) => {
		setSortField((currentField) => {
			if (currentField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
				return field;
			}
			setSortOrder("asc");
			return field;
		});
	}, []);

	const handleFilterSupplier = useCallback((supplier: string) => {
		setFilters((prev) => ({ ...prev, supplier }));
		setPage(1);
	}, []);

	const handleFilterDates = useCallback((startDate: string, endDate: string) => {
		setFilters((prev) => ({ ...prev, startDate, endDate }));
		setPage(1);
	}, []);

	const handleToggleLoggedInNow = useCallback((checked: boolean) => {
		setFilters((prev) => ({ ...prev, isLoggedInNow: checked }));
		setPage(1);
	}, []);

	const handleSearch = useCallback((searchQuery: string) => {
		setFilters((prev) => ({ ...prev, searchQuery }));
		setPage(1);
	}, []);

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handlePageSizeChange = useCallback((newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
		if (typeof window !== "undefined") {
			localStorage.setItem(STAFF_CONSTANTS.STORAGE_KEYS.PAGE_SIZE, String(newPageSize));
		}
	}, []);

	const handleAddStaff = useCallback(
		async (payload: AddStaffPayload) => {
			setIsSubmitting(true);
			try {
				const res = await addStaffRegistrationAction(orderId, payload);
				if (res.success && res.data) {
					setItems((prev) => [res.data as StaffLedgerItem, ...prev]);
					setTotalCount((prev) => prev + 1);
					showToast("success", t(localizationConstants.staffAddSuccess));
					setIsAddModalOpen(false);
				} else {
					showToast("error", res.error || t(localizationConstants.staffGenericError));
				}
			} catch {
				showToast("error", t(localizationConstants.staffGenericError));
			} finally {
				setIsSubmitting(false);
			}
		},
		[orderId, t]
	);

	const handleOpenDeleteDialog = useCallback((item: StaffLedgerItem) => {
		setConfirmDeleteState({
			isOpen: true,
			item,
		});
	}, []);

	const handleCloseDeleteDialog = useCallback(() => {
		setConfirmDeleteState({
			isOpen: false,
			item: null,
		});
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		if (!confirmDeleteState.item) return;
		const staffId = confirmDeleteState.item.id;
		setIsSubmitting(true);
		try {
			const res = await deleteStaffRegistrationAction(orderId, staffId);
			if (res.success) {
				setItems((prev) => prev.filter((s) => s.id !== staffId));
				setTotalCount((prev) => Math.max(0, prev - 1));
				showToast("success", t(localizationConstants.staffDeleteSuccess));
				handleCloseDeleteDialog();
			} else {
				showToast("error", res.error || t(localizationConstants.staffGenericError));
			}
		} catch {
			showToast("error", t(localizationConstants.staffGenericError));
		} finally {
			setIsSubmitting(false);
		}
	}, [orderId, confirmDeleteState.item, t, handleCloseDeleteDialog]);

	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	return {
		isLoading,
		isSubmitting,
		items: sortedItems,
		totalCount,
		page,
		pageSize,
		totalPages,
		filters,
		sortField,
		sortOrder,
		uniqueSuppliers,
		isAddModalOpen,
		confirmDeleteState,
		setIsAddModalOpen,
		handleSort,
		handleFilterSupplier,
		handleFilterDates,
		handleToggleLoggedInNow,
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
		handleAddStaff,
		handleOpenDeleteDialog,
		handleCloseDeleteDialog,
		handleConfirmDelete,
		refreshData: loadData,
	};
}
