"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	CompetenceItem,
	CreateCompetenceFormData,
} from "../types/competence.types";
import { INITIAL_COMPETENCES_MOCK } from "../mock/competence.mock";

export function useKompetenser() {
	const { t } = useTranslation();
	const [competences, setCompetences] = useState<CompetenceItem[]>(
		INITIAL_COMPETENCES_MOCK
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState<
		"all" | "active" | "expire_soon" | "expired" | "archived"
	>("all");
	const [selectedCompetenceId, setSelectedCompetenceId] = useState<
		string | null
	>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<CompetenceItem | null>(null);
	const [deleteConfirmItem, setDeleteConfirmItem] =
		useState<CompetenceItem | null>(null);

	const selectedCompetence = useMemo(() => {
		if (!selectedCompetenceId) return null;
		return (
			competences.find((item) => item.id === selectedCompetenceId) || null
		);
	}, [competences, selectedCompetenceId]);

	const filteredCompetences = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return competences.filter((item) => {
			if (q) {
				const matches =
					item.name.toLowerCase().includes(q) ||
					item.training.toLowerCase().includes(q) ||
					item.certNo.toLowerCase().includes(q) ||
					item.nr.includes(q);
				if (!matches) return false;
			}

			if (selectedFilter === "archived") {
				return Boolean(item.isArchived);
			}

			if (item.isArchived) return false;

			if (selectedFilter === "active") {
				return item.status === "active";
			}
			if (selectedFilter === "expire_soon") {
				return item.status === "expire_soon";
			}
			if (selectedFilter === "expired") {
				return item.status === "expired";
			}

			return true;
		});
	}, [competences, searchQuery, selectedFilter]);

	const handleAddCompetence = useCallback(
		(formData: CreateCompetenceFormData) => {
			const nextNum = competences.length + 1;
			const nextNr = String(nextNum).padStart(3, "0");
			const newItem: CompetenceItem = {
				id: `comp_${Date.now()}`,
				nr: nextNr,
				name: formData.name,
				training: formData.training,
				certNo: formData.certNo || "—",
				expiryDate: formData.expiryDate,
				status: "active",
				hasFile: formData.specifications.length > 0,
				specifications: formData.specifications,
			};

			setCompetences((prev) => [newItem, ...prev]);
			setIsAddModalOpen(false);
			toast.success(t(localizationConstants.toastCompetenceAdded));
		},
		[competences.length, t]
	);

	const handleUpdateCompetence = useCallback(
		(id: string, formData: CreateCompetenceFormData) => {
			setCompetences((prev) =>
				prev.map((item) =>
					item.id === id
						? {
								...item,
								name: formData.name,
								training: formData.training,
								certNo: formData.certNo || "—",
								expiryDate: formData.expiryDate,
								hasFile: formData.specifications.length > 0,
								specifications: formData.specifications,
						  }
						: item
				)
			);
			setEditingItem(null);
			toast.success(t(localizationConstants.toastProfileUpdated));
		},
		[t]
	);

	const handleDeleteCompetence = useCallback(
		(id: string) => {
			setCompetences((prev) => prev.filter((item) => item.id !== id));
			if (selectedCompetenceId === id) {
				setSelectedCompetenceId(null);
			}
			setDeleteConfirmItem(null);
			toast.success(t(localizationConstants.toastCompetenceDeleted));
		},
		[selectedCompetenceId, t]
	);

	const handleOpenDetail = useCallback((item: CompetenceItem) => {
		setSelectedCompetenceId(item.id);
	}, []);

	const handleBackToList = useCallback(() => {
		setSelectedCompetenceId(null);
	}, []);

	const handleOpenEdit = useCallback((item: CompetenceItem) => {
		setEditingItem(item);
	}, []);

	const handleArchiveCompetence = useCallback(
		(id: string) => {
			setCompetences((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, isArchived: !item.isArchived } : item
				)
			);
			toast.success(t(localizationConstants.toastCompetenceArchived));
		},
		[t]
	);

	return {
		competences,
		filteredCompetences,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		selectedCompetence,
		selectedCompetenceId,
		isAddModalOpen,
		setIsAddModalOpen,
		editingItem,
		setEditingItem,
		deleteConfirmItem,
		setDeleteConfirmItem,
		handleAddCompetence,
		handleUpdateCompetence,
		handleArchiveCompetence,
		handleDeleteCompetence,
		handleOpenDetail,
		handleBackToList,
		handleOpenEdit,
	};
}
