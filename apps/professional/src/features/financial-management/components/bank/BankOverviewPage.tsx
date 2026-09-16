"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBank } from "../../hooks/useBank";
import { BankOverviewHeader } from "./BankOverviewHeader";
import { BankkontonTabView } from "./BankkontonTabView";
import { BankLoansTabView } from "./BankLoansTabView";
import { BankDocumentsTabView } from "./BankDocumentsTabView";
import { AddBankDocumentModal } from "./AddBankDocumentModal";
import { BankDeleteDialog } from "./BankDeleteDialog";
import { BANK_CREATE_ROUTE, BANK_LOANS_CREATE_ROUTE } from "../../constants/bank.constants";
import type { BankTabType } from "../../types/bank.types";

interface BankOverviewPageProps {
	initialTab?: BankTabType;
}

export function BankOverviewPage({ initialTab = "bankkonton" }: BankOverviewPageProps) {
	const router = useRouter();
	const {
		activeTab,
		setActiveTab,
		accounts,
		loans,
		allLoans,
		documents,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		// Documents
		docTotalCount,
		docCurrentPage,
		setDocCurrentPage,
		docPageSize,
		setDocPageSize,
		docTotalPages,
		docSearchQuery,
		setDocSearchQuery,
		docFileTypeFilter,
		setDocFileTypeFilter,
		docSortBy,
		docSortOrder,
		handleDocSort,
		// Modals & Dialogs
		isAddDocOpen,
		setIsAddDocOpen,
		itemToDelete,
		setItemToDelete,
		// Actions
		deleteAccount,
		deleteLoan,
		addDocument,
		deleteDocument,
	} = useBank(initialTab);

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-12">
			<BankOverviewHeader
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* Tab Views */}
			{activeTab === "bankkonton" && (
				<BankkontonTabView
					accounts={accounts}
					onCreateAccount={() => router.push(BANK_CREATE_ROUTE)}
				/>
			)}

			{activeTab === "lan-finansiering" && (
				<BankLoansTabView
					loans={loans}
					totalCount={totalCount}
					currentPage={currentPage}
					pageSize={pageSize}
					totalPages={totalPages}
					searchQuery={searchQuery}
					statusFilter={statusFilter}
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSearchChange={setSearchQuery}
					onStatusFilterChange={setStatusFilter}
					onSort={handleSort}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
					onCreateClick={() => router.push(BANK_LOANS_CREATE_ROUTE)}
					onDeleteLoan={(id, title) =>
						setItemToDelete({ id, title, type: "loan" })
					}
				/>
			)}

			{activeTab === "bank-dokument" && (
				<BankDocumentsTabView
					documents={documents}
					totalCount={docTotalCount}
					currentPage={docCurrentPage}
					pageSize={docPageSize}
					totalPages={docTotalPages}
					searchQuery={docSearchQuery}
					onSearchChange={setDocSearchQuery}
					fileTypeFilter={docFileTypeFilter}
					onFileTypeFilterChange={setDocFileTypeFilter}
					sortBy={docSortBy}
					sortOrder={docSortOrder}
					onSort={handleDocSort}
					onPageChange={setDocCurrentPage}
					onPageSizeChange={setDocPageSize}
					onUploadClick={() => setIsAddDocOpen(true)}
					onDeleteDocument={(id, title) =>
						setItemToDelete({ id, title, type: "document" })
					}
				/>
			)}

			{/* Upload Document Modal */}
			<AddBankDocumentModal
				isOpen={isAddDocOpen}
				onClose={() => setIsAddDocOpen(false)}
				onSubmit={(doc) => addDocument(doc)}
				loans={allLoans}
				accounts={accounts}
			/>

			{/* Delete Confirmation Dialog */}
			<BankDeleteDialog
				item={itemToDelete}
				isOpen={itemToDelete !== null}
				onClose={() => setItemToDelete(null)}
				onConfirm={(id, type) => {
					if (type === "loan") {
						deleteLoan(id);
					} else if (type === "document") {
						deleteDocument(id);
					} else {
						deleteAccount(id);
					}
				}}
			/>
		</div>
	);
}

export default BankOverviewPage;
