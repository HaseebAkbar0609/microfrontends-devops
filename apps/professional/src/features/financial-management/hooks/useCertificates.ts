"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
	CertificateItem,
	CertificateFormData,
	CertificateStatus,
} from "../types/certificates.types";
import { certificatesRepository } from "../utils/certificatesRepository";
import { CERTIFICATES_DEFAULT_PAGE_SIZE } from "../constants/certificates.constants";

export function useCertificates() {
	const [items, setItems] = useState<CertificateItem[]>(() =>
		certificatesRepository.getAll(),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState<CertificateStatus | "all">("all");
	const [sortBy, setSortBy] = useState<keyof CertificateItem>("id");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(CERTIFICATES_DEFAULT_PAGE_SIZE);

	const [selectedCertForDelete, setSelectedCertForDelete] = useState<CertificateItem | null>(null);

	// Sync with repository updates
	useEffect(() => {
		const updateData = () => {
			setItems(certificatesRepository.getAll());
		};
		const unsubscribe = certificatesRepository.subscribe(updateData);
		return () => unsubscribe();
	}, []);

	// Filter and sort items
	const filteredItems = useMemo(() => {
		let result = [...items];

		// Filter out archived unless explicitly selected
		if (statusFilter !== "archived") {
			result = result.filter((i) => i.status !== "archived");
		}

		if (statusFilter !== "all") {
			result = result.filter((i) => i.status === statusFilter);
		}

		if (categoryFilter !== "all") {
			result = result.filter((i) => i.category.toLowerCase() === categoryFilter.toLowerCase());
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(i) =>
					i.id.toLowerCase().includes(query) ||
					i.name.toLowerCase().includes(query) ||
					i.objectType.toLowerCase().includes(query) ||
					i.objectId.toLowerCase().includes(query) ||
					i.objectName.toLowerCase().includes(query) ||
					i.responsiblePerson.toLowerCase().includes(query) ||
					(i.masterApprover && i.masterApprover.toLowerCase().includes(query)),
			);
		}

		// Sort
		result.sort((a, b) => {
			const valA = a[sortBy] ?? "";
			const valB = b[sortBy] ?? "";
			const comparison = String(valA).localeCompare(String(valB), undefined, {
				numeric: true,
				sensitivity: "base",
			});
			return sortOrder === "asc" ? comparison : -comparison;
		});

		return result;
	}, [items, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder]);

	// Paginate items
	const totalCount = filteredItems.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredItems.slice(start, start + pageSize);
	}, [filteredItems, currentPage, pageSize]);

	const handleSort = useCallback((column: keyof CertificateItem) => {
		setSortBy((prev) => {
			if (prev === column) {
				setSortOrder((curr) => (curr === "asc" ? "desc" : "asc"));
				return prev;
			}
			setSortOrder("asc");
			return column;
		});
	}, []);

	const createCertificate = useCallback((formData: CertificateFormData) => {
		return certificatesRepository.create(formData);
	}, []);

	const updateCertificate = useCallback(
		(id: string, formData: Partial<CertificateFormData>) => {
			return certificatesRepository.update(id, formData);
		},
		[],
	);

	const deleteCertificate = useCallback((id: string) => {
		return certificatesRepository.delete(id);
	}, []);

	const archiveCertificate = useCallback((id: string) => {
		return certificatesRepository.archive(id);
	}, []);

	const resetSeedData = useCallback(() => {
		certificatesRepository.resetToSeedData();
		setSearchQuery("");
		setCategoryFilter("all");
		setStatusFilter("all");
		setCurrentPage(1);
	}, []);

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
		selectedCertForDelete,
		setSelectedCertForDelete,
		createCertificate,
		updateCertificate,
		deleteCertificate,
		archiveCertificate,
		resetSeedData,
	};
}
