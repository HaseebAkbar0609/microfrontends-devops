"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBank } from "../../hooks/useBank";
import { BANK_BASE_ROUTE } from "../../constants/bank.constants";
import { BankOverviewHeader } from "./BankOverviewHeader";
import { BankkontonTabView } from "./BankkontonTabView";
import { BankLoansTabView } from "./BankLoansTabView";
import { BankDocumentsTabView } from "./BankDocumentsTabView";
import { CreateBankAccountModal } from "./CreateBankAccountModal";
import { CreateBankLoanModal } from "./CreateBankLoanModal";
import { AddBankDocumentModal } from "./AddBankDocumentModal";
import { BankDeleteDialog } from "./BankDeleteDialog";
import { BankSelectionModal } from "./BankSelectionModal";
import { BankIdConnectModal } from "./BankIdConnectModal";
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
		// Modals
		isCreateAccountOpen,
		setIsCreateAccountOpen,
		isCreateLoanOpen,
		setIsCreateLoanOpen,
		isAddDocOpen,
		setIsAddDocOpen,
		isSelectBankOpen,
		setIsSelectBankOpen,
		isBankIdModalOpen,
		setIsBankIdModalOpen,
		selectedBankForConnect,
		setSelectedBankForConnect,
		editingAccount,
		setEditingAccount,
		editingLoan,
		setEditingLoan,
		itemToDelete,
		setItemToDelete,
		// Actions
		createAccount,
		updateAccount,
		deleteAccount,
		connectWithBankId,
		createLoan,
		updateLoan,
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
					onEditAccount={(acc) => setEditingAccount(acc)}
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
					onViewLoan={(id) => router.push(`${BANK_BASE_ROUTE}/loans/${id}`)}
					onEditLoan={(loan) => setEditingLoan(loan)}
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

			{/* Bank Selection Modal */}
			<BankSelectionModal
				isOpen={isSelectBankOpen}
				onClose={() => setIsSelectBankOpen(false)}
				onSelectBankForBankId={(bankName) => {
					setSelectedBankForConnect(bankName);
					setIsSelectBankOpen(false);
					setIsBankIdModalOpen(true);
				}}
				onSelectManual={() => {
					setIsSelectBankOpen(false);
					router.push(BANK_CREATE_ROUTE);
				}}
			/>

			{/* BankID PSD2 Connect Modal */}
			<BankIdConnectModal
				isOpen={isBankIdModalOpen}
				onClose={() => setIsBankIdModalOpen(false)}
				bankName={selectedBankForConnect}
				onSuccess={(bankName, pNum) => {
					connectWithBankId(bankName, pNum);
				}}
			/>

			{/* Modals & Dialogs */}
			<CreateBankAccountModal
				isOpen={isCreateAccountOpen || editingAccount !== null}
				onClose={() => {
					setIsCreateAccountOpen(false);
					setEditingAccount(null);
				}}
				onSubmit={(data) => {
					if (editingAccount) {
						updateAccount(editingAccount.id, data);
					} else {
						createAccount(data);
					}
				}}
				initialData={editingAccount}
			/>

			<CreateBankLoanModal
				isOpen={isCreateLoanOpen || editingLoan !== null}
				onClose={() => {
					setIsCreateLoanOpen(false);
					setEditingLoan(null);
				}}
				onSubmit={(data) => {
					if (editingLoan) {
						updateLoan(editingLoan.id, data);
					} else {
						createLoan(data as import("../../types/bank.types").BankLoanFormData);
					}
				}}
				initialData={editingLoan}
			/>

			<AddBankDocumentModal
				isOpen={isAddDocOpen}
				onClose={() => setIsAddDocOpen(false)}
				onSubmit={(doc) => addDocument(doc)}
				loans={allLoans}
				accounts={accounts}
			/>

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
