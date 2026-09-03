"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useInvoiceList } from "../../hooks/useInvoiceList";
import {
	EXPENSE_SUB_TAB_CONTAINER_CLASS,
	EXPENSE_SUB_TAB_ACTIVE_CLASS,
	EXPENSE_SUB_TAB_INACTIVE_CLASS,
} from "../../constants/expense.constants";
import { InvoiceToolbar } from "../invoice-list/InvoiceToolbar";
import { InvoiceListTable } from "../invoice-list/InvoiceListTable";
import { InvoiceRemindersTable } from "../invoice-list/InvoiceRemindersTable";

export function CustomerInvoiceView() {
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
		<>
			{/* Sub-tabs: Fakturalista / Påminnelser */}
			<div className="mb-4">
				<div className={EXPENSE_SUB_TAB_CONTAINER_CLASS}>
					<button
						type="button"
						onClick={() => {
							setInvoiceSubTab("fakturalista");
							setInvoiceCurrentPage(1);
						}}
						className={
							invoiceSubTab === "fakturalista"
								? EXPENSE_SUB_TAB_ACTIVE_CLASS
								: EXPENSE_SUB_TAB_INACTIVE_CLASS
						}
					>
						<Translate text={localizationConstants.invoiceTabList} />
					</button>
					<button
						type="button"
						onClick={() => {
							setInvoiceSubTab("påminnelser");
							setInvoiceCurrentPage(1);
						}}
						className={
							invoiceSubTab === "påminnelser"
								? EXPENSE_SUB_TAB_ACTIVE_CLASS
								: EXPENSE_SUB_TAB_INACTIVE_CLASS
						}
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
	);
}

export default CustomerInvoiceView;
