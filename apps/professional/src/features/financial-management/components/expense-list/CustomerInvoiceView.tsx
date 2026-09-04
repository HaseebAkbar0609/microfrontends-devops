"use client";

import React from "react";
import { useInvoiceList } from "../../hooks/useInvoiceList";
import { InvoiceToolbar } from "../invoice-list/InvoiceToolbar";
import { InvoiceListTable } from "../invoice-list/InvoiceListTable";

export function CustomerInvoiceView() {
	const {
		searchQuery: invoiceSearchQuery,
		setSearchQuery: setInvoiceSearchQuery,
		statusFilter: invoiceStatusFilter,
		setStatusFilter: setInvoiceStatusFilter,
		sortBy: invoiceSortBy,
		sortOrder: invoiceSortOrder,
		handleSort: handleInvoiceSort,
		selectedInvoiceIds,
		toggleSelectInvoice,
		toggleSelectAllInvoices,
		currentPage: invoiceCurrentPage,
		setCurrentPage: setInvoiceCurrentPage,
		pageSize: invoicePageSize,
		setPageSize: setInvoicePageSize,
		paginatedInvoices,
		totalInvoicePages,
		sendSelectedInvoices,
		archiveInvoice,
		deleteInvoice,
	} = useInvoiceList();

	return (
		<>
			{/* Customer Invoice Toolbar */}
			<InvoiceToolbar
				searchQuery={invoiceSearchQuery}
				onSearchChange={setInvoiceSearchQuery}
				statusFilter={invoiceStatusFilter}
				onStatusFilterChange={setInvoiceStatusFilter}
				selectedCount={selectedInvoiceIds.size}
				onSendSelected={sendSelectedInvoices}
			/>

			{/* Customer Invoices Table matching Figma Image 3 */}
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
		</>
	);
}

export default CustomerInvoiceView;
