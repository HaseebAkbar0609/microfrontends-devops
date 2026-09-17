"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
	getAtasAction,
	deleteAtaAction,
	sendAtaAction,
} from "@/api-actions/orders/ata";
import { ATA_CONSTANTS, type AtaCategory } from "../constants/ata.constants";
import type {
	AtaItem,
	AtaSortField,
	SortOrder,
	AtaSummary,
} from "../types/ata.types";

export function useAta(orderId: string = ATA_CONSTANTS.DEFAULT_ORDER_ID) {
	const [activeCategory, setActiveCategory] = useState<AtaCategory>(
		ATA_CONSTANTS.CATEGORIES.CUSTOMER
	);
	const [atas, setAtas] = useState<AtaItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortField, setSortField] = useState<AtaSortField>("date");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(ATA_CONSTANTS.DEFAULT_PAGE_SIZE);

	const loadAtas = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAtasAction(orderId);
			if (res.success && res.data) {
				setAtas(res.data);
			}
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		loadAtas();
	}, [loadAtas]);

	// Reset page when category, search or filter changes
	useEffect(() => {
		setCurrentPage(1);
	}, [activeCategory, searchQuery, statusFilter]);

	const handleSort = (field: AtaSortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const categoryFiltered = useMemo(() => {
		return atas.filter((item) => item.category === activeCategory);
	}, [atas, activeCategory]);

	const filteredRows = useMemo(() => {
		return categoryFiltered.filter((row) => {
			const query = searchQuery.toLowerCase().trim();
			const matchSearch =
				!query ||
				row.ataNumber.toLowerCase().includes(query) ||
				row.title.toLowerCase().includes(query) ||
				(row.linkedLevAta && row.linkedLevAta.toLowerCase().includes(query)) ||
				(row.supplier && row.supplier.toLowerCase().includes(query)) ||
				(row.description && row.description.toLowerCase().includes(query));

			const matchStatus =
				statusFilter === "all" || row.status.toLowerCase() === statusFilter.toLowerCase();

			return matchSearch && matchStatus;
		});
	}, [categoryFiltered, searchQuery, statusFilter]);

	const sortedRows = useMemo(() => {
		return [...filteredRows].sort((a, b) => {
			if (sortField === "amount") {
				const numA = a.amount ?? 0;
				const numB = b.amount ?? 0;
				return sortOrder === "asc" ? numA - numB : numB - numA;
			}
			const valA = a[sortField] ?? "";
			const valB = b[sortField] ?? "";
			const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
			return sortOrder === "asc" ? cmp : -cmp;
		});
	}, [filteredRows, sortField, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedRows.slice(start, start + pageSize);
	}, [sortedRows, currentPage, pageSize]);

	const summary: AtaSummary = useMemo(() => {
		const totalAtaValue = categoryFiltered.reduce((sum, item) => sum + (item.amount || 0), 0);
		const countAta = categoryFiltered.length;
		const activeAta = categoryFiltered.filter((i) => i.status !== "rejected").length;
		const pendingApproval = categoryFiltered.filter(
			(i) => i.status === "pending" || i.status === "forhandling" || i.attested === "ej_klart"
		).length;
		const approvedAta = categoryFiltered.filter(
			(i) => i.status === "ok" || i.status === "approved" || i.attested === "ja"
		).length;
		const rejectedAta = categoryFiltered.filter((i) => i.status === "rejected").length;

		return {
			totalAtaValue,
			countAta,
			activeAta,
			pendingApproval,
			approvedAta,
			rejectedAta,
		};
	}, [categoryFiltered]);

	const removeAta = async (id: string): Promise<boolean> => {
		const result = await deleteAtaAction(orderId, id);
		if (result.success) {
			setAtas((prev) => prev.filter((item) => item.id !== id));
			return true;
		}
		return false;
	};

	const sendAta = async (id: string): Promise<boolean> => {
		const result = await sendAtaAction(orderId, id);
		return !!result.success;
	};

	return {
		atas,
		activeCategory,
		setActiveCategory,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		paginatedRows,
		totalCount: filteredRows.length,
		summary,
		removeAta,
		sendAta,
		reload: loadAtas,
	};
}
