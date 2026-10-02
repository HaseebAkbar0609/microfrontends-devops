"use client";

import React from "react";
import { ProcessToolbar } from "./list/ProcessToolbar";
import { ProcessTable } from "./list/ProcessTable";
import { ProcessDeleteDialog } from "./list/ProcessDeleteDialog";
import {
	PersonalProcessItem,
	ProcessCategory,
} from "@/features/personnel/types/personalProcess.types";

interface PersonalProcessListViewProps {
	processes: PersonalProcessItem[];
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCategory: ProcessCategory;
	onCategoryChange: (cat: ProcessCategory) => void;
	onCreateNew: () => void;
	onViewProcess: (proc: PersonalProcessItem) => void;
	onEditProcess: (proc: PersonalProcessItem) => void;
	processToDelete: PersonalProcessItem | null;
	onPromptDelete: (proc: PersonalProcessItem) => void;
	onCloseDeleteDialog: () => void;
	onConfirmDelete: () => void;
}

export function PersonalProcessListView({
	processes,
	searchQuery,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	onCreateNew,
	onViewProcess,
	onEditProcess,
	processToDelete,
	onPromptDelete,
	onCloseDeleteDialog,
	onConfirmDelete,
}: PersonalProcessListViewProps) {
	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<ProcessToolbar
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				selectedCategory={selectedCategory}
				onCategoryChange={onCategoryChange}
				onCreateNew={onCreateNew}
			/>

			{/* Process Table */}
			<ProcessTable
				processes={processes}
				onView={onViewProcess}
				onEdit={onEditProcess}
				onDelete={onPromptDelete}
			/>

			{/* Delete Confirmation Dialog */}
			<ProcessDeleteDialog
				process={processToDelete}
				onClose={onCloseDeleteDialog}
				onConfirm={onConfirmDelete}
			/>
		</div>
	);
}
