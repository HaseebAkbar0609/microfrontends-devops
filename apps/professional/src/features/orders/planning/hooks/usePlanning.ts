"use client";

import { useCallback, useEffect, useState } from "react";
import type {
	PlanningQuery,
	PlanningResponse,
	PlanningStatus,
	PlanningTab,
} from "../types/planning.types";
import { getPlanning } from "../api/planning.api";
import { MOCK_PLANNING_RESPONSE } from "../data/planning.mock";

export function usePlanning() {
	const [activeTab, setActiveTab] = useState<PlanningTab>("overview");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<PlanningStatus | "all">("all");
	const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<PlanningResponse>(MOCK_PLANNING_RESPONSE);

	const [startDate] = useState<string>("2024-03-01");
	const [endDate] = useState<string>("2024-03-28");

	const fetchPlanningData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const query: PlanningQuery = {
				startDate,
				endDate,
				search: searchQuery,
				status: statusFilter,
				assigneeId: assigneeFilter !== "all" ? assigneeFilter : undefined,
			};
			const res = await getPlanning(query);
			setData(res);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load planning data");
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
		isLoading,
		error,
		data,
		refetch: fetchPlanningData,
	};
}
