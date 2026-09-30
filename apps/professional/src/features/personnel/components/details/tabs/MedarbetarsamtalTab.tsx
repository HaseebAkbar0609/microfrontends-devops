"use client";

import React from "react";
import { useMedarbetarsamtal } from "../../../hooks/useMedarbetarsamtal";
import { MedarbetarsamtalListView } from "./medarbetarsamtal/MedarbetarsamtalListView";
import { MedarbetarsamtalDetailView } from "./medarbetarsamtal/MedarbetarsamtalDetailView";
import { NyInchecknigForm } from "./medarbetarsamtal/NyInchecknigForm";
import { ScheduleReviewModal } from "./medarbetarsamtal/modals/ScheduleReviewModal";

interface MedarbetarsamtalTabProps {
	onPreviewDoc?: (name: string) => void;
	onSwitchToKompetens?: () => void;
}

export function MedarbetarsamtalTab({
	onPreviewDoc,
	onSwitchToKompetens,
}: MedarbetarsamtalTabProps) {
	const {
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
		deleteConfirmItem,
		setDeleteConfirmItem,
		handleCreateReview,
		handleDeleteReview,
		handleOpenDetail,
		handleOpenNewForm,
		handleBackToList,
	} = useMedarbetarsamtal();

	return (
		<div className="space-y-6">
			{viewMode === "new_form" && (
				<NyInchecknigForm
					onSave={handleCreateReview}
					onCancel={handleBackToList}
					onPreviewDoc={onPreviewDoc}
				/>
			)}

			{viewMode === "detail" && selectedReview && (
				<MedarbetarsamtalDetailView
					review={selectedReview}
					onBack={handleBackToList}
					onEditSection={() => handleOpenNewForm()}
					onPreviewDoc={onPreviewDoc}
				/>
			)}

			{viewMode === "list" && (
				<MedarbetarsamtalListView
					reviews={filteredReviews}
					kpis={kpis}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedFilter={selectedFilter}
					onFilterChange={setSelectedFilter}
					onScheduleClick={() => setIsScheduleModalOpen(true)}
					onNewReviewClick={handleOpenNewForm}
					onOpenDetail={handleOpenDetail}
					onArchiveClick={handleArchiveReview}
					onDeleteClick={(item) => setDeleteConfirmItem(item)}
					deleteConfirmItem={deleteConfirmItem}
					onConfirmDelete={handleDeleteReview}
					onCancelDelete={() => setDeleteConfirmItem(null)}
					onPreviewDoc={onPreviewDoc}
					onSwitchToKompetens={onSwitchToKompetens}
				/>
			)}

			{/* Schedule Employee Review Modal */}
			<ScheduleReviewModal
				isOpen={isScheduleModalOpen}
				onClose={() => setIsScheduleModalOpen(false)}
				onSchedule={handleScheduleReview}
			/>
		</div>
	);
}

export default MedarbetarsamtalTab;
