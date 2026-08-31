"use client";

import { useEffect, useMemo, useState } from "react";
import {
	getAllPurchases,
	subscribePurchases,
	addPurchaseItem,
	deletePurchaseItem,
	archivePurchaseItem,
	restorePurchaseItem,
} from "../data/purchase.mock";
import type {
	PurchaseItem,
	PurchaseSortField,
	SortOrder,
} from "../types/purchase.types";

export function usePurchaseList() {
	const [purchases, setPurchases] = useState<PurchaseItem[]>(() => getAllPurchases());
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<PurchaseSortField>("number");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	useEffect(() => {
		const unsubscribe = subscribePurchases(() => {
			setPurchases([...getAllPurchases()]);
		});
		return unsubscribe;
	}, []);

	const handleSort = (field: PurchaseSortField) => {
		if (sortBy === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const filteredPurchases = useMemo(() => {
		// Only show non-archived purchases in active list
		let result = purchases.filter((item) => item.status !== "archived");

		// Category filter
		if (categoryFilter && categoryFilter !== "all") {
			result = result.filter(
				(item) =>
					item.category?.toLowerCase() === categoryFilter.toLowerCase()
			);
		}

		// Search query filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(item) =>
					item.number.toLowerCase().includes(query) ||
					item.type.toLowerCase().includes(query) ||
					item.brand.toLowerCase().includes(query) ||
					item.designation.toLowerCase().includes(query) ||
					item.supplier.toLowerCase().includes(query) ||
					item.address.toLowerCase().includes(query) ||
					item.postalCode.toLowerCase().includes(query) ||
					item.city.toLowerCase().includes(query) ||
					item.phone.toLowerCase().includes(query) ||
					item.email.toLowerCase().includes(query) ||
					item.file.toLowerCase().includes(query) ||
					String(item.price).includes(query)
			);
		}

		// Sort
		result.sort((a, b) => {
			const valA = a[sortBy] ?? "";
			const valB = b[sortBy] ?? "";

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			const strA = String(valA).toLowerCase();
			const strB = String(valB).toLowerCase();
			return sortOrder === "asc"
				? strA.localeCompare(strB, "sv")
				: strB.localeCompare(strA, "sv");
		});

		return result;
	}, [purchases, categoryFilter, searchQuery, sortBy, sortOrder]);

	const totalItems = filteredPurchases.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const paginatedPurchases = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredPurchases.slice(start, start + pageSize);
	}, [filteredPurchases, currentPage, pageSize]);

	const addPurchase = (item: PurchaseItem) => {
		addPurchaseItem(item);
	};

	const deletePurchase = (id: string) => {
		deletePurchaseItem(id);
	};

	const archivePurchase = (id: string) => {
		archivePurchaseItem(id);
	};

	const restorePurchase = (id: string) => {
		restorePurchaseItem(id);
	};

	return {
		purchases,
		categoryFilter,
		setCategoryFilter,
		searchQuery,
		setSearchQuery,
		sortBy,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		filteredPurchases,
		paginatedPurchases,
		totalItems,
		totalPages,
		addPurchase,
		deletePurchase,
		archivePurchase,
		restorePurchase,
	};
}
