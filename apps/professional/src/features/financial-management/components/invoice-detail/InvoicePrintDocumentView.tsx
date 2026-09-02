"use client";

import React, { useState } from "react";
import { Printer, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	InvoiceDetailData,
	InvoiceDetailCalculations,
} from "../../types/invoiceDetail.types";

interface InvoicePrintDocumentViewProps {
	data: InvoiceDetailData;
	calculations: InvoiceDetailCalculations;
	onBack: () => void;
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InvoicePrintDocumentView({
	data,
	calculations,
	onBack,
}: InvoicePrintDocumentViewProps) {
	const [tidrapportOpen, setTidrapportOpen] = useState(true);
	const [underlagOpen, setUnderlagOpen] = useState(true);

	return (
		<div className="bg-slate-100 min-h-screen pb-16">
			{/* Top Action Bar (hidden when printing) */}
			<div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between print:hidden">
				<Button
					variant="ghost"
					size="sm"
					onClick={onBack}
					className="text-xs gap-1.5 text-slate-700 hover:text-slate-900 cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>
						<Translate text={localizationConstants.invoiceDetailBack} />
					</span>
				</Button>

				<Button
					size="sm"
					onClick={() => window.print()}
					className="h-8 text-xs gap-1.5 bg-zinc-900 hover:bg-slate-800 text-white cursor-pointer"
				>
					<Printer className="h-3.5 w-3.5" />
					<span>
						<Translate text={localizationConstants.createInvoiceModalPrint} />
					</span>
				</Button>
			</div>

			{/* Main Printable Document */}
			<div className="max-w-4xl mx-auto my-6 bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:m-0 print:p-0">
				{/* 1. Document Header */}
				<div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
					<div>
						<h1 className="text-2xl font-black text-slate-900 tracking-tight">
							{data.supplierName || "Cleaning Services AB"}
						</h1>
						<p className="text-xs text-slate-500 mt-0.5">Professional Bygg & Service</p>
					</div>
					<div className="text-right">
						<div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
							<p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
								<Translate text={localizationConstants.createInvoiceModalInvoiceNo} />
							</p>
							<p className="text-xl font-black text-slate-900">#{data.invoiceNo}</p>
						</div>
					</div>
				</div>

				{/* 2. Metadata Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-6 pb-6 border-b border-slate-100">
					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.createInvoiceModalDate} />
						</p>
						<p className="font-semibold text-slate-900 mt-0.5">{data.invoiceDate}</p>
					</div>
					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.createInvoiceModalDueDate} />
						</p>
						<p className="font-semibold text-slate-900 mt-0.5">{data.dueDate}</p>
					</div>
					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.createInvoiceModalPaymentTerms} />
						</p>
						<p className="font-semibold text-slate-900 mt-0.5">{data.paymentPlanName}</p>
					</div>
					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.invoiceDetailContractNo} />
						</p>
						<p className="font-semibold text-slate-900 mt-0.5">AVT-2025-001</p>
					</div>
				</div>

				{/* 3. Customer & Supplier Information Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6">
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
						<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
							<Translate text={localizationConstants.createInvoiceModalBillTo} />
						</p>
						<p className="font-bold text-sm text-slate-900 pt-0.5">{data.customer}</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.createInvoiceFieldContactPerson} />: {data.contactPerson}
						</p>
						<p className="text-slate-600">{data.customerAddress}</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailOrgNo} />: {data.customerOrgNr}
						</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailEmail} />: {data.customerEmail}
						</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailPhone} />: {data.customerPhone}
						</p>
					</div>

					<div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
						<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
							<Translate text={localizationConstants.invoiceDetailSupplier} />
						</p>
						<p className="font-bold text-sm text-slate-900 pt-0.5">{data.supplierName}</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.createInvoiceFieldContactPerson} />: {data.supplierContact}
						</p>
						<p className="text-slate-600">{data.supplierAddress}</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailOrgNo} />: 556123-4567
						</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailEmail} />: {data.supplierEmail}
						</p>
						<p className="text-slate-600">
							<Translate text={localizationConstants.invoiceDetailPhone} />: {data.supplierPhone}
						</p>
					</div>
				</div>

				{/* 4. Project Card */}
				<div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 mb-6 text-xs grid grid-cols-2 gap-4">
					<div>
						<p className="text-slate-500">
							<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
						</p>
						<p className="font-bold text-slate-900 text-sm mt-0.5">{data.projectNumber}</p>
					</div>
					<div>
						<p className="text-slate-500">
							<Translate text={localizationConstants.createInvoiceFieldProjectName} />
						</p>
						<p className="font-bold text-slate-900 text-sm mt-0.5">{data.projectName}</p>
					</div>
				</div>

				{/* 5. Line Items Table */}
				<div className="overflow-x-auto mb-6">
					<table className="w-full text-left border-collapse text-xs">
						<thead>
							<tr className="border-b-2 border-slate-300 text-slate-700 font-semibold">
								<th className="py-2.5 px-2 w-20">
									<Translate text={localizationConstants.createInvoiceLineColArticle} />
								</th>
								<th className="py-2.5 px-2">
									<Translate text={localizationConstants.createInvoiceLineColDesc} />
								</th>
								<th className="py-2.5 px-2 text-right w-16">
									<Translate text={localizationConstants.createInvoiceLineColQty} />
								</th>
								<th className="py-2.5 px-2 w-16">
									<Translate text={localizationConstants.createInvoiceLineColUnit} />
								</th>
								<th className="py-2.5 px-2 text-right w-24">
									<Translate text={localizationConstants.createInvoiceLineColPrice} />
								</th>
								<th className="py-2.5 px-2 text-right w-24">
									<Translate text={localizationConstants.createInvoiceCalcSubtotal} />
								</th>
								<th className="py-2.5 px-2 w-20">
									<Translate text={localizationConstants.createInvoiceLineColHandling} />
								</th>
								<th className="py-2.5 px-2 text-right w-16">%</th>
								<th className="py-2.5 px-2 text-right w-24">
									<Translate text={localizationConstants.createInvoiceLineColAdjustment} />
								</th>
								<th className="py-2.5 px-2 text-right w-28">
									<Translate text={localizationConstants.createInvoiceLineColTotal} /> (SEK)
								</th>
								<th className="py-2.5 px-2 text-right w-16">
									<Translate text={localizationConstants.createInvoiceLineColKS} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{data.lineItems.map((item) => (
								<tr key={item.id}>
									<td className="py-2.5 px-2 font-medium text-slate-700">{item.articleId}</td>
									<td className="py-2.5 px-2 text-slate-900 font-medium">{item.description}</td>
									<td className="py-2.5 px-2 text-right">{item.quantity}</td>
									<td className="py-2.5 px-2 text-slate-600">{item.unit}</td>
									<td className="py-2.5 px-2 text-right">{formatNum(item.unitPrice)}</td>
									<td className="py-2.5 px-2 text-right">{formatNum(item.delsumma)}</td>
									<td className="py-2.5 px-2 capitalize text-slate-600">{item.handlingType}</td>
									<td className="py-2.5 px-2 text-right">{item.handlingPercentage > 0 ? `${item.handlingPercentage} %` : "-"}</td>
									<td className="py-2.5 px-2 text-right">{item.adjustment !== 0 ? formatNum(item.adjustment) : "-"}</td>
									<td className="py-2.5 px-2 text-right font-semibold text-slate-900">{formatNum(item.total)}</td>
									<td className="py-2.5 px-2 text-right text-slate-600">{item.ks}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* 6. Comments & Summary Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 mb-8 text-xs">
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
						<p className="font-semibold text-slate-800 mb-1">
							<Translate text={localizationConstants.createInvoiceModalNotes} />
						</p>
						<p className="text-slate-600 leading-relaxed whitespace-pre-line">
							{data.comments || <Translate text={localizationConstants.invoiceDetailNoComment} />}
						</p>
					</div>

					<div className="space-y-1.5 text-right pr-2">
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceCalcSubtotal} />:
							</span>
							<span className="text-slate-900 font-medium">{formatNum(calculations.delsumma)} kr</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.invoiceDetailFreightFee} />:
							</span>
							<span className="text-slate-900 font-medium">0.00 kr</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.invoiceDetailInvoiceFee} />:
							</span>
							<span className="text-slate-900 font-medium">0.00 kr</span>
						</div>
						<div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200">
							<span>
								<Translate text={localizationConstants.invoiceDetailTotalExclVat} />:
							</span>
							<span className="text-slate-900">{formatNum(calculations.totalExclVat)} kr</span>
						</div>
						<div className="flex justify-between text-slate-700 font-semibold">
							<span>
								<Translate text={localizationConstants.invoiceDetailVat} />:
							</span>
							<span className="text-slate-900">{formatNum(calculations.vatAmount)} kr</span>
						</div>
						<div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
							<span className="text-slate-900 font-bold text-sm">
								<Translate text={localizationConstants.invoiceDetailAmountToPay} />:
							</span>
							<span className="text-emerald-600 font-black text-base">{formatNum(calculations.attErhalla)} kr</span>
						</div>
					</div>
				</div>

				{/* 7. Thank You Note */}
				<div className="border-t border-slate-200 pt-4 mb-8 text-center text-xs text-slate-600">
					<Translate text={localizationConstants.invoiceDetailThankYouNote} />
				</div>

				{/* 8. Företagsuppgifter Footer */}
				<div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-[11px] text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
					<div>
						<p className="font-bold text-slate-900">
							<Translate text={localizationConstants.invoiceDetailCompanyName} />:
						</p>
						<p>{data.supplierName || "Cleaning Services AB"}</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailVatNo} />:
						</p>
						<p>SE556123456701</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailFTax} />:
						</p>
						<p>
							<Translate text={localizationConstants.invoiceDetailYes} />
						</p>
					</div>

