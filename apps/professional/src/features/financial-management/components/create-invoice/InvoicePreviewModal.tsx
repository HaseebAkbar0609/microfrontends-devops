"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateInvoiceFormData, InvoiceLineItem } from "../../types/createInvoice.types";

interface InvoiceCalculations {
	delsumma: number;
	totalDiscount: number;
	totalMarkup: number;
	totalRotRut: number;
	totalExclVat: number;
	vatAmount: number;
	attErhalla: number;
}

interface InvoicePreviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: CreateInvoiceFormData;
	calculations: InvoiceCalculations;
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE");
}

/* =========================================================================
   Subcomponent: InvoicePreviewHeader
   ========================================================================= */
interface InvoicePreviewHeaderProps {
	formData: CreateInvoiceFormData;
}

function InvoicePreviewHeader({ formData }: InvoicePreviewHeaderProps) {
	return (
		<div className="space-y-6">
			{/* Top Metadata & Issuer Details */}
			<div className="flex justify-between items-start border-b border-slate-200 pb-6">
				<div>
					<h2 className="text-2xl font-black text-slate-900 tracking-tight">
						<Translate text={localizationConstants.createInvoiceModalInvoice} />
					</h2>
					<div className="mt-2 space-y-0.5 text-slate-600">
						<p>
							<Translate text={localizationConstants.createInvoiceModalInvoiceNo} />:{" "}
							<span className="font-semibold text-slate-900">{formData.invoiceNo}</span>
						</p>
						<p>
							<Translate text={localizationConstants.createInvoiceModalDate} />:{" "}
							<span className="text-slate-800">{formData.invoiceDate}</span>
						</p>
						<p>
							<Translate text={localizationConstants.createInvoiceModalDueDate} />:{" "}
							<span className="text-slate-800">2026-03-15</span>
						</p>
						<p>
							<Translate text={localizationConstants.createInvoiceModalOCR} />:{" "}
							<span className="font-mono text-slate-800">{formData.invoiceNo}456301</span>
						</p>
					</div>
				</div>

				<div className="text-right space-y-0.5 text-slate-600">
					<h3 className="font-bold text-sm text-slate-900">Kalles Bygg & Entreprenad AB</h3>
					<p>Org.nr: 556123-4567</p>
					<p>Momsreg.nr: SE556123456701</p>
					<p>Storgatan 12, 111 22 Stockholm</p>
					<p>
						<Translate text={localizationConstants.createInvoiceModalBankgiro} />: 123-4567
					</p>
					<p className="text-[11px] text-slate-500 font-medium pt-1">
						<Translate text={localizationConstants.createInvoiceModalFtax} />
					</p>
				</div>
			</div>

			{/* Customer & Project Information Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.createInvoiceModalBillTo} />
					</p>
					<p className="font-bold text-sm text-slate-900 pt-0.5">{formData.customer}</p>
					<p className="text-slate-600">Att: {formData.contactPerson}</p>
					<p className="text-slate-600">Projekt: {formData.projectName} ({formData.projectNumber})</p>
				</div>

				<div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.createInvoiceModalProjectInfo} />
					</p>
					<p className="text-slate-600 pt-0.5">
						<Translate text={localizationConstants.createInvoiceModalPricingModel} />:{" "}
						<span className="font-medium text-slate-800 capitalize">{formData.pricingModel}</span>
					</p>
					<p className="text-slate-600">
						<Translate text={localizationConstants.createInvoiceModalRotRut} />:{" "}
						<span className="font-medium text-slate-800 uppercase">{formData.rotRutType}</span>
					</p>
					<p className="text-slate-600">
						<Translate text={localizationConstants.createInvoiceFieldCategory} />:{" "}
						<span className="font-medium text-slate-800">{formData.category}</span>
					</p>
					<p className="text-slate-600">
						<Translate text={localizationConstants.createInvoiceModalPaymentTerms} />:{" "}
						<span className="text-slate-800">30 dagar netto</span>
					</p>
				</div>
			</div>
		</div>
	);
}

/* =========================================================================
   Subcomponent: InvoicePreviewTable
   ========================================================================= */
interface InvoicePreviewTableProps {
	lineItems: InvoiceLineItem[];
}

function InvoicePreviewTable({ lineItems }: InvoicePreviewTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b-2 border-slate-300 text-slate-700 text-[11px] font-semibold">
						<th className="py-2.5 px-2 w-20">
							<Translate text={localizationConstants.createInvoiceLineColArticle} />
						</th>
						<th className="py-2.5 px-2">
							<Translate text={localizationConstants.createInvoiceLineColDesc} />
						</th>
						<th className="py-2.5 px-2 text-right w-16">
							<Translate text={localizationConstants.createInvoiceLineColQty} />
						</th>
						<th className="py-2.5 px-2 w-16 text-left">
							<Translate text={localizationConstants.createInvoiceLineColUnit} />
						</th>
						<th className="py-2.5 px-2 text-right w-24">
							<Translate text={localizationConstants.createInvoiceLineColPrice} />
						</th>
						<th className="py-2.5 px-2 text-right w-24">
							<Translate text={localizationConstants.createInvoiceLineColHandling} />
						</th>
						<th className="py-2.5 px-2 text-right w-28">
							<Translate text={localizationConstants.createInvoiceLineColTotal} /> (SEK)
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{lineItems.map((item) => (
						<tr key={item.id} className="hover:bg-slate-50/50">
							<td className="py-2 px-2 font-medium text-slate-700">{item.articleId}</td>
							<td className="py-2 px-2 text-slate-900">{item.description || "Tjänst / Artikel"}</td>
							<td className="py-2 px-2 text-right font-medium">{item.quantity}</td>
							<td className="py-2 px-2 text-slate-600">{item.unit}</td>
							<td className="py-2 px-2 text-right text-slate-700">{formatNum(item.unitPrice)}</td>
							<td className="py-2 px-2 text-right text-slate-600">
								{item.handlingType !== "none" ? `${item.handlingType} (${item.handlingPercentage}%)` : "-"}
							</td>
							<td className="py-2 px-2 text-right font-semibold text-slate-900">{formatNum(item.total)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* =========================================================================
   Subcomponent: InvoicePreviewSummary
   ========================================================================= */
interface InvoicePreviewSummaryProps {
	calculations: InvoiceCalculations;
}

function InvoicePreviewSummary({ calculations }: InvoicePreviewSummaryProps) {
	return (
		<div className="flex justify-end pt-2 border-t border-slate-200">
			<div className="w-72 space-y-1.5 text-xs text-right pr-1">
				<div className="flex justify-between text-slate-600">
					<span>
						<Translate text={localizationConstants.createInvoiceCalcSubtotal} />:
					</span>
					<span className="text-slate-900 font-medium">{formatNum(calculations.delsumma)} SEK</span>
				</div>

				{calculations.totalDiscount !== 0 && (
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcDiscount} />:
						</span>
						<span className="text-slate-900 font-medium">
							-{formatNum(Math.abs(calculations.totalDiscount))} SEK
						</span>
					</div>
				)}

				{calculations.totalMarkup !== 0 && (
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcMarkup} />:
						</span>
						<span className="text-slate-900 font-medium">+{formatNum(calculations.totalMarkup)} SEK</span>
					</div>
				)}

				{calculations.totalRotRut !== 0 && (
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcRotRut} />:
						</span>
						<span className="text-slate-900 font-medium">
							-{formatNum(Math.abs(calculations.totalRotRut))} SEK
						</span>
					</div>
				)}

				<div className="flex justify-between text-slate-700 font-medium pt-1 border-t border-slate-200">
					<span>
						<Translate text={localizationConstants.createInvoiceCalcTotal} />:
					</span>
					<span className="text-slate-900">{formatNum(calculations.totalExclVat)} SEK</span>
				</div>

				<div className="flex justify-between text-slate-700 font-medium">
					<span>
						<Translate text={localizationConstants.createInvoiceCalcTax} />:
					</span>
					<span className="text-slate-900">{formatNum(calculations.vatAmount)} SEK</span>
				</div>

				<div className="border-t-2 border-slate-900 my-1 pt-1.5 flex justify-between items-baseline">
					<span className="text-slate-900 font-bold text-sm">
						<Translate text={localizationConstants.createInvoiceCalcPayable} />:
					</span>
					<span className="text-emerald-600 font-black text-base">{formatNum(calculations.attErhalla)} SEK</span>
				</div>
			</div>
		</div>
	);
}

/* =========================================================================
   Subcomponent: InvoicePreviewFooter
   ========================================================================= */
interface InvoicePreviewFooterProps {
	comments?: string;
}

function InvoicePreviewFooter({ comments }: InvoicePreviewFooterProps) {
	return (
		<div className="space-y-4">
			{comments && (
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
					<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
						<Translate text={localizationConstants.createInvoiceModalNotes} />
					</p>
					<p className="text-slate-700 leading-relaxed">{comments}</p>
				</div>
			)}

			<div className="border-t border-slate-200 pt-4 grid grid-cols-3 gap-2 text-[10px] text-slate-500 text-center">
				<div>
					<span className="font-semibold block text-slate-700">
						<Translate text={localizationConstants.createInvoiceModalBankgiro} />
					</span>
					123-4567
				</div>
				<div>
					<span className="font-semibold block text-slate-700">
						<Translate text={localizationConstants.createInvoiceModalPlusgiro} />
					</span>
					45 67 89-0
				</div>
				<div>
					<span className="font-semibold block text-slate-700">
						<Translate text={localizationConstants.createInvoiceModalInterest} />
					</span>
					Referensränta + 8,00 %
				</div>
			</div>
		</div>
	);
}

/* =========================================================================
   Main Component: InvoicePreviewModal
   ========================================================================= */
export function InvoicePreviewModal({
	open,
	onOpenChange,
	formData,
	calculations,
}: InvoicePreviewModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl bg-white p-0 overflow-hidden max-h-[92vh] flex flex-col rounded-xl shadow-2xl">
				{/* Dialog Header */}
				<DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between pr-12">
					<DialogTitle className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.createInvoiceBtnPreview} /> -{" "}
						<Translate text={localizationConstants.createInvoiceModalInvoice} /> #{formData.invoiceNo}
					</DialogTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-8 text-xs gap-1.5 cursor-pointer hover:bg-slate-50 border-slate-200"
					>
						<Printer className="h-3.5 w-3.5" />
						<span>
							<Translate text={localizationConstants.createInvoiceModalPrint} />
						</span>
					</Button>
				</DialogHeader>

				{/* Rendered Invoice Sheet */}
				<div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-100/60 text-slate-800 text-xs">
					<div className="bg-white p-8 md:p-10 rounded-lg border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-7">
						<InvoicePreviewHeader formData={formData} />
						<InvoicePreviewTable lineItems={formData.lineItems} />
						<InvoicePreviewSummary calculations={calculations} />
						<InvoicePreviewFooter comments={formData.comments} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default InvoicePreviewModal;
