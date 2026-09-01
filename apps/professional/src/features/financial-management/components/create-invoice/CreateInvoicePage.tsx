"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, ArrowRight, Eye } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInvoice } from "../../hooks/useCreateInvoice";
import { InvoiceHeaderForm } from "./InvoiceHeaderForm";
import { InvoiceLineItemsTable } from "./InvoiceLineItemsTable";
import { InvoicePaymentPlanTable } from "./InvoicePaymentPlanTable";
import { InvoiceTimeReportTab } from "./InvoiceTimeReportTab";
import { InvoiceAttachmentsTab } from "./InvoiceAttachmentsTab";
import { InvoicePreviewModal } from "./InvoicePreviewModal";

export function CreateInvoicePage() {
	const {
		activeTab,
		setActiveTab,
		previewOpen,
		setPreviewOpen,
		formData,
		updateField,
		addLineItem,
		updateLineItem,
		removeLineItem,
		addPaymentPlanRow,
		updatePaymentPlanRow,
		removePaymentPlanRow,
		addTimeReportRow,
		updateTimeReportRow,
		removeTimeReportRow,
		addAttachments,
		removeAttachment,
		calculations,
		timeReportTotals,
		handleSaveDraft,
		handleSendInvoice,
		handleCancel,
	} = useCreateInvoice();

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen pb-16">
			{/* Page Header */}
			<div className="bg-white border-b border-slate-200 px-8 py-4">
				<div className="flex items-center gap-3">
					<Link href="/module/financial-management/invoice">
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
						<h1 className="text-lg font-bold text-slate-900 leading-tight">
							<Translate text={localizationConstants.createInvoiceTitle} />
						</h1>
						<p className="text-xs text-slate-400 font-normal mt-0.5">
							<Translate text={localizationConstants.createInvoiceStep} />
						</p>
					</div>
				</div>

				{/* Level-2 Tabs Header */}
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

			{/* Main Form Content Area */}
			<div className="px-8 py-6 max-w-7xl mx-auto w-full flex-1">
				{activeTab === "oversikt" && (
					<div>
						{/* Top Header Card */}
						<InvoiceHeaderForm formData={formData} updateField={updateField} />

						{/* Line Items Table & Calculations */}
						<InvoiceLineItemsTable
							items={formData.lineItems}
							onAddItem={addLineItem}
							onUpdateItem={updateLineItem}
							onRemoveItem={removeLineItem}
							calculations={calculations}
						/>

						{/* Payment Plan Table */}
						<InvoicePaymentPlanTable
							items={formData.paymentPlanItems}
							onAddRow={addPaymentPlanRow}
							onUpdateRow={updatePaymentPlanRow}
							onRemoveRow={removePaymentPlanRow}
						/>

						{/* Comment Box */}
						<div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
							<h3 className="text-sm font-semibold text-slate-900 mb-1">
								<Translate text={localizationConstants.createInvoiceCommentTitle} />
							</h3>
							<Label className="text-xs text-slate-500 mb-2 block font-normal">
								<Translate text={localizationConstants.createInvoiceCommentPlaceholder} />
							</Label>
							<Textarea
								rows={4}
								value={formData.comments}
								onChange={(e) => updateField("comments", e.target.value)}
								placeholder="Skriv kommentar här..."
								className="text-xs border-slate-200 resize-y bg-white rounded-md"
							/>
						</div>
					</div>
				)}

				{activeTab === "tidrapport" && (
					<InvoiceTimeReportTab
						formData={formData}
						updateField={updateField}
						onAddRow={addTimeReportRow}
						onUpdateRow={updateTimeReportRow}
						onRemoveRow={removeTimeReportRow}
						totals={timeReportTotals}
					/>
				)}

				{activeTab === "underlag" && (
					<InvoiceAttachmentsTab
						attachments={formData.attachments}
						onAddAttachments={addAttachments}
						onRemoveAttachment={removeAttachment}
					/>
				)}

				{/* Actions Bar matching Figma specs */}
				<div className="flex items-center justify-end gap-3 pt-4 pb-8">
					<Button
						variant="outline"
						onClick={handleCancel}
						className="h-9 px-6 text-xs font-normal border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer bg-white rounded-md"
					>
						<Translate text={localizationConstants.createInvoiceBtnCancel} />
					</Button>

					{/* Preview button is only shown in Tab 1 (Översikt) in Figma */}
					{activeTab === "oversikt" && (
						<Button
							onClick={() => setPreviewOpen(true)}
							className="h-9 px-4 text-xs font-normal bg-zinc-900 hover:bg-slate-800 text-white gap-2 shadow-2xs cursor-pointer rounded-md"
						>
							<Eye className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.createInvoiceBtnPreview} />
							</span>
						</Button>
					)}

					<Button
						onClick={handleSaveDraft}
						className="h-9 px-5 text-xs font-normal bg-zinc-900 hover:bg-slate-800 text-white gap-2 shadow-2xs cursor-pointer rounded-md"
					>
						<Save className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.createInvoiceBtnSave} />
					</Button>

					<Button
						onClick={handleSendInvoice}
						className="h-9 px-6 text-xs font-normal bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-2xs cursor-pointer transition-colors rounded-md"
					>
						<span>
							<Translate text={localizationConstants.createInvoiceBtnSend} />
						</span>
						<ArrowRight className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			{/* Preview Dialog */}
			<InvoicePreviewModal
				open={previewOpen}
				onOpenChange={setPreviewOpen}
				formData={formData}
				calculations={calculations}
			/>
		</div>
	);
}

export default CreateInvoicePage;
