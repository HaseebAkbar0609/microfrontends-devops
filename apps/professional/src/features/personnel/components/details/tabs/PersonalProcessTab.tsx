"use client";

import React from "react";
import { usePersonalProcess } from "@/features/personnel/hooks/usePersonalProcess";
import { PersonalProcessListView } from "./process/PersonalProcessListView";
import { PersonalProcessFormView } from "./process/PersonalProcessFormView";
import { DocumentPreviewModal } from "../modals/DocumentPreviewModal";

interface PersonalProcessTabProps {
	employeeName?: string;
}

export function PersonalProcessTab({
	employeeName: _employeeName = "Anna Svensson",
}: PersonalProcessTabProps) {
	const {
		filteredProcesses,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		activeView,
		selectedProcess,
		processToDelete,
		setProcessToDelete,
		previewDocName,
		handleCreateNew,
		handleEditProcess,
		handleBackToList,
		handleConfirmDelete,
		handleSaveProcess,
		handlePreviewDoc,
		handleClosePreviewDoc,
	} = usePersonalProcess();

	return (
		<div className="space-y-6">
			{activeView === "list" ? (
				<PersonalProcessListView
					processes={filteredProcesses}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					onCreateNew={handleCreateNew}
					onViewProcess={handleEditProcess}
					onEditProcess={handleEditProcess}
					processToDelete={processToDelete}
					onPromptDelete={setProcessToDelete}
					onCloseDeleteDialog={() => setProcessToDelete(null)}
					onConfirmDelete={handleConfirmDelete}
				/>
			) : (
				<PersonalProcessFormView
					initialProcess={selectedProcess}
					onSave={handleSaveProcess}
					onCancel={handleBackToList}
					onPreviewDoc={handlePreviewDoc}
				/>
			)}

			{/* Document Preview Modal */}
			<DocumentPreviewModal
				isOpen={Boolean(previewDocName)}
				onClose={handleClosePreviewDoc}
				documentName={previewDocName}
			/>
		</div>
	);
}
