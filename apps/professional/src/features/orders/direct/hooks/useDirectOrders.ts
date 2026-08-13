"use client";

import { useState, useMemo, useCallback } from "react";
import { MOCK_DIRECT_ORDERS } from "../data/directOrders.mock";
import type { DirectOrderRow } from "../types/directOrder.types";

export type DirectOrderSortField = "serialNo" | "orderName" | "customer" | "start" | "status";

export function useDirectOrders() {
	const [orders, setOrders] = useState<DirectOrderRow[]>(MOCK_DIRECT_ORDERS);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<DirectOrderSortField>("serialNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: DirectOrderSortField) => {
			if (sortBy === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy]
	);

	const addDirectOrder = useCallback((newOrder: DirectOrderRow) => {
		setOrders((prev) => [newOrder, ...prev]);
	}, []);

	const deleteDirectOrder = useCallback((orderId: string) => {
		setOrders((prev) => prev.filter((o) => o.id !== orderId));
	}, []);

	const filteredAndSortedOrders = useMemo(() => {
		return orders
			.filter((order) => {
				const query = searchQuery.trim().toLowerCase();
				if (query) {
					const matchesSerial = order.serialNo.toLowerCase().includes(query);
					const matchesName = order.orderName.toLowerCase().includes(query);
					const matchesCustomer = order.customer.toLowerCase().includes(query);
					if (!matchesSerial && !matchesName && !matchesCustomer) {
						return false;
					}
				}

				if (statusFilter !== "all" && order.status !== statusFilter) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				let valA = a[sortBy] || "";
				let valB = b[sortBy] || "";

				if (typeof valA === "string") valA = valA.toLowerCase();
				if (typeof valB === "string") valB = valB.toLowerCase();

				let comparison = 0;
				if (valA < valB) comparison = -1;
				if (valA > valB) comparison = 1;

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(filteredAndSortedOrders.length / pageSize));
	const paginatedOrders = useMemo(() => {
		const startIdx = (currentPage - 1) * pageSize;
		return filteredAndSortedOrders.slice(startIdx, startIdx + pageSize);
	}, [filteredAndSortedOrders, currentPage, pageSize]);

	return {
		orders,
		paginatedOrders,
		totalCount: filteredAndSortedOrders.length,
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
		addDirectOrder,
		deleteDirectOrder,
	};
}
