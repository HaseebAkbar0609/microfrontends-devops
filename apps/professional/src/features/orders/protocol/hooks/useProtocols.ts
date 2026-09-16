"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
	getProtocolsAction,
	createProtocolAction,
	updateProtocolAction,
	deleteProtocolAction,
} from "@/api-actions/orders/protocols";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type {
	ProtocolItem,
	CreateProtocolPayload,
	ProtocolSortField,
	SortOrder,
	ProtocolSummary,
} from "../types/protocol.types";

export function useProtocols(orderId: string = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID) {
	const [protocols, setProtocols] = useState<ProtocolItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortField, setSortField] = useState<ProtocolSortField>("date");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(PROTOCOL_CONSTANTS.DEFAULT_PAGE_SIZE);

	const loadProtocols = useCallback(async () => {
		setIsLoading(true);
		const result = await getProtocolsAction(orderId);
		if (result.success && result.data) {
			setProtocols(result.data);
		}
		setIsLoading(false);
	}, [orderId]);

	useEffect(() => {
		loadProtocols();
	}, [loadProtocols]);

	const handleSort = (field: ProtocolSortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const filteredRows = useMemo(() => {
		return protocols.filter((row) => {
			if (row.isArchived) return false;

			const matchSearch =
				!searchQuery ||
				row.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(row.protocolName && row.protocolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(row.responsible && row.responsible.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchType =
				typeFilter === "all" || row.type.toLowerCase() === typeFilter.toLowerCase();

			const matchStatus =
				statusFilter === "all" || row.status.toLowerCase() === statusFilter.toLowerCase();

			return matchSearch && matchType && matchStatus;
		});
	}, [protocols, searchQuery, typeFilter, statusFilter]);

	const sortedRows = useMemo(() => {
		return [...filteredRows].sort((a, b) => {
			const valA = a[sortField] || "";
			const valB = b[sortField] || "";
			const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
			return sortOrder === "asc" ? cmp : -cmp;
		});
	}, [filteredRows, sortField, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedRows.slice(start, start + pageSize);
	}, [sortedRows, currentPage, pageSize]);

	const summary: ProtocolSummary = useMemo(() => {
		const active = protocols.filter((p) => !p.isArchived);
		const completed = active.filter((p) => p.status === "completed").length;
		const pending = active.filter((p) => p.status !== "completed").length;
		return {
			totalProtocols: active.length,
			completed,
			pending,
		};
	}, [protocols]);

	const addProtocol = async (payload: CreateProtocolPayload): Promise<ProtocolItem> => {
		const result = await createProtocolAction(orderId, { ...payload, orderId });
		if (result.success && result.data) {
			setProtocols((prev) => [result.data!, ...prev]);
			return result.data;
		}
		throw new Error(result.error || "Failed to create protocol");
	};

	const updateProtocol = async (
		id: string,
		payload: Partial<ProtocolItem>
	): Promise<ProtocolItem> => {
		const result = await updateProtocolAction(orderId, id, payload);
		if (result.success && result.data) {
			setProtocols((prev) => prev.map((p) => (p.id === id ? { ...p, ...result.data! } : p)));
			return result.data;
		}
		throw new Error(result.error || "Failed to update protocol");
	};

	const deleteProtocol = async (id: string): Promise<boolean> => {
		const result = await deleteProtocolAction(orderId, id);
		if (result.success) {
			setProtocols((prev) => prev.filter((p) => p.id !== id));
			return true;
		}
		return false;
	};

	const archiveProtocol = async (id: string): Promise<boolean> => {
		const result = await updateProtocolAction(orderId, id, { isArchived: true });
		if (result.success) {
			setProtocols((prev) => prev.map((p) => (p.id === id ? { ...p, isArchived: true } : p)));
			return true;
		}
		return false;
	};

	return {
		protocols,
		isLoading,
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
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
		addProtocol,
		updateProtocol,
		deleteProtocol,
		archiveProtocol,
		reload: loadProtocols,
	};
}
