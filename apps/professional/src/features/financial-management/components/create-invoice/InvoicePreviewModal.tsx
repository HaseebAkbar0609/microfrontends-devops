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
import { CreateInvoiceFormData } from "../../types/createInvoice.types";

interface InvoicePreviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: CreateInvoiceFormData;
	calculations: {
		delsumma: number;
		totalDiscount: number;
		totalMarkup: number;
		totalRotRut: number;
		totalExclVat: number;
		vatAmount: number;
		attErhalla: number;
	};
}

export function InvoicePreviewModal({
	open,
	onOpenChange,
	formData,
	calculations,
}: InvoicePreviewModalProps) {
	const formatNum = (num: number) => num.toLocaleString("sv-SE");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl bg-white p-0 overflow-hidden max-h-[90vh] flex flex-col">
				<DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
					<DialogTitle className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.createInvoiceBtnPreview} /> - Faktura #{formData.invoiceNo}
					</DialogTitle>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => window.print()}
							className="h-8 text-xs gap-1.5 cursor-pointer"
						>
							<Printer className="h-3.5 w-3.5" />
							<span>Skriv ut</span>
						</Button>
					</div>
				</DialogHeader>

				{/* Rendered Invoice Paper */}
				<div className="p-8 overflow-y-auto flex-1 bg-slate-50 text-slate-800 text-xs">
					<div className="bg-white p-8 rounded border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
						{/* Header & Company Logo info */}
						<div className="flex justify-between items-start border-b border-slate-200 pb-5">
							<div>
								<h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">FAKTURA</h2>
								<p className="text-slate-500 mt-1">Fakturanr: <span className="font-semibold text-slate-800">{formData.invoiceNo}</span></p>
								<p className="text-slate-500">Fakturadatum: {formData.invoiceDate}</p>
								<p className="text-slate-500">Förfallodatum: 2026-03-15</p>
							</div>
							<div className="text-right">
								<h3 className="font-bold text-sm text-slate-900">Kalles Bygg & Entreprenad AB</h3>
								<p className="text-slate-500">Org.nr: 556123-4567</p>
								<p className="text-slate-500">Storgatan 12, 111 22 Stockholm</p>
								<p className="text-slate-500">Bankgiro: 123-4567</p>
							</div>
						</div>

						{/* Customer / Project info */}
						<div className="grid grid-cols-2 gap-4 py-2">
							<div className="p-3 bg-slate-50 rounded border border-slate-100">
								<p className="text-[11px] font-semibold text-slate-500 uppercase">Faktureras till</p>
								<p className="font-bold text-slate-900 mt-1">{formData.customer}</p>
								<p className="text-slate-600">Att: {formData.contactPerson}</p>
								<p className="text-slate-600">Projekt: {formData.projectName} ({formData.projectNumber})</p>
							</div>
							<div className="p-3 bg-slate-50 rounded border border-slate-100">
								<p className="text-[11px] font-semibold text-slate-500 uppercase">Projektinformation</p>
								<p className="text-slate-600 mt-1">Prismodell: <span className="font-medium text-slate-800">{formData.pricingModel}</span></p>
								<p className="text-slate-600">ROT/RUT: <span className="font-medium text-slate-800">{formData.rotRutType.toUpperCase()}</span></p>
								<p className="text-slate-600">Kategori: {formData.category}</p>
							</div>
						</div>

						{/* Line items table */}
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b-2 border-slate-200 text-slate-600 text-[11px]">
									<th className="py-2">Artikelnr</th>
									<th className="py-2">Beskrivning</th>
									<th className="py-2 text-right">Antal</th>
									<th className="py-2">Enhet</th>
									<th className="py-2 text-right">À-pris</th>
									<th className="py-2 text-right">Belopp (SEK)</th>
								</tr>
							</thead>
							<tbody>
								{formData.lineItems.map((item) => (
									<tr key={item.id} className="border-b border-slate-100">
										<td className="py-2 font-medium">{item.articleId}</td>
										<td className="py-2">{item.description || "Tjänst/Artikel"}</td>
										<td className="py-2 text-right">{item.quantity}</td>
										<td className="py-2">{item.unit}</td>
										<td className="py-2 text-right">{formatNum(item.unitPrice)}</td>
										<td className="py-2 text-right font-semibold">{formatNum(item.total)}</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Summary Calculation */}
						<div className="flex justify-end pt-2">
							<div className="w-60 space-y-1 text-[11px]">
								<div className="flex justify-between text-slate-600">
									<span>Netto exkl moms:</span>
									<span className="font-medium">{formatNum(calculations.totalExclVat)} SEK</span>
								</div>
								<div className="flex justify-between text-slate-600">
									<span>Moms (25%):</span>
									<span className="font-medium">{formatNum(calculations.vatAmount)} SEK</span>
								</div>
								<div className="flex justify-between text-slate-900 font-bold text-xs pt-1 border-t border-slate-300">
									<span>Att betala:</span>
									<span className="text-[#16a34a]">{formatNum(calculations.attErhalla)} SEK</span>
								</div>
							</div>
						</div>

						{/* Notes */}
						{formData.comments && (
							<div className="p-3 bg-slate-50 rounded border border-slate-100">
								<p className="text-[11px] font-semibold text-slate-500">Meddelande / Anteckningar:</p>
								<p className="text-slate-600 mt-0.5">{formData.comments}</p>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
