"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { invoiceBreadcrumbs } from "../../constants/invoice.constants";
import { useInvoiceList } from "../../hooks/useInvoiceList";
import { InvoiceToolbar } from "./InvoiceToolbar";
import { InvoiceListTable } from "./InvoiceListTable";
import { InvoiceRemindersTable } from "./InvoiceRemindersTable";

export function InvoiceListPage() {
	const {
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		reminderSortBy,
		reminderSortOrder,
		handleReminderSort,
		selectedInvoiceIds,
		toggleSelectInvoice,
		toggleSelectAllInvoices,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
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
				title={localizationConstants.invoiceOverviewTitle}
				breadcrumbs={invoiceBreadcrumbs}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<Tabs
					value={activeTab}
					onValueChange={(val) => {
						setActiveTab(val as "fakturalista" | "påminnelser");
						setCurrentPage(1);
					}}
					className="flex-1"
				>
					{/* 2-Level Tab Navigation: Fakturalista / Påminnelser */}
					<div className="flex items-center border-b border-slate-200 mb-5 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="fakturalista" className="cursor-pointer">
								<Translate text={localizationConstants.invoiceTabList} />
							</TabsTrigger>
							<TabsTrigger value="påminnelser" className="cursor-pointer">
								<Translate text={localizationConstants.invoiceTabReminders} />
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Toolbar: Search, Filters, Bulk Send & Create CTA */}
					<InvoiceToolbar
						searchQuery={searchQuery}
						onSearchChange={(q) => {
							setSearchQuery(q);
							setCurrentPage(1);
						}}
						statusFilter={statusFilter}
						onStatusFilterChange={(s) => {
							setStatusFilter(s);
							setCurrentPage(1);
						}}
						selectedCount={activeTab === "fakturalista" ? selectedInvoiceIds.size : 0}
						onSendSelected={sendSelectedInvoices}
					/>

					{/* Tab 1: Fakturalista */}
					<TabsContent value="fakturalista" className="mt-0">
						<InvoiceListTable
							invoices={paginatedInvoices}
							selectedIds={selectedInvoiceIds}
							onToggleSelect={toggleSelectInvoice}
							onToggleSelectAll={toggleSelectAllInvoices}
							sortBy={sortBy}
							sortOrder={sortOrder}
							onSort={handleSort}
							currentPage={currentPage}
							totalPages={totalInvoicePages}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
							onPageSizeChange={setPageSize}
							onArchive={archiveInvoice}
							onDelete={deleteInvoice}
						/>
					</TabsContent>

					{/* Tab 2: Påminnelser */}
					<TabsContent value="påminnelser" className="mt-0">
						<InvoiceRemindersTable
							reminders={paginatedReminders}
							sortBy={reminderSortBy}
							sortOrder={reminderSortOrder}
							onSort={handleReminderSort}
							currentPage={currentPage}
							totalPages={totalReminderPages}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
							onPageSizeChange={setPageSize}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default InvoiceListPage;
