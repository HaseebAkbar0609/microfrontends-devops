"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PURCHASE_SUPPLIERS } from "../data/purchaseSuppliers.mock";
import type { PurchaseSupplierRow } from "../types/purchase.types";

export type PurchaseSupplierSortField =
	| "name"
	| "orderer"
	| "postalCode"
	| "city"
	| "email"
	| "phone";

export interface UsePurchaseSuppliersOptions {
	initialSuppliers?: PurchaseSupplierRow[];
	initialPageSize?: number;
}

/**
 * List state for the module's supplier tab: search, status filter, sorting and
 * pagination. Mirrors `usePurchases`, which backs the sibling overview list.
 */
export function usePurchaseSuppliers(
	options: UsePurchaseSuppliersOptions = {},
) {
	const {
		initialSuppliers = MOCK_PURCHASE_SUPPLIERS,
		initialPageSize = 10,
	} = options;

	const [suppliers] = useState<PurchaseSupplierRow[]>(initialSuppliers);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<PurchaseSupplierSortField>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: PurchaseSupplierSortField) => {
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

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return suppliers
			.filter((supplier) => {
				if (query) {
					const haystack = [
						supplier.name,
						supplier.orderer,
						supplier.city,
						supplier.email,
					];
					if (
						!haystack.some((field) =>
							field.toLowerCase().includes(query),
						)
					) {
						return false;
					}
				}

				return (
					statusFilter === "all" || supplier.status === statusFilter
				);
			})
			.sort((a, b) => {
				const valueA = a[sortBy].toLowerCase();
				const valueB = b[sortBy].toLowerCase();

				let comparison = 0;
				if (valueA < valueB) comparison = -1;
				if (valueA > valueB) comparison = 1;

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [suppliers, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSorted.length / pageSize),
	);

	const paginatedSuppliers = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSorted, currentPage, pageSize]);

	return {
		paginatedSuppliers,
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
	};
}
