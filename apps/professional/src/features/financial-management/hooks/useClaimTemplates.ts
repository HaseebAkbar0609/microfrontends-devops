"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
	ClaimTemplate,
	ClaimTemplateFormData,
	ClaimTemplateSortColumn,
} from "../types/claims.types";
import {
	DEFAULT_CLAIM_TEMPLATES_PAGE_SIZE,
} from "../constants/claims.constants";
import { claimsRepository } from "../utils/claimsRepository";

export function useClaimTemplates() {
	const [templates, setTemplates] = useState<ClaimTemplate[]>(() =>
		claimsRepository.getTemplates(),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortColumn, setSortColumn] = useState<ClaimTemplateSortColumn>("id");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(DEFAULT_CLAIM_TEMPLATES_PAGE_SIZE);
	const [deleteTarget, setDeleteTarget] = useState<ClaimTemplate | null>(null);

	useEffect(() => {
		const unsubscribe = claimsRepository.subscribe(() => {
			setTemplates(claimsRepository.getTemplates());
		});
		return () => {
			unsubscribe();
		};
	}, []);

	const filteredTemplates = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return templates;

		return templates.filter((tpl) => {
			const matchId = tpl.id.toLowerCase().includes(query);
			const matchName = tpl.name.toLowerCase().includes(query);
			const matchTitle = tpl.title.toLowerCase().includes(query);
			const matchDesc = tpl.description.toLowerCase().includes(query);
			const matchDate = tpl.updatedAt.toLowerCase().includes(query) || tpl.date.toLowerCase().includes(query);
			return matchId || matchName || matchTitle || matchDesc || matchDate;
		});
	}, [templates, searchQuery]);

	const sortedTemplates = useMemo(() => {
		return [...filteredTemplates].sort((a, b) => {
			const valA = a[sortColumn] || "";
			const valB = b[sortColumn] || "";

			// Natural sort for IDs e.g. #MA001 vs #MA002
			if (sortColumn === "id") {
				const numA = parseInt(valA.replace(/\D/g, "") || "0", 10);
				const numB = parseInt(valB.replace(/\D/g, "") || "0", 10);
				if (numA !== numB) {
					return sortDirection === "asc" ? numA - numB : numB - numA;
				}
			}

			const comp = valA.localeCompare(valB, "sv", { sensitivity: "base" });
			return sortDirection === "asc" ? comp : -comp;
		});
	}, [filteredTemplates, sortColumn, sortDirection]);

	const totalItems = sortedTemplates.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const paginatedTemplates = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedTemplates.slice(start, start + pageSize);
	}, [sortedTemplates, currentPage, pageSize]);

	const handleSort = useCallback((col: ClaimTemplateSortColumn) => {
		setSortColumn((prevCol) => {
			if (prevCol === col) {
				setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
				return col;
			}
			setSortDirection("asc");
			return col;
		});
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	}, [totalPages]);

	const handlePageSizeChange = useCallback((newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1);
	}, []);

	const createTemplate = useCallback((data: ClaimTemplateFormData) => {
		return claimsRepository.createTemplate(data);
	}, []);

	const updateTemplate = useCallback((id: string, data: Partial<ClaimTemplateFormData>) => {
		return claimsRepository.updateTemplate(id, data);
	}, []);

	const deleteTemplate = useCallback((id: string) => {
		return claimsRepository.deleteTemplate(id);
	}, []);

	const handleDeleteConfirm = useCallback(() => {
		if (deleteTarget) {
			claimsRepository.deleteTemplate(deleteTarget.id);
			setDeleteTarget(null);
		}
	}, [deleteTarget]);

	return {
		templates: paginatedTemplates,
		allTemplates: templates,
		totalItems,
		totalPages,
		currentPage,
		pageSize,
		searchQuery,
		sortColumn,
		sortDirection,
		deleteTarget,
		setSearchQuery: (q: string) => {
			setSearchQuery(q);
			setCurrentPage(1);
		},
		handleSort,
		setCurrentPage: handlePageChange,
		setPageSize: handlePageSizeChange,
		setDeleteTarget,
		handleDeleteConfirm,
		createTemplate,
		updateTemplate,
		deleteTemplate,
	};
}

export default useClaimTemplates;
