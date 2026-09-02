"use client";

import React, { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useExpenseList } from "../../hooks/useExpenseList";
import { useInvoiceList } from "../../hooks/useInvoiceList";
import { expenseBreadcrumbs, EXPENSE_CATEGORIES } from "../../constants/expense.constants";
import { ExpenseCategory } from "../../types/expense.types";
import { expenseRepository } from "../../utils/expenseRepository";
import { ExpenseToolbar } from "./ExpenseToolbar";
import { ExpenseListTable } from "./ExpenseListTable";
import { ExpenseDetailsModal } from "./ExpenseDetailsModal";
import { InvoiceToolbar } from "../invoice-list/InvoiceToolbar";
import { InvoiceListTable } from "../invoice-list/InvoiceListTable";
import { InvoiceRemindersTable } from "../invoice-list/InvoiceRemindersTable";
import { toast } from "sonner";

export function ExpenseListPage() {
	// Top Category Tab: "customer_invoice" (Kundfaktura) | "supplier_invoice" (Leverantörsfaktura)
	const [topCategoryTab, setTopCategoryTab] = useState<"customer_invoice" | "supplier_invoice">("supplier_invoice");

	// Supplier Invoice / Expense State (TFS-498)
	const {
		activeSubTab,
		setActiveSubTab,
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
		selectedExpense,
		setSelectedExpense,
		confirmApproveId,
		setConfirmApproveId,
		confirmRejectId,
		setConfirmRejectId,
		confirmDeleteId,
		setConfirmDeleteId,
		executeApprove,
		executeReject,
		executeMarkPaid,
		executeDelete,
	} = useExpenseList();

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

	// Quick Register Modal State (TFS-499 hook)
	const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
	const [registerForm, setRegisterForm] = useState({
		supplier: "",
		category: "material" as ExpenseCategory,
		amount: "",
		vatAmount: "",
		date: new Date().toISOString().split("T")[0],
		dueDate: "",
		project: "Projekt 2025-001",
		projectNumber: "PRJ-2025-001",
		costCenter: "CC-101 (Bygg)",
		attestResponsible: "Kalle Andersson",
		invoiceRef: "",
		notes: "",
	});

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const handleSaveNewExpense = () => {
		const errors: Record<string, string> = {};
		if (!registerForm.supplier.trim()) errors.supplier = "Leverantör är obligatoriskt";
		if (!registerForm.amount || Number(registerForm.amount) <= 0) errors.amount = "Ange ett giltigt belopp";
		if (!registerForm.date) errors.date = "Datum är obligatoriskt";

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		const numAmount = Number(registerForm.amount);
		const numVat = registerForm.vatAmount ? Number(registerForm.vatAmount) : Math.round(numAmount * 0.25);

		expenseRepository.createExpense({
			supplier: registerForm.supplier.trim(),
			category: registerForm.category,
			amount: numAmount,
			vatAmount: numVat,
			status: "ej_attesterad",
			date: registerForm.date,
			invoiceDate: registerForm.date,
			dueDate: registerForm.dueDate || registerForm.date,
			project: registerForm.project,
			projectNumber: registerForm.projectNumber,
			costCenter: registerForm.costCenter,
			attestResponsible: registerForm.attestResponsible,
			invoiceRef: registerForm.invoiceRef.trim() || undefined,
			notes: registerForm.notes.trim() || undefined,
			isInboxItem: true,
		});

		toast.success("Leverantörsfakturan har registrerats");
		setRegisterModalOpen(false);
		setRegisterForm({
			supplier: "",
			category: "material",
			amount: "",
			vatAmount: "",
			date: new Date().toISOString().split("T")[0],
			dueDate: "",
			project: "Projekt 2025-001",
			projectNumber: "PRJ-2025-001",
			costCenter: "CC-101 (Bygg)",
			attestResponsible: "Kalle Andersson",
			invoiceRef: "",
			notes: "",
		});
		setFormErrors({});
	};

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
							<Tabs
								value={activeSubTab}
								onValueChange={(val) => setActiveSubTab(val as "supplier_list" | "inbox")}
							>
								<TabsList className="bg-slate-100 p-0.5 rounded-lg h-8">
									<TabsTrigger
										value="supplier_list"
										className="text-xs font-medium px-4 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs cursor-pointer"
									>
										<Translate text={localizationConstants.expenseSubTabSupplierList} />
									</TabsTrigger>
									<TabsTrigger
										value="inbox"
										className="text-xs font-medium px-4 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs cursor-pointer"
									>
										<Translate text={localizationConstants.expenseSubTabInbox} />
									</TabsTrigger>
								</TabsList>
							</Tabs>
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
							onRegisterClick={() => setRegisterModalOpen(true)}
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
							onView={(item) => setSelectedExpense(item)}
							onDelete={(id) => setConfirmDeleteId(id)}
						/>
					</>
				) : (
					/* Kundfaktura / Customer Invoices View (Column 1 in Figma) */
					<>
						{/* Sub-tabs: Fakturalista / Påminnelser */}
						<div className="mb-4">
							<Tabs
								value={invoiceSubTab}
								onValueChange={(val) => {
									setInvoiceSubTab(val as "fakturalista" | "påminnelser");
									setInvoiceCurrentPage(1);
								}}
							>
								<TabsList className="bg-slate-100 p-0.5 rounded-lg h-8">
									<TabsTrigger
										value="fakturalista"
										className="text-xs font-medium px-4 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs cursor-pointer"
									>
										<Translate text={localizationConstants.invoiceTabList} />
									</TabsTrigger>
									<TabsTrigger
										value="påminnelser"
										className="text-xs font-medium px-4 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs cursor-pointer"
									>
										<Translate text={localizationConstants.invoiceTabReminders} />
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Customer Invoice Toolbar */}
						<InvoiceToolbar
							searchQuery={invoiceSearchQuery}
							onSearchChange={(q) => {
								setInvoiceSearchQuery(q);
								setInvoiceCurrentPage(1);
							}}
							statusFilter={invoiceStatusFilter}
							onStatusFilterChange={(s) => {
								setInvoiceStatusFilter(s);
								setInvoiceCurrentPage(1);
							}}
							selectedCount={invoiceSubTab === "fakturalista" ? selectedInvoiceIds.size : 0}
							onSendSelected={sendSelectedInvoices}
						/>

						{/* Customer Invoice Tables */}
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

			{/* Modal: View Details */}
			<ExpenseDetailsModal
				expense={selectedExpense}
				open={selectedExpense !== null}
				onOpenChange={(open) => {
					if (!open) setSelectedExpense(null);
				}}
				onApprove={(id) => setConfirmApproveId(id)}
				onReject={(id) => setConfirmRejectId(id)}
				onMarkPaid={executeMarkPaid}
			/>

			{/* Modal: Register Expense (TFS-499) */}
			<Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
				<DialogContent className="max-w-lg bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader className="border-b border-slate-100 pb-3">
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseAddSupplierInvoiceBtn} />
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-3 py-3 text-xs">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColSupplier} /> *
								</Label>
								<Input
									value={registerForm.supplier}
									onChange={(e) => {
										setRegisterForm({ ...registerForm, supplier: e.target.value });
										if (formErrors.supplier) setFormErrors({ ...formErrors, supplier: "" });
									}}
									placeholder="T.ex. Biejer Byggmaterial AB"
									className={`h-8 text-xs border-slate-200 ${formErrors.supplier ? "border-rose-500" : ""}`}
								/>
								{formErrors.supplier && (
									<p className="text-[11px] text-rose-500">{formErrors.supplier}</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColCategory} /> *
								</Label>
								<Select
									value={registerForm.category}
									onValueChange={(val) =>
										setRegisterForm({ ...registerForm, category: val as ExpenseCategory })
									}
								>
									<SelectTrigger className="h-8 text-xs border-slate-200">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200">
										{EXPENSE_CATEGORIES.map((cat) => (
											<SelectItem key={cat.value} value={cat.value} className="text-xs">
												<Translate text={cat.labelKey} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColAmount} /> (SEK) *
								</Label>
								<Input
									type="number"
									value={registerForm.amount}
									onChange={(e) => {
										setRegisterForm({ ...registerForm, amount: e.target.value });
										if (formErrors.amount) setFormErrors({ ...formErrors, amount: "" });
									}}
									placeholder="150000"
									className={`h-8 text-xs border-slate-200 ${formErrors.amount ? "border-rose-500" : ""}`}
								/>
								{formErrors.amount && (
									<p className="text-[11px] text-rose-500">{formErrors.amount}</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColInvoiceNo} />
								</Label>
								<Input
									value={registerForm.invoiceRef}
									onChange={(e) =>
										setRegisterForm({ ...registerForm, invoiceRef: e.target.value })
									}
									placeholder="T.ex. 456989"
									className="h-8 text-xs border-slate-200"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColDate} /> *
								</Label>
								<Input
									type="date"
									value={registerForm.date}
									onChange={(e) => {
										setRegisterForm({ ...registerForm, date: e.target.value });
										if (formErrors.date) setFormErrors({ ...formErrors, date: "" });
									}}
									className={`h-8 text-xs border-slate-200 ${formErrors.date ? "border-rose-500" : ""}`}
								/>
								{formErrors.date && (
									<p className="text-[11px] text-rose-500">{formErrors.date}</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColDueDate} />
								</Label>
								<Input
									type="date"
									value={registerForm.dueDate}
									onChange={(e) =>
										setRegisterForm({ ...registerForm, dueDate: e.target.value })
									}
									className="h-8 text-xs border-slate-200"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColObject} />
								</Label>
								<Input
									value={registerForm.project}
									onChange={(e) =>
										setRegisterForm({ ...registerForm, project: e.target.value })
									}
									placeholder="Projekt 2025-001"
									className="h-8 text-xs border-slate-200"
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									<Translate text={localizationConstants.expenseColAttestResponsible} />
								</Label>
								<Input
									value={registerForm.attestResponsible}
									onChange={(e) =>
										setRegisterForm({ ...registerForm, attestResponsible: e.target.value })
									}
									placeholder="Kalle Andersson"
									className="h-8 text-xs border-slate-200"
								/>
							</div>
						</div>

						<div className="space-y-1">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.createInvoiceModalNotes} />
							</Label>
							<Textarea
								rows={2}
								value={registerForm.notes}
								onChange={(e) =>
									setRegisterForm({ ...registerForm, notes: e.target.value })
								}
								placeholder="Beskrivning av leverans eller inköp..."
								className="text-xs border-slate-200 resize-y"
							/>
						</div>
					</div>

					<DialogFooter className="border-t border-slate-100 pt-3 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRegisterModalOpen(false)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={handleSaveNewExpense}
							className="text-xs bg-zinc-950 hover:bg-slate-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnSave} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* UX Confirmation Dialog: Approve */}
			<Dialog
				open={confirmApproveId !== null}
				onOpenChange={(open) => {
					if (!open) setConfirmApproveId(null);
				}}
			>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmApproveTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmApproveDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmApproveId(null)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeApprove}
							className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseActionApprove} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* UX Confirmation Dialog: Reject */}
			<Dialog
				open={confirmRejectId !== null}
				onOpenChange={(open) => {
					if (!open) setConfirmRejectId(null);
				}}
			>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseConfirmRejectTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.expenseConfirmRejectDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setConfirmRejectId(null)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeReject}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.expenseActionReject} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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
