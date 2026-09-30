"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useKompetenser } from "../../../hooks/useKompetenser";
import { KompetensListView } from "./kompetens/KompetensListView";
import { KompetensDetailView } from "./kompetens/KompetensDetailView";
import { AddKompetensModal } from "./kompetens/modals/AddKompetensModal";
import { MedarbetarsamtalTab } from "./MedarbetarsamtalTab";

interface KompetensTabProps {
	onPreviewDoc?: (name: string) => void;
}

export function KompetensTab({ onPreviewDoc }: KompetensTabProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const subTabParam = searchParams.get("subTab");

	const [subSection, setSubSection] = useState<"kompetens" | "medarbetarsamtal">(() => {
		if (subTabParam === "medarbetarsamtal") return "medarbetarsamtal";
		return "kompetens";
	});

	useEffect(() => {
		if (subTabParam === "medarbetarsamtal") {
			setSubSection("medarbetarsamtal");
		} else if (subTabParam === "kompetens") {
			setSubSection("kompetens");
		}
	}, [subTabParam]);

	const handleSwitchSubSection = (newSection: "kompetens" | "medarbetarsamtal") => {
		setSubSection(newSection);
		const params = new URLSearchParams(searchParams.toString());
		if (newSection === "medarbetarsamtal") {
			params.set("subTab", "medarbetarsamtal");
		} else {
			params.delete("subTab");
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const {
		filteredCompetences,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		selectedCompetence,
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
	} = useKompetenser();

	if (subSection === "medarbetarsamtal") {
		return (
			<MedarbetarsamtalTab
				onPreviewDoc={onPreviewDoc}
				onSwitchToKompetens={() => handleSwitchSubSection("kompetens")}
			/>
		);
	}

	return (
		<div className="space-y-6">
			{selectedCompetence ? (
				<KompetensDetailView
					competence={selectedCompetence}
					onBack={handleBackToList}
					onEdit={handleOpenEdit}
					onPreviewDoc={onPreviewDoc}
				/>
			) : (
				<KompetensListView
					competences={filteredCompetences}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedFilter={selectedFilter}
					onFilterChange={setSelectedFilter}
					onAddClick={() => setIsAddModalOpen(true)}
					onOpenDetail={handleOpenDetail}
					onArchiveClick={handleArchiveCompetence}
					onDeleteClick={(item) => setDeleteConfirmItem(item)}
					deleteConfirmItem={deleteConfirmItem}
					onConfirmDelete={handleDeleteCompetence}
					onCancelDelete={() => setDeleteConfirmItem(null)}
					onPreviewDoc={onPreviewDoc}
					onSwitchToMedarbetarsamtal={() => handleSwitchSubSection("medarbetarsamtal")}
				/>
			)}

			{/* Add / Edit Modal */}
			<AddKompetensModal
				isOpen={isAddModalOpen || Boolean(editingItem)}
				onClose={() => {
					setIsAddModalOpen(false);
					setEditingItem(null);
				}}
				initialData={editingItem}
				onSave={(data) => {
					if (editingItem) {
						handleUpdateCompetence(editingItem.id, data);
					} else {
						handleAddCompetence(data);
					}
				}}
			/>
		</div>
	);
}

export default KompetensTab;
