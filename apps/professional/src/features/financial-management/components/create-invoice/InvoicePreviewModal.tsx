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
			<DialogContent className="max-w-4xl bg-white p-0 overflow-hidden max-h-[92vh] flex flex-col rounded-xl shadow-2xl">
				{/* Dialog Header */}
				<DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between pr-12">
					<DialogTitle className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.createInvoiceBtnPreview} /> - Faktura #{formData.invoiceNo}
					</DialogTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-8 text-xs gap-1.5 cursor-pointer hover:bg-slate-50 border-slate-200"
					>
						<Printer className="h-3.5 w-3.5" />
						<span>Skriv ut</span>
					</Button>
				</DialogHeader>

				{/* Rendered Invoice Sheet */}
				<div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-100/60 text-slate-800 text-xs">
					<div className="bg-white p-8 md:p-10 rounded-lg border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-7">
						{/* Header: Company Info & Invoice Metadata */}
						<div className="flex justify-between items-start border-b border-slate-200 pb-6">
							<div>
								<h2 className="text-2xl font-black text-slate-900 tracking-tight">FAKTURA</h2>
								<div className="mt-2 space-y-0.5 text-slate-600">
									<p>Fakturanr: <span className="font-semibold text-slate-900">{formData.invoiceNo}</span></p>
									<p>Fakturadatum: <span className="text-slate-800">{formData.invoiceDate}</span></p>
									<p>Förfallodatum: <span className="text-slate-800">2026-03-15</span></p>
									<p>OCR-nummer: <span className="font-mono text-slate-800">{formData.invoiceNo}456301</span></p>
								</div>
							</div>

							<div className="text-right space-y-0.5 text-slate-600">
								<h3 className="font-bold text-sm text-slate-900">Kalles Bygg & Entreprenad AB</h3>
								<p>Org.nr: 556123-4567</p>
								<p>Momsreg.nr: SE556123456701</p>
								<p>Storgatan 12, 111 22 Stockholm</p>
								<p>Bankgiro: 123-4567</p>
								<p className="text-[11px] text-slate-500 font-medium pt-1">Godkänd för F-skatt</p>
							</div>
						</div>

						{/* Customer & Project Information Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
								<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Faktureras till</p>
								<p className="font-bold text-sm text-slate-900 pt-0.5">{formData.customer}</p>
								<p className="text-slate-600">Att: {formData.contactPerson}</p>
								<p className="text-slate-600">Projekt: {formData.projectName} ({formData.projectNumber})</p>
							</div>

							<div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
								<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projektinformation</p>
								<p className="text-slate-600 pt-0.5">Prismodell: <span className="font-medium text-slate-800 capitalize">{formData.pricingModel}</span></p>
								<p className="text-slate-600">ROT/RUT: <span className="font-medium text-slate-800 uppercase">{formData.rotRutType}</span></p>
								<p className="text-slate-600">Kategori: <span className="font-medium text-slate-800">{formData.category}</span></p>
								<p className="text-slate-600">Betalningsvillkor: <span className="text-slate-800">30 dagar netto</span></p>
							</div>
						</div>

						{/* Line Items Table with clear columns and distinct Antal / Enhet */}
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b-2 border-slate-300 text-slate-700 text-[11px] font-semibold">
										<th className="py-2.5 px-2 w-20">Artikelnr</th>
										<th className="py-2.5 px-2">Beskrivning</th>
										<th className="py-2.5 px-2 text-right w-16">Antal</th>
										<th className="py-2.5 px-2 w-16 text-left">Enhet</th>
										<th className="py-2.5 px-2 text-right w-24">À-pris</th>
										<th className="py-2.5 px-2 text-right w-24">Hantering</th>
										<th className="py-2.5 px-2 text-right w-28">Belopp (SEK)</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{formData.lineItems.map((item) => (
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

						{/* Comprehensive Financial Breakdown */}
						<div className="flex justify-end pt-2 border-t border-slate-200">
							<div className="w-72 space-y-1.5 text-xs text-right pr-1">
								<div className="flex justify-between text-slate-600">
									<span>Delsumma:</span>
									<span className="text-slate-900 font-medium">{formatNum(calculations.delsumma)} SEK</span>
								</div>

								{calculations.totalDiscount !== 0 && (
									<div className="flex justify-between text-slate-600">
										<span>Rabatt / Innehåll:</span>
										<span className="text-slate-900 font-medium">{formatNum(calculations.totalDiscount)} SEK</span>
									</div>
								)}

								{calculations.totalMarkup !== 0 && (
									<div className="flex justify-between text-slate-600">
										<span>Påslag:</span>
										<span className="text-slate-900 font-medium">+{formatNum(calculations.totalMarkup)} SEK</span>
									</div>
								)}

								{calculations.totalRotRut !== 0 && (
									<div className="flex justify-between text-slate-600">
										<span>Rot / Rut-avdrag:</span>
										<span className="text-slate-900 font-medium">{formatNum(calculations.totalRotRut)} SEK</span>
									</div>
								)}

								<div className="flex justify-between text-slate-700 font-medium pt-1 border-t border-slate-200">
									<span>Netto exkl moms:</span>
									<span className="text-slate-900">{formatNum(calculations.totalExclVat)} SEK</span>
								</div>

								<div className="flex justify-between text-slate-700 font-medium">
									<span>Moms (25%):</span>
									<span className="text-slate-900">{formatNum(calculations.vatAmount)} SEK</span>
								</div>

								<div className="border-t-2 border-slate-900 my-1 pt-1.5 flex justify-between items-baseline">
									<span className="text-slate-900 font-bold text-sm">Att betala:</span>
									<span className="text-[#16a34a] font-black text-base">{formatNum(calculations.attErhalla)} SEK</span>
								</div>
							</div>
						</div>

						{/* Notes & Comments */}
						{formData.comments && (
							<div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
								<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Meddelande / Anteckningar</p>
								<p className="text-slate-700 leading-relaxed">{formData.comments}</p>
							</div>
						)}

						{/* Payment Footer Terms */}
						<div className="border-t border-slate-200 pt-4 grid grid-cols-3 gap-2 text-[10px] text-slate-500 text-center">
							<div>
								<span className="font-semibold block text-slate-700">Bankgiro</span>
								123-4567
							</div>
							<div>
								<span className="font-semibold block text-slate-700">Plusgiro</span>
								45 67 89-0
							</div>
							<div>
								<span className="font-semibold block text-slate-700">Dröjsmålsränta</span>
								Referensränta + 8,00 %
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
