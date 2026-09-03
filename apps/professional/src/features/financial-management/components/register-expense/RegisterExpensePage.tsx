"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { registerExpenseBreadcrumbs, EXPENSE_LIST_ROUTE } from "../../constants/expense.constants";
import { useRegisterExpense } from "../../hooks/useRegisterExpense";
import { RegisterExpenseHeaderForm } from "./RegisterExpenseHeaderForm";
import { RegisterExpenseLineItemsTable } from "./RegisterExpenseLineItemsTable";
import { RegisterExpenseSummaryCard } from "./RegisterExpenseSummaryCard";
import { RegisterExpenseAttachmentZone } from "./RegisterExpenseAttachmentZone";
import { ExpenseTimeReportTab } from "./ExpenseTimeReportTab";
import { RegisterExpensePreviewModal } from "./RegisterExpensePreviewModal";
import { RegisterExpenseActions } from "./RegisterExpenseActions";
import { AddNewSupplierModal } from "./AddNewSupplierModal";

export function RegisterExpensePage() {
	const {
		activeTab,
		setActiveTab,
		previewOpen,
		setPreviewOpen,
		formData,
		updateField,
		suppliers,
		handleAddSupplier,
		errors,
		isSaving,
		showDiscardModal,
		setShowDiscardModal,
		showSupplierModal,
		setShowSupplierModal,
		calculations,
		addLineItem,
		updateLineItem,
		removeLineItem,
		addTimeReportRow,
		updateTimeReportRow,
		removeTimeReportRow,
		timeReportTotals,
		addAttachments,
		removeAttachment,
		handleSave,
		handleSaveAndAddAnother,
		handleCancel,
		confirmDiscard,
	} = useRegisterExpense();

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen pb-12">
			{/* Page Header with Back Button & Breadcrumbs */}
			<div className="bg-white border-b border-slate-200 px-8 py-4">
				<div className="flex items-center gap-3">
					<Link href={EXPENSE_LIST_ROUTE}>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Tillbaka"
							className="h-8 w-8 text-slate-700 hover:text-slate-900 cursor-pointer -ml-2"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<PageHeader
							title={localizationConstants.registerExpenseTitle}
							breadcrumbs={registerExpenseBreadcrumbs}
							className="border-b-0 p-0"
						/>
						<p className="text-xs text-slate-400 font-normal mt-0.5">
							<Translate text={localizationConstants.registerExpenseSubtitle} />
						</p>
					</div>
				</div>

				{/* 3-Tab Level-2 Navigation Header matching Customer Invoice */}
				<div className="mt-4 border-b border-slate-200">
					<Tabs
						value={activeTab}
						onValueChange={(val) => setActiveTab(val as "oversikt" | "tidrapport" | "underlag")}
					>
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="oversikt" className="cursor-pointer text-xs font-medium">
								<Translate text={localizationConstants.createInvoiceTabOverview} />
							</TabsTrigger>
							<TabsTrigger value="tidrapport" className="cursor-pointer text-xs font-medium">
								<Translate text={localizationConstants.createInvoiceTabTimeReport} />
							</TabsTrigger>
							<TabsTrigger value="underlag" className="cursor-pointer text-xs font-medium">
								<Translate text={localizationConstants.createInvoiceTabAttachments} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			{/* Main Form Content */}
			<div className="px-8 py-6 max-w-7xl mx-auto w-full flex-1">
				{/* Tab 1: Översikt */}
				{activeTab === "oversikt" && (
					<div>
						<RegisterExpenseHeaderForm
							formData={formData}
							updateField={updateField}
							suppliers={suppliers}
							onOpenAddSupplier={() => setShowSupplierModal(true)}
							errors={errors}
						/>

						<RegisterExpenseLineItemsTable
							items={formData.lineItems}
							onAddItem={addLineItem}
							onUpdateItem={updateLineItem}
							onRemoveItem={removeLineItem}
							error={errors.lineItems}
						/>

						<RegisterExpenseSummaryCard calculations={calculations} />

						{/* Comments Box */}
						<div className="bg-white rounded-lg border border-slate-200 p-6 mb-5 shadow-2xs">
							<h3 className="text-sm font-semibold text-slate-900 mb-2">Kommentar / Anteckningar</h3>
							<Textarea
								rows={3}
								value={formData.comments || ""}
								onChange={(e) => updateField("comments", e.target.value)}
								placeholder="Skriv eventuella interna kommentarer om utgiften..."
								className="text-xs border-slate-200 bg-white rounded-md resize-y"
							/>
						</div>
					</div>
				)}

				{/* Tab 2: Tidrapport */}
				{activeTab === "tidrapport" && (
					<ExpenseTimeReportTab
						formData={formData}
						updateField={updateField}
						onAddRow={addTimeReportRow}
						onUpdateRow={updateTimeReportRow}
						onRemoveRow={removeTimeReportRow}
						totals={timeReportTotals}
					/>
				)}

				{/* Tab 3: Underlag */}
				{activeTab === "underlag" && (
					<RegisterExpenseAttachmentZone
						attachments={formData.attachments}
						onAddAttachments={addAttachments}
						onRemoveAttachment={removeAttachment}
					/>
				)}

				{/* Footer Action Bar */}
				<RegisterExpenseActions
					onCancel={handleCancel}
					onPreview={() => setPreviewOpen(true)}
					onSaveAndAdd={handleSaveAndAddAnother}
					onSave={handleSave}
					isSaving={isSaving}
				/>
			</div>

			{/* Add New Supplier Modal */}
			<AddNewSupplierModal
				open={showSupplierModal}
				onOpenChange={setShowSupplierModal}
				onAddSupplier={handleAddSupplier}
			/>

			{/* Expense Preview Modal */}
			<RegisterExpensePreviewModal
				open={previewOpen}
				onOpenChange={setPreviewOpen}
				formData={formData}
				calculations={calculations}
			/>

			{/* Discard Changes Confirmation Dialog (Standard #5) */}
			<Dialog open={showDiscardModal} onOpenChange={setShowDiscardModal}>
				<DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl border-slate-200">
					<DialogHeader>
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.registerExpenseConfirmDiscardTitle} />
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-600 mt-2">
							<Translate text={localizationConstants.registerExpenseConfirmDiscardDesc} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowDiscardModal(false)}
							className="text-xs border-slate-200 cursor-pointer"
						>
							<Translate text={localizationConstants.registerExpenseConfirmKeepEditingBtn} />
						</Button>
						<Button
							size="sm"
							onClick={confirmDiscard}
							className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.registerExpenseConfirmDiscardBtn} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default RegisterExpensePage;
