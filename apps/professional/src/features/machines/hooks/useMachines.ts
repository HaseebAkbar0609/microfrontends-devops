"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { MachineRow } from "../types/machine.types";
import { machineOverviewRepository } from "../data/machineOverviewRepository";

/** Every column in the Figma frame carries a sort control. */
export type MachineSortField =
	| "machineNo"
	| "name"
	| "factory"
	| "designation"
	| "category"
	| "internalRent"
	| "unit"
	| "purchaseDate"
	| "location"
	| "status";

export interface UseMachinesOptions {
	initialPageSize?: number;
}

/**
 * List state for the Machine overview: search, status filter, sorting,
 * pagination and the archive/delete row actions connected to shared in-memory repo.
 */
export function useMachines(options: UseMachinesOptions = {}) {
	const { initialPageSize = 10 } = options;

	const [machines, setMachines] = useState<MachineRow[]>(() =>
		machineOverviewRepository.getAllMachines()
	);
	const [searchQuery, setSearchQuery] = useState("");
	/** "" = unfiltered, so the trigger shows the "Filter" placeholder as designed. */
	const [statusFilter, setStatusFilter] = useState<string>("");
	/** null until the user picks a column, so the initial order is register order. */
	const [sortBy, setSortBy] = useState<MachineSortField | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [viewMachine, setViewMachine] = useState<MachineRow | null>(null);

	// Subscribe to shared repo updates
	useEffect(() => {
		const unsubscribe = machineOverviewRepository.subscribe(() => {
			setMachines(machineOverviewRepository.getAllMachines());
		});
		return unsubscribe;
	}, []);

	const handleSort = useCallback(
		(field: MachineSortField) => {
			if (sortBy === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy]
	);

	const deleteMachine = useCallback((machineId: string) => {
		machineOverviewRepository.deleteMachine(machineId);
		setConfirmDeleteId(null);
	}, []);

	const archiveMachine = useCallback((machineId: string) => {
		machineOverviewRepository.archiveMachine(machineId);
	}, []);

	const filteredAndSortedMachines = useMemo(() => {
		const filtered = machines.filter((machine) => {
			const query = searchQuery.trim().toLowerCase();
			if (query) {
				const haystack = [
					machine.machineNo,
					machine.name,
					machine.factory,
					machine.designation,
					machine.location,
				];
				if (!haystack.some((field) => field.toLowerCase().includes(query))) {
					return false;
				}
			}

			const filtersByStatus = statusFilter !== "" && statusFilter !== "all";
			if (filtersByStatus && machine.status !== statusFilter) {
				return false;
			}

			return true;
		});

		if (!sortBy) return filtered;

		return [...filtered].sort((a, b) => {
			const valA = (a[sortBy] ?? "").toLowerCase();
			const valB = (b[sortBy] ?? "").toLowerCase();

			let comparison = 0;
			if (valA < valB) comparison = -1;
			if (valA > valB) comparison = 1;

			return sortOrder === "asc" ? comparison : -comparison;
		});
	}, [machines, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSortedMachines.length / pageSize)
	);

	const safePage = Math.min(currentPage, totalPages);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const paginatedMachines = useMemo(() => {
		const startIdx = (safePage - 1) * pageSize;
		return filteredAndSortedMachines.slice(startIdx, startIdx + pageSize);
	}, [filteredAndSortedMachines, safePage, pageSize]);

	return {
		machines,
		paginatedMachines,
		totalCount: filteredAndSortedMachines.length,
		totalPages,
		currentPage: safePage,
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
		confirmDeleteId,
		setConfirmDeleteId,
		viewMachine,
		setViewMachine,
		deleteMachine,
		archiveMachine,
	};
}
