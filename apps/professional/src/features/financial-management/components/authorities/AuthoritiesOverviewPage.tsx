"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthorities } from "../../hooks/useAuthorities";
import { AUTHORITIES_BASE_ROUTE, AUTHORITIES_CREATE_ROUTE } from "../../constants/authorities.constants";
import { AuthoritiesHeader } from "./AuthoritiesHeader";
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

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-12">
			{/* Header & Breadcrumbs */}
			<AuthoritiesHeader />

			{/* Top Toolbar */}
			<AuthoritiesToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				onCreateClick={() => router.push(AUTHORITIES_CREATE_ROUTE)}
			/>

			{/* Main Table */}
			<AuthoritiesTable
				items={items}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onView={(item) => router.push(`${AUTHORITIES_BASE_ROUTE}/${item.id}`)}
				onEdit={(item) => router.push(`${AUTHORITIES_BASE_ROUTE}/${item.id}`)}
				onDelete={(id, title) => setItemToDelete({ id, title })}
				onCreateClick={() => router.push(AUTHORITIES_CREATE_ROUTE)}
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
