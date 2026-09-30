"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	MedarbetarsamtalItem,
	MedarbetarsamtalKpiData,
	NyIncheckningFormData,
} from "../types/medarbetarsamtal.types";
import {
	INITIAL_MEDARBETARSAMTAL_MOCK,
	INITIAL_MEDARBETARSAMTAL_KPIS,
} from "../mock/medarbetarsamtal.mock";

export function useMedarbetarsamtal() {
	const { t } = useTranslation();
	const [reviews, setReviews] = useState<MedarbetarsamtalItem[]>(
		INITIAL_MEDARBETARSAMTAL_MOCK
	);
	const [kpis, setKpis] = useState<MedarbetarsamtalKpiData>(
		INITIAL_MEDARBETARSAMTAL_KPIS
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState<
		"all" | "positiv" | "neutral" | "needs_attention" | "archived"
	>("all");
	const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"list" | "detail" | "new_form">(
		"list"
	);
	const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
	const [deleteConfirmItem, setDeleteConfirmItem] =
		useState<MedarbetarsamtalItem | null>(null);

	const selectedReview = useMemo(() => {
		if (!selectedReviewId) return null;
		return reviews.find((r) => r.id === selectedReviewId) || null;
	}, [reviews, selectedReviewId]);

	const filteredReviews = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return reviews.filter((r) => {
			if (q) {
				const matches =
					r.protocolTitle.toLowerCase().includes(q) ||
					r.person.toLowerCase().includes(q) ||
					r.date.includes(q);
				if (!matches) return false;
			}

			if (selectedFilter === "archived") {
				return Boolean(r.isArchived);
			}

			if (r.isArchived) return false;

			if (selectedFilter === "positiv") {
				return r.feeling === "positiv";
			}
			if (selectedFilter === "neutral") {
				return r.feeling === "neutral";
			}
			if (selectedFilter === "needs_attention") {
				return r.feeling === "behover_uppmarksamhet";
			}

			return true;
		});
	}, [reviews, searchQuery, selectedFilter]);

	const handleCreateReview = useCallback(
		(formData: NyIncheckningFormData) => {
			const newItem: MedarbetarsamtalItem = {
				id: `rev_${Date.now()}`,
				hasFile: formData.documents.length > 0,
				isArchived: false,
				...formData,
			};

			setReviews((prev) => [newItem, ...prev]);
			setViewMode("list");
			toast.success(t(localizationConstants.toastProfileUpdated));
		},
		[t]
	);

	const handleUpdateReview = useCallback(
		(id: string, updatedFields: Partial<MedarbetarsamtalItem>) => {
			setReviews((prev) =>
				prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
			);
			toast.success(t(localizationConstants.toastProfileUpdated));
		},
		[t]
	);

	const handleArchiveReview = useCallback(
		(id: string) => {
			setReviews((prev) =>
				prev.map((r) => (r.id === id ? { ...r, isArchived: !r.isArchived } : r))
			);
			toast.success(t(localizationConstants.toastReviewArchived));
		},
		[t]
	);

	const handleScheduleReview = useCallback(
		(data: { date: string; type: string; manager: string; notes?: string }) => {
			setKpis((prev) => ({
				...prev,
				nextScheduled: data.date,
				nextScheduledSub: "Schemalagt",
			}));
			setIsScheduleModalOpen(false);
			toast.success(t(localizationConstants.toastReviewScheduled));
		},
		[t]
	);

	const handleDeleteReview = useCallback(
		(id: string) => {
			setReviews((prev) => prev.filter((r) => r.id !== id));
			if (selectedReviewId === id) {
				setSelectedReviewId(null);
				setViewMode("list");
			}
			setDeleteConfirmItem(null);
			toast.success(t(localizationConstants.toastContractDeleted));
		},
		[selectedReviewId, t]
	);

	const handleOpenDetail = useCallback((item: MedarbetarsamtalItem) => {
		setSelectedReviewId(item.id);
		setViewMode("detail");
	}, []);

	const handleOpenNewForm = useCallback(() => {
		setViewMode("new_form");
	}, []);

	const handleBackToList = useCallback(() => {
		setViewMode("list");
		setSelectedReviewId(null);
	}, []);

	return {
		reviews,
		filteredReviews,
		kpis,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		isScheduleModalOpen,
		setIsScheduleModalOpen,
		handleScheduleReview,
		handleArchiveReview,
		viewMode,
		selectedReview,
		selectedReviewId,
		deleteConfirmItem,
		setDeleteConfirmItem,
		handleCreateReview,
		handleUpdateReview,
		handleDeleteReview,
		handleOpenDetail,
		handleOpenNewForm,
		handleBackToList,
	};
}
