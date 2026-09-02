"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExpenseList } from "../../hooks/useExpenseList";
import { useInvoiceList } from "../../hooks/useInvoiceList";
import { expenseBreadcrumbs } from "../../constants/expense.constants";
import { ExpenseToolbar } from "./ExpenseToolbar";
import { ExpenseListTable } from "./ExpenseListTable";
import { InvoiceToolbar } from "../invoice-list/InvoiceToolbar";
import { InvoiceListTable } from "../invoice-list/InvoiceListTable";
import { InvoiceRemindersTable } from "../invoice-list/InvoiceRemindersTable";

export function ExpenseListPage() {
	const router = useRouter();

	// Top Category Tab: "customer_invoice" (Kundfaktura) | "supplier_invoice" (Leverantörsfaktura)
	const [topCategoryTab, setTopCategoryTab] = useState<"customer_invoice" | "supplier_invoice">("supplier_invoice");

	// Sub-tab under Leverantörsfaktura: "supplier_list" | "inbox"
	const [activeSubTab, setActiveSubTab] = useState<"supplier_list" | "inbox">("supplier_list");

	// Supplier Invoice / Expense State (TFS-498)
	const {
		expenses,
		totalCount,
		availableProjects,
		selectedExpenseIds,
		toggleSelectExpense,
		toggleSelectAll,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		categoryFilter,
		setCategoryFilter,
		projectFilter,
		setProjectFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		confirmDeleteId,
		setConfirmDeleteId,
		executeDelete,
	} = useExpenseList(activeSubTab);

	// Customer Invoice State (TFS-495 / Column 1 in Figma)
	const {
		activeTab: invoiceSubTab,
		setActiveTab: setInvoiceSubTab,
		searchQuery: invoiceSearchQuery,
		setSearchQuery: setInvoiceSearchQuery,
		statusFilter: invoiceStatusFilter,
		setStatusFilter: setInvoiceStatusFilter,
		sortBy: invoiceSortBy,
		sortOrder: invoiceSortOrder,
		handleSort: handleInvoiceSort,
		reminderSortBy,
		reminderSortOrder,
		handleReminderSort,
		selectedInvoiceIds,
		toggleSelectInvoice,
		toggleSelectAllInvoices,
		currentPage: invoiceCurrentPage,
		setCurrentPage: setInvoiceCurrentPage,
		pageSize: invoicePageSize,
		setPageSize: setInvoicePageSize,
		paginatedInvoices,
		totalInvoicePages,
		paginatedReminders,
		totalReminderPages,
		sendSelectedInvoices,
		archiveInvoice,
		deleteInvoice,
	} = useInvoiceList();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.expenseOverviewTitle}
				breadcrumbs={expenseBreadcrumbs}
				className="border-b-0 px-8 pt-5 pb-2"
			/>

			{/* Top Level Category Tabs: Kundfaktura / Leverantörsfaktura */}
			<div className="px-8 border-b border-slate-200 bg-white">
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={() => setTopCategoryTab("customer_invoice")}
						className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
							topCategoryTab === "customer_invoice"
								? "text-slate-900 border-slate-900 font-bold"
								: "text-slate-500 hover:text-slate-900 border-transparent font-medium"
						}`}
					>
						<Translate text={localizationConstants.expenseTopTabCustomerInvoice} />
					</button>

					<button
						type="button"
						onClick={() => setTopCategoryTab("supplier_invoice")}
						className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
							topCategoryTab === "supplier_invoice"
								? "text-slate-900 border-slate-900 font-bold"
								: "text-slate-500 hover:text-slate-900 border-transparent font-medium"
						}`}
					>
						<Translate text={localizationConstants.expenseTopTabSupplierInvoice} />
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="px-8 py-5 flex-1 max-w-7xl mx-auto w-full">
				{topCategoryTab === "supplier_invoice" ? (
					<>
						{/* Sub-tabs: Leverantörs lista / Inbox */}
						<div className="mb-4">
							<div className="inline-flex items-center bg-[#F3F4F6] p-1 rounded-lg gap-1 border border-slate-200/60 shadow-2xs">
								<button
									type="button"
									onClick={() => {
										setActiveSubTab("supplier_list");
										setCurrentPage(1);
									}}
									className={`px-4 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
										activeSubTab === "supplier_list"
											? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80"
											: "text-slate-600 font-normal hover:text-slate-900 hover:bg-white/40 border border-transparent"
									}`}
								>
									<Translate text={localizationConstants.expenseSubTabSupplierList} />
								</button>
								<button
									type="button"
									onClick={() => {
										setActiveSubTab("inbox");
										setCurrentPage(1);
									}}
									className={`px-4 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
										activeSubTab === "inbox"
											? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80"
											: "text-slate-600 font-normal hover:text-slate-900 hover:bg-white/40 border border-transparent"
									}`}
								>
									<Translate text={localizationConstants.expenseSubTabInbox} />
								</button>
							</div>
						</div>

						{/* Search & Filters Toolbar */}
						<ExpenseToolbar
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							statusFilter={statusFilter}
							onStatusFilterChange={setStatusFilter}
							categoryFilter={categoryFilter}
							onCategoryFilterChange={setCategoryFilter}
							projectFilter={projectFilter}
							onProjectFilterChange={setProjectFilter}
							availableProjects={availableProjects}
							onRegisterClick={() => router.push("/module/financial-management/economy/create")}
						/>

						{/* Expense List Table matching Figma 1:1 */}
						<ExpenseListTable
							expenses={expenses}
							totalCount={totalCount}
							selectedIds={selectedExpenseIds}
							onToggleSelect={toggleSelectExpense}
							onToggleSelectAll={toggleSelectAll}
							sortField={sortField}
							sortOrder={sortOrder}
							onSort={handleSort}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageSizeChange={setPageSize}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
							onView={(item) => router.push(`/module/financial-management/economy/${item.id}`)}
							onDelete={(id) => setConfirmDeleteId(id)}
						/>
					</>
				) : (
					/* Kundfaktura / Customer Invoices View (Column 1 in Figma) */
					<>
						{/* Sub-tabs: Fakturalista / Påminnelser */}
						<div className="mb-4">
							<div className="inline-flex items-center bg-[#F3F4F6] p-1 rounded-lg gap-1 border border-slate-200/60 shadow-2xs">
								<button
									type="button"
									onClick={() => {
										setInvoiceSubTab("fakturalista");
										setInvoiceCurrentPage(1);
									}}
									className={`px-4 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
										invoiceSubTab === "fakturalista"
											? "bg-white text-slate-900 shadow-xs font-semibold"
											: "text-slate-600 hover:text-slate-900 hover:bg-white/50"
									}`}
								>
									<Translate text={localizationConstants.invoiceTabList} />
								</button>
								<button
									type="button"
									onClick={() => {
										setInvoiceSubTab("påminnelser");
										setInvoiceCurrentPage(1);
									}}
									className={`px-4 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
										invoiceSubTab === "påminnelser"
											? "bg-white text-slate-900 shadow-xs font-semibold"
											: "text-slate-600 hover:text-slate-900 hover:bg-white/50"
									}`}
								>
									<Translate text={localizationConstants.invoiceTabReminders} />
								</button>
							</div>
						</div>

						{/* Customer Invoice Toolbar */}
						<InvoiceToolbar
							searchQuery={invoiceSearchQuery}
							onSearchChange={setInvoiceSearchQuery}
							statusFilter={invoiceStatusFilter}
							onStatusFilterChange={setInvoiceStatusFilter}
							selectedCount={selectedInvoiceIds.size}
							onSendSelected={sendSelectedInvoices}
						/>

						{/* Customer Invoices Table or Reminders Table */}
						{invoiceSubTab === "fakturalista" ? (
							<InvoiceListTable
								invoices={paginatedInvoices}
								selectedIds={selectedInvoiceIds}
								onToggleSelect={toggleSelectInvoice}
								onToggleSelectAll={toggleSelectAllInvoices}
								sortBy={invoiceSortBy}
								sortOrder={invoiceSortOrder}
								onSort={handleInvoiceSort}
								currentPage={invoiceCurrentPage}
								pageSize={invoicePageSize}
								onPageSizeChange={setInvoicePageSize}
								totalPages={totalInvoicePages}
								onPageChange={setInvoiceCurrentPage}
								onArchive={archiveInvoice}
								onDelete={deleteInvoice}
							/>
						) : (
							<InvoiceRemindersTable
								reminders={paginatedReminders}
								sortBy={reminderSortBy}
								sortOrder={reminderSortOrder}
								onSort={handleReminderSort}
								currentPage={invoiceCurrentPage}
								pageSize={invoicePageSize}
								onPageSizeChange={setInvoicePageSize}
								totalPages={totalReminderPages}
								onPageChange={setInvoiceCurrentPage}
							/>
						)}
					</>
				)}
			</div>

			{/* UX Confirmation Dialog: Delete */}
			<Dialog
				open={confirmDeleteId !== null}
				onOpenChange={(open) => {
					if (!open) setConfirmDeleteId(null);
				}}
			>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmDeleteTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmDeleteDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmDeleteId(null)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeDelete}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseActionDelete} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ExpenseListPage;
