"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PURCHASE_COMPLAINTS } from "../data/purchaseComplaints.mock";
import type { PurchaseComplaintRow } from "../types/purchase.types";

export type PurchaseComplaintSortField =
	| "complaintNo"
	| "purchaseNo"
	| "object"
	| "name"
	| "supplier"
	| "type"
	| "date"
	| "status";

export interface UsePurchaseComplaintsOptions {
	initialComplaints?: PurchaseComplaintRow[];
	initialPageSize?: number;
}

/**
 * List state for the complaints screen: search, status filter, sorting,
 * pagination, plus archive and delete. Mirrors `usePurchaseSuppliers`, which
 * backs the sibling supplier list.
 */
export function usePurchaseComplaints(
	options: UsePurchaseComplaintsOptions = {},
) {
	const {
		initialComplaints = MOCK_PURCHASE_COMPLAINTS,
		initialPageSize = 10,
	} = options;

	const [complaints, setComplaints] =
		useState<PurchaseComplaintRow[]>(initialComplaints);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] =
		useState<PurchaseComplaintSortField>("complaintNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: PurchaseComplaintSortField) => {
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

	const archiveComplaint = useCallback((id: string) => {
		setComplaints((previous) =>
			previous.map((complaint) =>
				complaint.id === id
					? { ...complaint, archived: true }
					: complaint,
			),
		);
	}, []);

	const removeComplaint = useCallback((id: string) => {
		setComplaints((previous) =>
			previous.filter((complaint) => complaint.id !== id),
		);
	}, []);

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return complaints
			.filter((complaint) => {
				if (complaint.archived) return false;

				if (query) {
					const haystack = [
						complaint.complaintNo,
						complaint.purchaseNo,
						complaint.name,
						complaint.supplier,
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
					statusFilter === "all" || complaint.status === statusFilter
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
	}, [complaints, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSorted.length / pageSize),
	);

	const paginatedComplaints = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSorted, currentPage, pageSize]);

	return {
		paginatedComplaints,
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
		archiveComplaint,
		removeComplaint,
	};
}
