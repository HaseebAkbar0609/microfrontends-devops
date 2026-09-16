"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClaims } from "../../hooks/useClaims";
import type { ClaimItem, ClaimTabType, ClaimTemplate } from "../../types/claims.types";
import { CREATE_CLAIM_ROUTE, CLAIMS_BASE_ROUTE } from "../../constants/claims.constants";
import { ClaimsOverviewHeader } from "./ClaimsOverviewHeader";
import { ClaimsToolbar } from "./ClaimsToolbar";
import { ClaimsTable } from "./ClaimsTable";
import { ClaimsPagination } from "./ClaimsPagination";
import { ClaimDeleteDialog } from "./ClaimDeleteDialog";
import { ClaimTemplatesList } from "./templates/ClaimTemplatesList";

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
		templates,
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

	const handleUseTemplate = (template: ClaimTemplate) => {
		router.push(`${CREATE_CLAIM_ROUTE}?templateId=${template.id}`);
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
					templates={templates}
					onUseTemplate={handleUseTemplate}
				/>
			)}

			<ClaimDeleteDialog
				isOpen={deleteTarget !== null}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDeleteConfirm}
				item={deleteTarget}
			/>
		</div>
	);
}

export default ClaimsOverviewPage;
