"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { CompanyAssetItem } from "../types/equipment.types";
import { companyEquipmentRepository } from "../utils/companyEquipmentRepository";

export function useCompanyEquipment() {
	const { t } = useTranslation();
	const [assets, setAssets] = useState<CompanyAssetItem[]>(() =>
		companyEquipmentRepository.getAll()
	);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [departmentFilter, setDepartmentFilter] = useState<string>("all");

	const [sortField, setSortField] = useState<keyof CompanyAssetItem>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<CompanyAssetItem | null>(null);
	const [assetToEdit, setAssetToEdit] = useState<CompanyAssetItem | null>(null);
	const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState<boolean>(false);
	const [assetToDelete, setAssetToDelete] = useState<CompanyAssetItem | null>(null);

	const refreshAssets = useCallback(() => {
		setAssets(companyEquipmentRepository.getAll());
	}, []);

	const handleSort = useCallback(
		(field: keyof CompanyAssetItem) => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder("asc");
			}
		},
		[sortField]
	);

	const handleResetFilters = useCallback(() => {
		setSearchTerm("");
		setCategoryFilter("all");
		setStatusFilter("all");
		setDepartmentFilter("all");
		setCurrentPage(1);
	}, []);

	const filteredAssets = useMemo(() => {
		return assets.filter((asset) => {
			const matchesSearch =
				!searchTerm ||
				asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				asset.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(asset.assignedEmployeeName &&
					asset.assignedEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesCategory =
				categoryFilter === "all" || asset.category === categoryFilter;

			const matchesStatus =
				statusFilter === "all" || asset.status === statusFilter;

			const matchesDepartment =
				departmentFilter === "all" || asset.department === departmentFilter;

			return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
		});
	}, [assets, searchTerm, categoryFilter, statusFilter, departmentFilter]);

	const sortedAssets = useMemo(() => {
		return [...filteredAssets].sort((a, b) => {
			const valA = a[sortField] ?? "";
			const valB = b[sortField] ?? "";

			if (typeof valA === "string" && typeof valB === "string") {
				return sortOrder === "asc"
					? valA.localeCompare(valB)
					: valB.localeCompare(valA);
			}

			return 0;
		});
	}, [filteredAssets, sortField, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(sortedAssets.length / pageSize));
	const paginatedAssets = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return sortedAssets.slice(startIndex, startIndex + pageSize);
	}, [sortedAssets, currentPage, pageSize]);

	const handleCreateAsset = useCallback(
		(assetData: Omit<CompanyAssetItem, "id" | "history">) => {
			companyEquipmentRepository.create(assetData);
			refreshAssets();
			setIsAddAssetModalOpen(false);
			toast.success(t(localizationConstants.toastAssetSaved));
		},
		[refreshAssets, t]
	);

	const handleUpdateAsset = useCallback(
		(id: string, updates: Partial<CompanyAssetItem>) => {
			companyEquipmentRepository.update(id, updates);
			refreshAssets();
			setAssetToEdit(null);
			toast.success(t(localizationConstants.toastAssetSaved));
		},
		[refreshAssets, t]
	);

	const handleDeleteAsset = useCallback(() => {
		if (!assetToDelete) return;
		companyEquipmentRepository.delete(assetToDelete.id);
		refreshAssets();
		setAssetToDelete(null);
		toast.success(t(localizationConstants.toastAssetDeleted));
	}, [assetToDelete, refreshAssets, t]);

	return {
		assets,
		paginatedAssets,
		totalCount: filteredAssets.length,
		searchTerm,
		setSearchTerm,
		categoryFilter,
		setCategoryFilter,
		statusFilter,
		setStatusFilter,
		departmentFilter,
		setDepartmentFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		handleResetFilters,
		selectedAssetForHistory,
		setSelectedAssetForHistory,
		assetToEdit,
		setAssetToEdit,
		isAddAssetModalOpen,
		setIsAddAssetModalOpen,
		assetToDelete,
		setAssetToDelete,
		handleCreateAsset,
		handleUpdateAsset,
		handleDeleteAsset,
	};
}
