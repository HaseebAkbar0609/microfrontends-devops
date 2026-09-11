"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBank } from "../../hooks/useBank";
import { BANK_BASE_ROUTE } from "../../constants/bank.constants";
import { BankkontonTabView } from "./BankkontonTabView";
import { BankLoansTabView } from "./BankLoansTabView";
import { BankDocumentsTabView } from "./BankDocumentsTabView";
import { CreateBankAccountModal } from "./CreateBankAccountModal";
import { CreateBankLoanModal } from "./CreateBankLoanModal";
import { AddBankDocumentModal } from "./AddBankDocumentModal";
import { BankDeleteDialog } from "./BankDeleteDialog";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankTabType } from "../../types/bank.types";
import { ChevronRight } from "lucide-react";

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
		// Modals
		isCreateAccountOpen,
		setIsCreateAccountOpen,
		isCreateLoanOpen,
		setIsCreateLoanOpen,
		isAddDocOpen,
		setIsAddDocOpen,
		editingAccount,
		setEditingAccount,
		editingLoan,
		setEditingLoan,
		itemToDelete,
		setItemToDelete,
		// Actions
		createAccount,
		updateAccount,
		createLoan,
		updateLoan,
		deleteLoan,
		addDocument,
		deleteDocument,
	} = useBank(initialTab);

	const tabs: { id: BankTabType; labelKey: string }[] = [
		{ id: "bankkonton", labelKey: localizationConstants.tabBankAccounts },
		{ id: "lan-finansiering", labelKey: localizationConstants.tabBankLoans },
		{ id: "bank-dokument", labelKey: localizationConstants.tabBankDocs },
	];

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-12">
			{/* Page Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
					<Translate text={localizationConstants.titleBank} />
				</h1>
				<div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1.5 font-medium">
					<span>Home</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span>Modul</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span>Ekonomi</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span className="text-[#0F172A] font-semibold">Bank</span>
				</div>
			</div>

			{/* Sub-navigation Tabs */}
			<div className="flex items-center gap-8 border-b border-[#E2E8F0] mb-6">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
								isActive
									? "text-[#0F172A] border-b-2 border-[#0F172A]"
									: "text-[#64748B] hover:text-[#0F172A]"
							}`}
						>
							<Translate text={tab.labelKey} />
						</button>
					);
				})}
			</div>

			{/* Tab Views */}
			{activeTab === "bankkonton" && (
				<BankkontonTabView
					accounts={accounts}
					onEditAccount={(acc) => setEditingAccount(acc)}
					onCreateAccount={() => setIsCreateAccountOpen(true)}
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
					onCreateClick={() => setIsCreateLoanOpen(true)}
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
					onUploadClick={() => setIsAddDocOpen(true)}
					onDeleteDocument={(id, title) =>
						setItemToDelete({ id, title, type: "document" })
					}
				/>
			)}

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
			/>

			<BankDeleteDialog
				item={itemToDelete}
				isOpen={itemToDelete !== null}
				onClose={() => setItemToDelete(null)}
				onConfirm={(id, type) => {
					if (type === "loan") {
						deleteLoan(id);
					} else {
						deleteDocument(id);
					}
				}}
			/>
		</div>
	);
}

export default BankOverviewPage;
