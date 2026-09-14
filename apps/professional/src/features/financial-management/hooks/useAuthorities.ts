"use client";

import { useState, useMemo, useCallback } from "react";
import type {
	AuthorityItem,
	AuthorityFormData,
	AuthoritySortField,
	AuthoritySortOrder,
} from "../types/authorities.types";
import { authoritiesRepository } from "../utils/authoritiesRepository";
import { AUTHORITIES_DEFAULT_PAGE_SIZE } from "../constants/authorities.constants";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

export function useAuthorities() {
	const { t } = useTranslation();
	const [items, setItems] = useState<AuthorityItem[]>(() =>
		authoritiesRepository.getAll(),
	);

	// Filters
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Sorting
	const [sortBy, setSortBy] = useState<AuthoritySortField>("caseNr");
	const [sortOrder, setSortOrder] = useState<AuthoritySortOrder>("asc");

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(AUTHORITIES_DEFAULT_PAGE_SIZE);

	// Delete dialog state
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		title: string;
	} | null>(null);

	const refreshData = useCallback(() => {
		setItems(authoritiesRepository.getAll());
	}, []);

	// Filtered items
	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchCase = item.caseNr.toLowerCase().includes(q);
				const matchName = item.authorityName.toLowerCase().includes(q);
				const matchDoc = item.documentName.toLowerCase().includes(q);
				const matchSubj = item.subject.toLowerCase().includes(q);
				const matchFile = (item.fileName || "").toLowerCase().includes(q);
				if (!matchCase && !matchName && !matchDoc && !matchSubj && !matchFile) {
					return false;
				}
			}

			if (categoryFilter !== "all" && item.category !== categoryFilter) {
				return false;
			}

			if (statusFilter !== "all" && item.status !== statusFilter) {
				return false;
			}

			return true;
		});
	}, [items, searchQuery, categoryFilter, statusFilter]);

	// Sorted items
	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			let valA = "";
			let valB = "";

			switch (sortBy) {
				case "caseNr":
					valA = a.caseNr;
					valB = b.caseNr;
					break;
				case "category":
					valA = a.category;
					valB = b.category;
					break;
				case "date":
					valA = a.date;
					valB = b.date;
					break;
				case "documentName":
					valA = a.documentName.toLowerCase();
					valB = b.documentName.toLowerCase();
					break;
				case "fileName":
					valA = (a.fileName || "").toLowerCase();
					valB = (b.fileName || "").toLowerCase();
					break;
				case "status":
					valA = a.status;
					valB = b.status;
					break;
				case "authorityName":
					valA = a.authorityName.toLowerCase();
					valB = b.authorityName.toLowerCase();
					break;
				default:
					return 0;
			}

			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredItems, sortBy, sortOrder]);

	// Paginated items
	const totalCount = sortedItems.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	}, [sortedItems, currentPage, pageSize]);

	const handleSort = useCallback(
		(field: AuthoritySortField) => {
			if (sortBy === field) {
				setSortOrder((prev: AuthoritySortOrder) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	// Mutations
	const createAuthority = useCallback(
		(formData: AuthorityFormData) => {
			const created = authoritiesRepository.create(formData);
			refreshData();
			toast.success(t(localizationConstants.toastAuthorityCreated));
			return created;
		},
		[refreshData, t],
	);

	const updateAuthority = useCallback(
		(id: string, formData: Partial<AuthorityFormData>) => {
			const updated = authoritiesRepository.update(id, formData);
			refreshData();
			toast.success(t(localizationConstants.toastAuthorityUpdated));
			return updated;
		},
		[refreshData, t],
	);

	const deleteAuthority = useCallback(
		(id: string) => {
			const success = authoritiesRepository.delete(id);
			if (success) {
				refreshData();
				toast.success(t(localizationConstants.toastAuthorityDeleted));
			}
			return success;
		},
		[refreshData, t],
	);

	return {
		items: paginatedItems,
		allItems: items,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		itemToDelete,
		setItemToDelete,
		createAuthority,
		updateAuthority,
		deleteAuthority,
		refreshData,
	};
}
