"use client";

import React from "react";
import { useOrderDocuments } from "./hooks/useOrderDocuments";
import { DocumentsHeader } from "./components/DocumentsHeader";
import { DocumentsToolbar } from "./components/DocumentsToolbar";
import { DocumentsTable } from "./components/DocumentsTable";
import { UploadDocumentModal } from "./components/UploadDocumentModal";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";

export interface OrderDocumentsOverviewPageProps {
	orderId?: string;
	hideNavRow?: boolean;
}

export function OrderDocumentsOverviewPage({
	orderId,
	hideNavRow = false,
}: OrderDocumentsOverviewPageProps) {
	const {
		items,
		totalCount,
		isLoading,
		subtab,
		setSubtab,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		availableCategories,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		isUploadModalOpen,
		setIsUploadModalOpen,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		itemToDelete,
		confirmDelete,
		handleUpload,
		handleArchive,
		handleRestore,
		handleDelete,
		handlePrint,
	} = useOrderDocuments(orderId);

	return (
		<div className="w-full flex flex-col gap-4 pb-12">
			{/* Subtab Header */}
			<DocumentsHeader
				orderId={orderId}
				activeSubtab={subtab}
				onSubtabChange={setSubtab}
				hideTitle={hideNavRow}
			/>

			{/* Search, Filter & Action Toolbar */}
			<DocumentsToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				availableCategories={availableCategories}
				onOpenUploadModal={() => setIsUploadModalOpen(true)}
				onPrint={handlePrint}
			/>

			{/* Unified Table with Pagination */}
			{isLoading ? (
				<div className="w-full py-16 flex items-center justify-center">
					<div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
				</div>
			) : (
				<DocumentsTable
					items={items}
					totalCount={totalCount}
					subtab={subtab}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					totalPages={totalPages}
					onArchive={handleArchive}
					onRestore={handleRestore}
					onDelete={confirmDelete}
					onOpenUploadModal={() => setIsUploadModalOpen(true)}
				/>
			)}

			{/* Upload Modal */}
			<UploadDocumentModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onSave={handleUpload}
				activeSubtab={subtab}
			/>

			{/* Shared Confirmation Dialog */}
			<ConfirmActionDialog
				open={isDeleteModalOpen}
				onOpenChange={setIsDeleteModalOpen}
				title={localizationConstants.orderHandlingarDeleteModalTitle}
				description={localizationConstants.orderHandlingarDeleteModalDesc}
				confirmLabel={localizationConstants.orderHandlingarActionDelete}
				subject={itemToDelete?.name}
				destructive
				onConfirm={handleDelete}
			/>
		</div>
	);
}

export default OrderDocumentsOverviewPage;
