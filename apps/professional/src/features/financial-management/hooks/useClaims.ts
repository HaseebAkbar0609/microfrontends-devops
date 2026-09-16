"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
	ClaimItem,
	ClaimTemplate,
	ClaimFormData,
	ClaimStatus,
	ClaimDocument,
} from "../types/claims.types";
import { claimsRepository } from "../utils/claimsRepository";
import { DEFAULT_CLAIMS_PAGE_SIZE } from "../constants/claims.constants";

export function useClaims(initialPageSize: number = DEFAULT_CLAIMS_PAGE_SIZE) {
	const [claims, setClaims] = useState<ClaimItem[]>(() => claimsRepository.getAll());
	const [templates, setTemplates] = useState<ClaimTemplate[]>(() => claimsRepository.getTemplates());
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<ClaimStatus | "all">("all");
	const [sortColumn, setSortColumn] = useState<keyof ClaimItem>("id");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	useEffect(() => {
		const unsubscribe = claimsRepository.subscribe(() => {
			setClaims(claimsRepository.getAll());
			setTemplates(claimsRepository.getTemplates());
		});
		return () => {
			unsubscribe();
		};
	}, []);

	const filteredClaims = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return claims.filter((item) => {
			// Status filter
			if (statusFilter !== "all" && item.status !== statusFilter) {
				return false;
			}
			// Search query matching ID, supplier, object, responsible, type, description, linked invoice
			if (query) {
				const matchId = item.id.toLowerCase().includes(query);
				const matchSupplier = item.supplier.toLowerCase().includes(query);
				const matchObject = item.object.toLowerCase().includes(query);
				const matchObjectName = item.objectName.toLowerCase().includes(query);
				const matchResponsible = item.responsible.toLowerCase().includes(query);
				const matchType = item.deficiencyType.toLowerCase().includes(query);
				const matchInvoice = item.linkedInvoice.toLowerCase().includes(query);
				const matchDesc = item.description.toLowerCase().includes(query);
				if (
					!matchId &&
					!matchSupplier &&
					!matchObject &&
					!matchObjectName &&
					!matchResponsible &&
					!matchType &&
					!matchInvoice &&
					!matchDesc
				) {
					return false;
				}
			}
			return true;
		});
	}, [claims, searchQuery, statusFilter]);

	const sortedClaims = useMemo(() => {
		return [...filteredClaims].sort((a, b) => {
			const valA = a[sortColumn];
			const valB = b[sortColumn];

			if (typeof valA === "number" && typeof valB === "number") {
				return sortDirection === "asc" ? valA - valB : valB - valA;
			}

			const strA = String(valA ?? "").toLowerCase();
			const strB = String(valB ?? "").toLowerCase();
			const comp = strA.localeCompare(strB, "sv", { numeric: true });
			return sortDirection === "asc" ? comp : -comp;
		});
	}, [filteredClaims, sortColumn, sortDirection]);

	const totalItems = sortedClaims.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const paginatedClaims = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return sortedClaims.slice(startIndex, startIndex + pageSize);
	}, [sortedClaims, currentPage, pageSize]);

	const handleSort = useCallback((column: keyof ClaimItem) => {
		setSortColumn((prevCol) => {
			if (prevCol === column) {
				setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
				return column;
			}
			setSortDirection("asc");
			return column;
		});
	}, []);

	const createClaim = useCallback((data: ClaimFormData) => {
		return claimsRepository.create(data);
	}, []);

	const updateClaim = useCallback((id: string, data: Partial<ClaimFormData>) => {
		return claimsRepository.update(id, data);
	}, []);

	const deleteClaim = useCallback((id: string) => {
		return claimsRepository.delete(id);
	}, []);

	const addDocument = useCallback((claimId: string, doc: Omit<ClaimDocument, "id">) => {
		return claimsRepository.addDocument(claimId, doc);
	}, []);

	const removeDocument = useCallback((claimId: string, docId: string) => {
		return claimsRepository.removeDocument(claimId, docId);
	}, []);

	const resetToSeedData = useCallback(() => {
		claimsRepository.resetToSeedData();
	}, []);

	return {
		claims: paginatedClaims,
		allClaims: claims,
		templates,
		totalItems,
		totalPages,
		currentPage,
		pageSize,
		searchQuery,
		statusFilter,
		sortColumn,
		sortDirection,
		setSearchQuery: (q: string) => {
			setSearchQuery(q);
			setCurrentPage(1);
		},
		setStatusFilter: (s: ClaimStatus | "all") => {
			setStatusFilter(s);
			setCurrentPage(1);
		},
		setPageSize: (size: number) => {
			setPageSize(size);
			setCurrentPage(1);
		},
		setCurrentPage,
		handleSort,
		createClaim,
		updateClaim,
		deleteClaim,
		addDocument,
		removeDocument,
		resetToSeedData,
	};
}
