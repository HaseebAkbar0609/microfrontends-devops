"use client";

import { useState, useMemo, useCallback } from "react";
import { MOCK_ORDERS } from "../data/orders.mock";
import type { OrderRow } from "../types/order.types";

export type SortField =
	| "orderNo"
	| "orderName"
	| "customer"
	| "type"
	| "status"
	| "orderSum"
	| "projectManager"
	| "start"
	| "end";

export interface UseOrdersOptions {
	initialOrders?: OrderRow[];
	initialPageSize?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
	const { initialOrders = MOCK_ORDERS, initialPageSize = 10 } = options;

	const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = useCallback(
		(field: SortField) => {
			if (sortBy === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy]
	);

	const deleteOrder = useCallback((orderId: string) => {
		setOrders((prev) => prev.filter((o) => o.id !== orderId));
	}, []);

	const filteredAndSortedOrders = useMemo(() => {
		return orders
			.filter((order) => {
				const query = searchQuery.trim().toLowerCase();
				if (query) {
					const matchesOrderNo = order.orderNo.toLowerCase().includes(query);
					const matchesName = order.orderName.toLowerCase().includes(query);
					const matchesCustomer = order.customer.toLowerCase().includes(query);
					const matchesPM = order.projectManager.toLowerCase().includes(query);
					if (!matchesOrderNo && !matchesName && !matchesCustomer && !matchesPM) {
						return false;
					}
				}

				if (statusFilter !== "all" && order.status !== statusFilter) {
					return false;
				}

				if (typeFilter !== "all" && order.type !== typeFilter) {
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
	}, [orders, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

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
		typeFilter,
		setTypeFilter,
		sortBy,
		sortOrder,
		handleSort,
		deleteOrder,
	};
}