					<div>
						<p className="font-bold text-slate-900">
							<Translate text={localizationConstants.invoiceDetailAddress} />:
						</p>
						<p>{data.supplierAddress || "Industrivägen 42, 123 45 Stockholm"}</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailOrgNo} />:
						</p>
						<p>556123-4567</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailBank} />:
						</p>
						<p>Swedbank</p>
					</div>

					<div>
						<p className="font-bold text-slate-900">
							<Translate text={localizationConstants.invoiceDetailBankgiro} />:
						</p>
						<p>8327-9, 123 456 789-0</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailBic} />:
						</p>
						<p>SWEDSESS</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailEmail} />:
						</p>
						<p>{data.supplierEmail || "info@cleaningservices.se"}</p>
					</div>

					<div>
						<p className="font-bold text-slate-900">
							<Translate text={localizationConstants.invoiceDetailIban} />:
						</p>
						<p>SE35 5000 0000 0583 9825 7466</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailSwish} />:
						</p>
						<p>123 456 7890</p>
						<p className="font-bold text-slate-900 mt-2">
							<Translate text={localizationConstants.invoiceDetailPhone} />:
						</p>
						<p>{data.supplierPhone || "08-123 456 78"}</p>
					</div>
				</div>

				<p className="text-[10px] text-slate-500 text-center">
					<Translate text={localizationConstants.invoiceDetailPaymentNote} />
				</p>

				{/* 9. Collapsible Appendix: Tidrapport */}
				<div className="mt-8 border border-slate-200 rounded-lg overflow-hidden">
					<button
						type="button"
						onClick={() => setTidrapportOpen(!tidrapportOpen)}
						className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer border-b border-slate-200"
					>
						<span>
							<Translate text={localizationConstants.invoiceDetailAttachedTimeReport} />
						</span>
						{tidrapportOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
					</button>
					{tidrapportOpen && (
						<div className="p-4 overflow-x-auto text-xs">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-slate-200 text-slate-600 font-semibold">
										<th className="py-2 px-2">
											<Translate text={localizationConstants.createInvoiceTimeColDate} />
										</th>
										<th className="py-2 px-2">
											<Translate text={localizationConstants.createInvoiceTimeColEmployee} />
										</th>
										<th className="py-2 px-2 text-center">
											<Translate text={localizationConstants.invoiceDetailWorkTime} />
										</th>
										<th className="py-2 px-2">
											<Translate text={localizationConstants.createInvoiceTimeColUnit} />
										</th>
										<th className="py-2 px-2 text-center">
											<Translate text={localizationConstants.createInvoiceTimeColAta} />
										</th>
										<th className="py-2 px-2 text-center">
											<Translate text={localizationConstants.createInvoiceTimeColTotalTime} />
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{data.timeReportItems.map((item) => (
										<tr key={item.id}>
											<td className="py-2 px-2 font-medium">{item.date}</td>
											<td className="py-2 px-2">{item.employee}</td>
											<td className="py-2 px-2 text-center">{item.regularHours}</td>
											<td className="py-2 px-2 text-slate-600">{item.unit}</td>
											<td className="py-2 px-2 text-center">{item.ataHours}</td>
											<td className="py-2 px-2 text-center font-semibold">{item.totalHours}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* 10. Collapsible Appendix: Faktura underlag */}
				<div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
					<button
						type="button"
						onClick={() => setUnderlagOpen(!underlagOpen)}
						className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer border-b border-slate-200"
					>
						<span>
							<Translate text={localizationConstants.invoiceDetailAttachedUnderlag} />
						</span>
						{underlagOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
					</button>
					{underlagOpen && (
						<div className="p-4 overflow-x-auto text-xs">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-slate-200 text-slate-600 font-semibold">
										<th className="py-2 px-2">
											<Translate text={localizationConstants.createInvoiceTimeColDate} />
										</th>
										<th className="py-2 px-2">
											<Translate text={localizationConstants.invoiceDetailSupplier} />
										</th>
										<th className="py-2 px-2">
											<Translate text={localizationConstants.invoiceDetailSupplierNo} />
										</th>
										<th className="py-2 px-2 text-right">
											<Translate text={localizationConstants.invoiceDetailAmount} />
										</th>
										<th className="py-2 px-2 text-right">
											<Translate text={localizationConstants.invoiceDetailMarkupAmount} />
										</th>
										<th className="py-2 px-2 text-right">
											<Translate text={localizationConstants.createInvoiceLineColSubtotal} />
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{data.underlagItems.map((item) => (
										<tr key={item.id}>
											<td className="py-2 px-2 font-medium">{item.date}</td>
											<td className="py-2 px-2">{item.supplier}</td>
											<td className="py-2 px-2 text-slate-600">{item.supplierInvoiceNo}</td>
											<td className="py-2 px-2 text-right">{formatNum(item.amount)}</td>
											<td className="py-2 px-2 text-right">{formatNum(item.markupAmount)}</td>
											<td className="py-2 px-2 text-right font-semibold">{formatNum(item.subtotal)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default InvoicePrintDocumentView;
