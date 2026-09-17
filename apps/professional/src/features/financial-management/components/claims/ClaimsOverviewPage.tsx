"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClaims } from "../../hooks/useClaims";
import { useClaimTemplates } from "../../hooks/useClaimTemplates";
import type { ClaimItem, ClaimTabType, ClaimTemplate } from "../../types/claims.types";
import {
	CREATE_CLAIM_ROUTE,
	CREATE_CLAIM_TEMPLATE_ROUTE,
	CLAIM_TEMPLATES_BASE_ROUTE,
	CLAIMS_BASE_ROUTE,
} from "../../constants/claims.constants";
import { ClaimsOverviewHeader } from "./ClaimsOverviewHeader";
import { ClaimsToolbar } from "./ClaimsToolbar";
import { ClaimsTable } from "./ClaimsTable";
import { ClaimsPagination } from "./ClaimsPagination";
import { ClaimDeleteDialog } from "./ClaimDeleteDialog";
import { ClaimTemplatesList } from "./templates/ClaimTemplatesList";
import { ClaimTemplateDeleteDialog } from "./templates/ClaimTemplateDeleteDialog";

interface ClaimsOverviewPageProps {
	initialTab?: ClaimTabType;
}

export function ClaimsOverviewPage({
	initialTab = "reklamationerlista",
}: ClaimsOverviewPageProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<ClaimTabType>(initialTab);
	const [deleteTarget, setDeleteTarget] = useState<ClaimItem | null>(null);

	const {
		claims,
		totalItems,
		totalPages,
		currentPage,
		pageSize,
		searchQuery,
		statusFilter,
		sortColumn,
		sortDirection,
		setSearchQuery,
		setStatusFilter,
		setPageSize,
		setCurrentPage,
		handleSort,
		deleteClaim,
	} = useClaims();

	const {
		templates: tplItems,
		totalPages: tplTotalPages,
		currentPage: tplCurrentPage,
		pageSize: tplPageSize,
		searchQuery: tplSearchQuery,
		sortColumn: tplSortColumn,
		sortDirection: tplSortDirection,
		deleteTarget: tplDeleteTarget,
		setSearchQuery: setTplSearchQuery,
		handleSort: handleTplSort,
		setCurrentPage: setTplCurrentPage,
		setPageSize: setTplPageSize,
		setDeleteTarget: setTplDeleteTarget,
		handleDeleteConfirm: handleTplDeleteConfirm,
	} = useClaimTemplates();

	const handleCreateClick = () => {
		router.push(CREATE_CLAIM_ROUTE);
	};

	const handleRowClick = (item: ClaimItem) => {
		router.push(`${CLAIMS_BASE_ROUTE}/${item.id}`);
	};

	const handleEdit = (item: ClaimItem) => {
		router.push(`${CREATE_CLAIM_ROUTE}?id=${item.id}`);
	};

	const handleDeleteClick = (item: ClaimItem) => {
		setDeleteTarget(item);
	};

	const handleDeleteConfirm = () => {
		if (deleteTarget) {
			deleteClaim(deleteTarget.id);
			setDeleteTarget(null);
		}
	};

	const handleCreateTemplateClick = () => {
		router.push(CREATE_CLAIM_TEMPLATE_ROUTE);
	};

	const handleViewTemplate = (template: ClaimTemplate) => {
		router.push(`${CLAIM_TEMPLATES_BASE_ROUTE}/${encodeURIComponent(template.id)}`);
	};

	const handleEditTemplate = (template: ClaimTemplate) => {
		router.push(`${CREATE_CLAIM_TEMPLATE_ROUTE}?id=${encodeURIComponent(template.id)}`);
	};

	const handleDeleteTemplateClick = (template: ClaimTemplate) => {
		setTplDeleteTarget(template);
	};

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-12">
			<ClaimsOverviewHeader
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{activeTab === "reklamationerlista" ? (
				<div className="space-y-4">
					<ClaimsToolbar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
						onCreateClick={handleCreateClick}
					/>

					<ClaimsTable
						items={claims}
						sortColumn={sortColumn}
						sortDirection={sortDirection}
						onSort={handleSort}
						onRowClick={handleRowClick}
						onEdit={handleEdit}
						onDelete={handleDeleteClick}
						onCreateClick={handleCreateClick}
					/>

					<ClaimsPagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
					/>
				</div>
			) : (
				<ClaimTemplatesList
					templates={tplItems}
					searchQuery={tplSearchQuery}
					sortColumn={tplSortColumn}
					sortDirection={tplSortDirection}
					currentPage={tplCurrentPage}
					totalPages={tplTotalPages}
					pageSize={tplPageSize}
					onSearchChange={setTplSearchQuery}
					onSort={handleTplSort}
					onPageChange={setTplCurrentPage}
					onPageSizeChange={setTplPageSize}
					onCreateClick={handleCreateTemplateClick}
					onViewTemplate={handleViewTemplate}
					onEditTemplate={handleEditTemplate}
					onDeleteTemplate={handleDeleteTemplateClick}
				/>
			)}

			<ClaimDeleteDialog
				isOpen={deleteTarget !== null}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDeleteConfirm}
				item={deleteTarget}
			/>

			<ClaimTemplateDeleteDialog
				isOpen={tplDeleteTarget !== null}
				onClose={() => setTplDeleteTarget(null)}
				onConfirm={handleTplDeleteConfirm}
				template={tplDeleteTarget}
			/>
		</div>
	);
}

export default ClaimsOverviewPage;
