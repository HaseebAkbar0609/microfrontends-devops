"use client";

import { useCallback, useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type {
	PlanningQuery,
	PlanningResponse,
	PlanningStatus,
	PlanningTab,
} from "../types/planning.types";
import { getPlanning } from "../api/planning.api";
import { MOCK_PLANNING_RESPONSE } from "../data/planning.mock";

export interface UsePlanningOptions {
	initialStartDate?: string;
	initialEndDate?: string;
	initialTab?: PlanningTab;
}

export function usePlanning(options?: UsePlanningOptions) {
	const [activeTab, setActiveTab] = useState<PlanningTab>(options?.initialTab || "overview");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<PlanningStatus | "all">("all");
	const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<PlanningResponse>(MOCK_PLANNING_RESPONSE);

	// Dynamic startDate and endDate defaulting to the current month or provided initial bounds
	const [startDate, setStartDate] = useState<string>(() => {
		if (options?.initialStartDate) return options.initialStartDate;
		return format(startOfMonth(new Date()), "yyyy-MM-dd");
	});

	const [endDate, setEndDate] = useState<string>(() => {
		if (options?.initialEndDate) return options.initialEndDate;
		return format(endOfMonth(new Date()), "yyyy-MM-dd");
	});

	const setDateRange = useCallback((newStart: string, newEnd: string) => {
		setStartDate(newStart);
		setEndDate(newEnd);
	}, []);

	const fetchPlanningData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const query: PlanningQuery = {
				startDate,
				endDate,
				search: searchQuery.trim() || undefined,
				status: statusFilter !== "all" ? statusFilter : undefined,
				assigneeId: assigneeFilter !== "all" ? assigneeFilter : undefined,
			};
			const res = await getPlanning(query);
			setData(res);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to load planning data";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [startDate, endDate, searchQuery, statusFilter, assigneeFilter]);

	useEffect(() => {
		fetchPlanningData();
	}, [fetchPlanningData]);

	return {
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		assigneeFilter,
		setAssigneeFilter,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		setDateRange,
		isLoading,
		error,
		data,
		refetch: fetchPlanningData,
	};
}

export default usePlanning;
