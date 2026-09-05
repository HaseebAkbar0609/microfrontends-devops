"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	RotRutItem,
	RotRutStatus,
	RotRutType,
	RotRutPeriod,
} from "../types/rotRut.types";
import { rotRutRepository } from "../utils/rotRutRepository";
import { DEFAULT_PAGE_SIZE } from "../constants/rotRut.constants";

export function useRotRut() {
	const { t } = useTranslation();
	const [items, setItems] = useState<RotRutItem[]>(() => rotRutRepository.getAll());
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<RotRutStatus | "all">("all");
	const [typeFilter, setTypeFilter] = useState<RotRutType | "all">("all");
	const [periodFilter, setPeriodFilter] = useState<RotRutPeriod>("all");
	const [sortBy, setSortBy] = useState<keyof RotRutItem>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

	const [pendingSubmitIds, setPendingSubmitIds] = useState<string[]>([]);
	const [resubmitItem, setResubmitItem] = useState<RotRutItem | null>(null);
	const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = rotRutRepository.subscribe(() => {
			setItems(rotRutRepository.getAll());
		});
		return unsubscribe;
	}, []);

	const kpiSummary = useMemo(() => rotRutRepository.getKpiSummary(items), [items]);
	const customerLimits = useMemo(() => rotRutRepository.getCustomerLimits(items), [items]);

	const filteredItems = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const currentYear = new Date().getFullYear();

		return items.filter((item) => {
			if (statusFilter !== "all" && item.status !== statusFilter) return false;
			if (typeFilter !== "all" && item.type !== typeFilter) return false;

			if (periodFilter === "this_year") {
				const itemYear = new Date(item.createdAt).getFullYear();
				if (itemYear !== currentYear) return false;
			} else if (periodFilter === "last_year") {
				const itemYear = new Date(item.createdAt).getFullYear();
				if (itemYear !== currentYear - 1) return false;
			} else if (periodFilter === "this_month") {
				const itemDate = new Date(item.createdAt);
				const now = new Date();
				if (
					itemDate.getFullYear() !== now.getFullYear() ||
					itemDate.getMonth() !== now.getMonth()
				) {
					return false;
				}
			}

			if (query) {
				const matchName = item.customerName.toLowerCase().includes(query);
				const matchInvoice = item.invoiceNo.toLowerCase().includes(query);
				const matchProperty = item.propertyId.toLowerCase().includes(query);
				const matchPid = item.customerPersonalId.toLowerCase().includes(query);
				if (!matchName && !matchInvoice && !matchProperty && !matchPid) {
					return false;
				}
			}

			return true;
		});
	}, [items, searchQuery, statusFilter, typeFilter, periodFilter]);

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			const aVal = a[sortBy];
			const bVal = b[sortBy];

			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
			}

			const aStr = String(aVal ?? "");
			const bStr = String(bVal ?? "");
			return sortOrder === "asc"
				? aStr.localeCompare(bStr, "sv")
				: bStr.localeCompare(aStr, "sv");
		});
	}, [filteredItems, sortBy, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	}, [sortedItems, currentPage, pageSize]);

	const handleSort = useCallback((field: keyof RotRutItem) => {
		setSortBy((prevField) => {
			if (prevField === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
				return field;
			}
			setSortOrder("desc");
			return field;
		});
	}, []);

	const toggleSelect = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const toggleSelectAll = useCallback(() => {
		setSelectedIds((prev) => {
			if (prev.size === paginatedItems.length && paginatedItems.length > 0) {
				return new Set();
			}
			return new Set(paginatedItems.map((item) => item.id));
		});
	}, [paginatedItems]);

	const handleBatchSubmit = useCallback(() => {
		const eligibleIds = items
			.filter((i) => selectedIds.has(i.id) && (i.status === "pending" || i.status === "rejected"))
			.map((i) => i.id);
		if (eligibleIds.length === 0) return;
		setPendingSubmitIds(eligibleIds);
		setIsSubmitDialogOpen(true);
	}, [items, selectedIds]);

	const handleSingleSubmit = useCallback((id: string) => {
		setPendingSubmitIds([id]);
		setIsSubmitDialogOpen(true);
	}, []);

	const submitSummary = useMemo(() => {
		const targetSet = new Set(pendingSubmitIds);
		const targetItems = items.filter((i) => targetSet.has(i.id));
		const count = targetItems.length;
		const amount = targetItems.reduce((acc, curr) => acc + curr.deductionAmount, 0);
		return { count, amount };
	}, [items, pendingSubmitIds]);

	const executeBatchSubmit = useCallback(() => {
		if (pendingSubmitIds.length === 0) return;
		rotRutRepository.batchSubmitToSkatteverket(pendingSubmitIds);
		setSelectedIds((prev) => {
			const next = new Set(prev);
			pendingSubmitIds.forEach((id) => next.delete(id));
			return next;
		});
		setPendingSubmitIds([]);
		setIsSubmitDialogOpen(false);
		toast.success(t(localizationConstants.rotRutSubmitSuccessToast));
	}, [pendingSubmitIds, t]);

	const handleResubmit = useCallback((id: string, updatedFields: Partial<RotRutItem>) => {
		rotRutRepository.resubmitDeduction(id, updatedFields);
		setResubmitItem(null);
		toast.success(t(localizationConstants.rotRutSubmitSuccessToast));
	}, [t]);

	const handleDelete = useCallback((id: string) => {
		rotRutRepository.deleteDeduction(id);
		setDeleteConfirmId(null);
		if (resubmitItem?.id === id) setResubmitItem(null);
	}, [resubmitItem]);

	const handleExportExcel = useCallback(() => {
		const headers = [
			"Fakturanr",
			"Kund",
			"Personnummer",
			"Fastighetsbeteckning",
			"Typ",
			"Arbetskostnad",
			"Skatteavdrag (30%)",
			"Status",
			"Inskickad",
			"Referens",
		];

		const rows = sortedItems.map((item) => [
			item.invoiceNo,
			`"${item.customerName}"`,
			item.customerPersonalIdMasked,
			`"${item.propertyId}"`,
			item.type.toUpperCase(),
			item.laborCost,
			item.deductionAmount,
			item.status,
			item.submissionDate || "",
			item.skatteverketReference || "",
		]);

		const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `rot_rut_avdrag_${new Date().toISOString().split("T")[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, [sortedItems]);

	const handlePrint = useCallback(() => {
		if (typeof window !== "undefined") {
			window.print();
		}
	}, []);

	return {
		items: paginatedItems,
		totalCount: filteredItems.length,
		kpiSummary,
		customerLimits,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		typeFilter,
		setTypeFilter,
		periodFilter,
		setPeriodFilter,
		sortBy,
		sortOrder,
		handleSort,
		selectedIds,
		toggleSelect,
		toggleSelectAll,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		resubmitItem,
		setResubmitItem,
		isSubmitDialogOpen,
		setIsSubmitDialogOpen,
		deleteConfirmId,
		setDeleteConfirmId,
		pendingSubmitIds,
		handleBatchSubmit,
		handleSingleSubmit,
		executeBatchSubmit,
		submitSummary,
		handleResubmit,
		handleDelete,
		handleExportExcel,
		handlePrint,
	};
}
