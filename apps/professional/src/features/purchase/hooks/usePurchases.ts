"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PURCHASES } from "../data/purchases.mock";
import type { PurchaseRow } from "../types/purchase.types";

export type PurchaseSortField =
	| "purchaseNo"
	| "name"
	| "object"
	| "orderer"
	| "type"
	| "category"
	| "status";

export interface UsePurchasesOptions {
	initialPurchases?: PurchaseRow[];
	initialPageSize?: number;
}

/**
 * List state for the purchase overview: search, status filter, sorting and
 * pagination over mock rows. Mirrors `useOrders`, which backs the equivalent
 * Order overview screen.
 */
export function usePurchases(options: UsePurchasesOptions = {}) {
	const { initialPurchases = MOCK_PURCHASES, initialPageSize = 10 } = options;

	const [purchases, setPurchases] = useState<PurchaseRow[]>(initialPurchases);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<PurchaseSortField>("purchaseNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: PurchaseSortField) => {
			if (sortBy === field) {
				setSortOrder((previous) =>
					previous === "asc" ? "desc" : "asc",
				);
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	const removePurchase = useCallback((purchaseId: string) => {
		setPurchases((previous) =>
			previous.filter((purchase) => purchase.id !== purchaseId),
		);
	}, []);

	const filteredAndSorted = useMemo(() => {
		return purchases
			.filter((purchase) => {
				const query = searchQuery.trim().toLowerCase();
				if (query) {
					const haystack = [
						purchase.purchaseNo,
						purchase.name,
						purchase.object,
						purchase.orderer,
					];
					if (
						!haystack.some((field) =>
							field.toLowerCase().includes(query),
						)
					) {
						return false;
					}
				}

				return statusFilter === "all" || purchase.status === statusFilter;
			})
			.sort((a, b) => {
				const valueA = a[sortBy].toLowerCase();
				const valueB = b[sortBy].toLowerCase();

				let comparison = 0;
				if (valueA < valueB) comparison = -1;
				if (valueA > valueB) comparison = 1;

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [purchases, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSorted.length / pageSize),
	);

	const paginatedPurchases = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSorted, currentPage, pageSize]);

	return {
		purchases,
		paginatedPurchases,
		totalCount: filteredAndSorted.length,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		removePurchase,
	};
}
