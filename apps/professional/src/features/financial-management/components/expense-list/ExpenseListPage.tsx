"use client";

import React, { useState } from "react";
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
import { expenseBreadcrumbs, EXPENSE_CATEGORIES } from "../../constants/expense.constants";
import { ExpenseCategory } from "../../types/expense.types";
import { expenseRepository } from "../../utils/expenseRepository";
import { ExpenseKpiCards } from "./ExpenseKpiCards";
import { ExpenseToolbar } from "./ExpenseToolbar";
import { ExpenseListTable } from "./ExpenseListTable";
import { ExpenseDetailsModal } from "./ExpenseDetailsModal";
import { toast } from "sonner";

export function ExpenseListPage() {
	const {
		expenses,
		totalCount,
		summaryStats,
		availableProjects,
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

	// Quick Register Modal State
	const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
	const [registerForm, setRegisterForm] = useState({
		supplier: "",
		category: "material" as ExpenseCategory,
		amount: "",
		vatAmount: "",
		date: new Date().toISOString().split("T")[0],
		dueDate: "",
		project: "Storgatan 12 Renovering",
		projectNumber: "PRJ-2025-001",
		costCenter: "CC-101 (Bygg)",
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
			status: "pending",
			date: registerForm.date,
			dueDate: registerForm.dueDate || registerForm.date,
			project: registerForm.project,
			projectNumber: registerForm.projectNumber,
			costCenter: registerForm.costCenter,
			invoiceRef: registerForm.invoiceRef.trim() || undefined,
			notes: registerForm.notes.trim() || undefined,
		});

		toast.success("Utlägget har registrerats");
		setRegisterModalOpen(false);
		setRegisterForm({
			supplier: "",
			category: "material",
			amount: "",
			vatAmount: "",
			date: new Date().toISOString().split("T")[0],
			dueDate: "",
			project: "Storgatan 12 Renovering",
			projectNumber: "PRJ-2025-001",
			costCenter: "CC-101 (Bygg)",
			invoiceRef: "",
			notes: "",
		});
		setFormErrors({});
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen pb-16">
			{/* Page Header */}
			<PageHeader
				title={localizationConstants.expenseOverviewTitle}
				breadcrumbs={expenseBreadcrumbs}
				className="border-b-0 px-8 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="px-8 py-6 max-w-7xl mx-auto w-full flex-1">
				{/* 1. Summary KPI Cards */}
				<ExpenseKpiCards stats={summaryStats} />

				{/* 2. Search & Filters Toolbar */}
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

				{/* 3. Expense List Table */}
				<ExpenseListTable
					expenses={expenses}
					totalCount={totalCount}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					onView={(item) => setSelectedExpense(item)}
					onApprove={(id) => setConfirmApproveId(id)}
					onReject={(id) => setConfirmRejectId(id)}
					onMarkPaid={executeMarkPaid}
					onDelete={(id) => setConfirmDeleteId(id)}
				/>
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

			{/* Modal: Register Expense */}
			<Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
				<DialogContent className="max-w-lg bg-white p-6 rounded-xl shadow-2xl">
					<DialogHeader className="border-b border-slate-100 pb-3">
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseRegisterBtn} />
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
									placeholder="T.ex. Ahlsell Sverige AB"
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
									<Translate text={localizationConstants.expenseColAmount} /> *
								</Label>
								<Input
									type="number"
									value={registerForm.amount}
									onChange={(e) => {
										setRegisterForm({ ...registerForm, amount: e.target.value });
										if (formErrors.amount) setFormErrors({ ...formErrors, amount: "" });
									}}
									placeholder="0.00"
									className={`h-8 text-xs border-slate-200 ${formErrors.amount ? "border-rose-500" : ""}`}
								/>
								{formErrors.amount && (
									<p className="text-[11px] text-rose-500">{formErrors.amount}</p>
								)}
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-semibold text-slate-700">
									Fakturareferens
								</Label>
								<Input
									value={registerForm.invoiceRef}
									onChange={(e) =>
										setRegisterForm({ ...registerForm, invoiceRef: e.target.value })
									}
									placeholder="T.ex. AHL-982341"
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

						<div className="space-y-1">
							<Label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.createInvoiceModalNotes} />
							</Label>
							<Textarea
								rows={3}
								value={registerForm.notes}
								onChange={(e) =>
									setRegisterForm({ ...registerForm, notes: e.target.value })
								}
								placeholder="Beskrivning av utlägget eller artiklar..."
								className="text-xs border-slate-200 resize-y"
							/>
						</div>
					</div>

					<DialogFooter className="border-t border-slate-100 pt-3 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRegisterModalOpen(false)}
							className="text-xs border-slate-200"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={handleSaveNewExpense}
							className="text-xs bg-zinc-900 hover:bg-slate-800 text-white"
						>
							<Translate text={localizationConstants.createInvoiceBtnSave} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* UX: Confirmation Dialog: Approve */}
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
							className="text-xs border-slate-200"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeApprove}
							className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							<Translate text={localizationConstants.expenseActionApprove} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* UX: Confirmation Dialog: Reject */}
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
							className="text-xs border-slate-200"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeReject}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
						>
							<Translate text={localizationConstants.expenseActionReject} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* UX: Confirmation Dialog: Delete */}
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
							className="text-xs border-slate-200"
						>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button
							size="sm"
							onClick={executeDelete}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
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
