"use client";

import React from "react";
import type {
	ClaimTemplate,
	ClaimTemplateSortColumn,
} from "../../../types/claims.types";
import { ClaimTemplatesToolbar } from "./ClaimTemplatesToolbar";
import { ClaimTemplatesTable } from "./ClaimTemplatesTable";
import { ClaimTemplatesPagination } from "./ClaimTemplatesPagination";

interface ClaimTemplatesListProps {
	templates: ClaimTemplate[];
	searchQuery: string;
	sortColumn: ClaimTemplateSortColumn;
	sortDirection: "asc" | "desc";
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onSearchChange: (q: string) => void;
	onSort: (col: ClaimTemplateSortColumn) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onCreateClick: () => void;
	onViewTemplate: (template: ClaimTemplate) => void;
	onEditTemplate: (template: ClaimTemplate) => void;
	onDeleteTemplate: (template: ClaimTemplate) => void;
}

export function ClaimTemplatesList({
	templates,
	searchQuery,
	sortColumn,
	sortDirection,
	currentPage,
	totalPages,
	pageSize,
	onSearchChange,
	onSort,
	onPageChange,
	onPageSizeChange,
	onCreateClick,
	onViewTemplate,
	onEditTemplate,
	onDeleteTemplate,
}: ClaimTemplatesListProps) {
	return (
		<div className="space-y-4">
			{/* Toolbar with Search, Filter, and + skapa mall */}
			<ClaimTemplatesToolbar
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				onCreateClick={onCreateClick}
			/>

			{/* Table matching Figma Image 2 */}
			<ClaimTemplatesTable
				items={templates}
				sortColumn={sortColumn}
				sortDirection={sortDirection}
				onSort={onSort}
				onView={onViewTemplate}
				onEdit={onEditTemplate}
				onDelete={onDeleteTemplate}
			/>

			{/* Pagination matching Figma Image 2 */}
			<ClaimTemplatesPagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	);
}

export default ClaimTemplatesList;
