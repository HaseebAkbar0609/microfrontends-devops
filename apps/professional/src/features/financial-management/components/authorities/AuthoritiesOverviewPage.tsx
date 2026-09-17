"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthorities } from "../../hooks/useAuthorities";
import { AUTHORITIES_CREATE_ROUTE } from "../../constants/authorities.constants";
import { AuthoritiesToolbar } from "./AuthoritiesToolbar";
import { AuthoritiesTable } from "./AuthoritiesTable";
import { AuthoritiesPagination } from "./AuthoritiesPagination";
import { AuthorityDeleteDialog } from "./AuthorityDeleteDialog";

export function AuthoritiesOverviewPage() {
	const router = useRouter();
	const {
		items,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		sortBy,
		sortOrder,
		handleSort,
		itemToDelete,
		setItemToDelete,
		deleteAuthority,
	} = useAuthorities();

	const handleNavigateToCreate = () => {
		router.push(AUTHORITIES_CREATE_ROUTE);
	};

	return (
		<div className="flex flex-1 flex-col bg-white px-6 pt-5 pb-8 min-h-screen space-y-4">
			{/* Top Toolbar */}
			<AuthoritiesToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				onCreateClick={handleNavigateToCreate}
			/>

			{/* Main Table */}
			<AuthoritiesTable
				items={items}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onDelete={(item) =>
					setItemToDelete({
						id: item.id,
						title: item.documentName || item.subject,
					})
				}
				onCreateClick={handleNavigateToCreate}
			/>

			{/* Pagination Footer */}
			<AuthoritiesPagination
				totalCount={totalCount}
				currentPage={currentPage}
				pageSize={pageSize}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Delete Confirmation Modal */}
			<AuthorityDeleteDialog
				item={itemToDelete}
				isOpen={itemToDelete !== null}
				onClose={() => setItemToDelete(null)}
				onConfirm={(id) => deleteAuthority(id)}
			/>
		</div>
	);
}

export default AuthoritiesOverviewPage;
