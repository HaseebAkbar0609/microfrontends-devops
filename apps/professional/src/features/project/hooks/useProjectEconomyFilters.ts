"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { ProjectEconomyItem } from "../data/projectEconomy.types";
import { listProfessionalProjects } from "../services/professionalProjectService";
import {
	getTotalTbContribution,
	listEconomyRows,
} from "../services/projectEconomyService";

export type ProjectEconomySortField = keyof Omit<ProjectEconomyItem, "id">;

export function useProjectEconomyFilters() {
	const { company, isAuthenticated } = useAuthStatus();
	const query = useQuery({
		queryKey: ["professional-projects", company?.id, false],
		queryFn: () => listProfessionalProjects(false),
		enabled: Boolean(company?.id && isAuthenticated),
		retry: false,
	});
	const rows = useMemo(() => listEconomyRows(query.data ?? []), [query.data]);
	const { sortField, sortDir, toggleSort } =
		useTableSort<ProjectEconomySortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const sorted = useMemo(
		() =>
			sortItems(
				rows,
				sortField,
				sortDir,
				(item, field) => item[field as ProjectEconomySortField],
			),
		[rows, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paged = useMemo(
		() => sorted.slice((page - 1) * pageSize, page * pageSize),
		[sorted, page, pageSize],
	);

	const setPageSize = (size: number) => {
		setPageSizeState(size);
		setPage(1);
	};

	return {
		isLoading: query.isLoading,
		isError: query.isError,
		refresh: query.refetch,
		totalTbContribution: getTotalTbContribution(),
		sortField,
		sortDir,
		toggleSort,
		page,
		setPage,
		pageSize,
		setPageSize,
		paged,
		totalPages,
	};
}
