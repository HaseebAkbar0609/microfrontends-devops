"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PURCHASE_GOODS_RECEPTIONS } from "../data/purchaseGoodsReception.mock";
import type {
	PurchaseGoodsReceptionOrderType,
	PurchaseGoodsReceptionRow,
} from "../types/purchase.types";

/** Order-type filter value: a concrete type, or "all" for no filtering. */
export type PurchaseGoodsReceptionTypeFilter =
	| PurchaseGoodsReceptionOrderType
	| "all";

export type PurchaseGoodsReceptionSortField =
	| "object"
	| "purchaseNo"
	| "name"
	| "supplier"
	| "expectedDelivery"
	| "orderType";

/**
 * Order type sorts by how complete the delivery is, not alphabetically.
 * Sorting the raw union would read as "backorder, normal, partial", and sorting
 * the labels would reorder itself when the language changes.
 */
const ORDER_TYPE_RANK: Record<PurchaseGoodsReceptionOrderType, number> = {
	normal: 0,
	partial: 1,
	backorder: 2,
};

export interface UsePurchaseGoodsReceptionOptions {
	initialReceptions?: PurchaseGoodsReceptionRow[];
	initialPageSize?: number;
}

/**
 * List state for the Godsmottagning screen: search, order-type filter, sorting,
 * pagination, plus archive and delete. Mirrors `usePurchaseComplaints`, which
 * backs the sibling complaints list.
 */
export function usePurchaseGoodsReception(
	options: UsePurchaseGoodsReceptionOptions = {},
) {
	const {
		initialReceptions = MOCK_PURCHASE_GOODS_RECEPTIONS,
		initialPageSize = 10,
	} = options;

	const [receptions, setReceptions] =
		useState<PurchaseGoodsReceptionRow[]>(initialReceptions);
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] =
		useState<PurchaseGoodsReceptionTypeFilter>("all");
	const [sortBy, setSortBy] =
		useState<PurchaseGoodsReceptionSortField>("purchaseNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: PurchaseGoodsReceptionSortField) => {
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

	/**
	 * Adds a reception created from the list dialog. The id is a slug of the
	 * purchase number, de-duplicated so two receptions on the same purchase still
	 * get distinct record routes.
	 */
	const addReception = useCallback(
		(draft: Omit<PurchaseGoodsReceptionRow, "id" | "archived">) => {
			setReceptions((previous) => {
				const base =
					draft.purchaseNo
						.toLowerCase()
						.replace(/[^a-z0-9_-]+/g, "-")
						.replace(/^-+|-+$/g, "") || "gm";

				const taken = new Set(previous.map((row) => row.id));
				let id = base;
				for (let suffix = 2; taken.has(id); suffix += 1) {
					id = `${base}-${suffix}`;
				}

				return [{ ...draft, id, archived: false }, ...previous];
			});
			setCurrentPage(1);
		},
		[],
	);

	const archiveReception = useCallback((id: string) => {
		setReceptions((previous) =>
			previous.map((reception) =>
				reception.id === id
					? { ...reception, archived: true }
					: reception,
			),
		);
	}, []);

	const removeReception = useCallback((id: string) => {
		setReceptions((previous) =>
			previous.filter((reception) => reception.id !== id),
		);
	}, []);

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return receptions
			.filter((reception) => {
				if (reception.archived) return false;

				if (query) {
					const haystack = [
						reception.purchaseNo,
						reception.name,
						reception.supplier,
						reception.object,
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
					typeFilter === "all" || reception.orderType === typeFilter
				);
			})
			.sort((a, b) => {
				const comparison =
					sortBy === "orderType"
						? ORDER_TYPE_RANK[a.orderType] -
							ORDER_TYPE_RANK[b.orderType]
						: (a[sortBy] ?? "").localeCompare(
								b[sortBy] ?? "",
								undefined,
								{ sensitivity: "base", numeric: true },
							);

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [receptions, searchQuery, typeFilter, sortBy, sortOrder]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSorted.length / pageSize),
	);

	const paginatedReceptions = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSorted, currentPage, pageSize]);

	return {
		paginatedReceptions,
		totalCount: filteredAndSorted.length,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
		sortBy,
		sortOrder,
		handleSort,
		addReception,
		archiveReception,
		removeReception,
	};
}
