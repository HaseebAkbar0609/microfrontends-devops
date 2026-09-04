"use client";

import React from "react";
import { UserPlus, Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem, ExpenseLineItem } from "../../types/expense.types";
import { ExpenseDetailCalculations } from "../../hooks/useExpenseDetail";
import { formatSEK } from "../../utils/expenseUtils";

interface ExpenseDetailInvoiceCardProps {
	expense: ExpenseItem;
	calculations?: ExpenseDetailCalculations;
	isInboxWrapper?: boolean;
	onEdit?: () => void;
}

export function ExpenseDetailInvoiceCard({
	expense,
	calculations,
	isInboxWrapper = false,
	onEdit,
}: ExpenseDetailInvoiceCardProps) {
	const defaultLineItems: ExpenseLineItem[] = [
		{
			id: "li-1",
			articleNo: "1001",
			description: "Aconto 3",
			quantity: 10,
			unit: "tim",
			unitPrice: 750,
			subtotal: 10000,
			handling: "Rabatt",
			percent: "5 %",
			adjustment: -1000,
			vatRate: 25,
			accountNumber: "4010",
			costCenter: "10",
			total: 9000,
		},
		{
			id: "li-2",
			articleNo: "1002",
			description: "Elektriker",
			quantity: 1,
			unit: "styck",
			unitPrice: 150000,
			subtotal: 150000,
			handling: "Påslag",
			percent: "-",
			adjustment: 15000,
			vatRate: 25,
			accountNumber: "4010",
			costCenter: "10",
			total: 165000,
		},
		{
			id: "li-3",
			articleNo: "1002",
			description: "Arbete",
			quantity: 10,
			unit: "tim",
			unitPrice: 500,
			subtotal: 5000,
			handling: "Rot/rut",
			percent: "30 %",
			adjustment: -1500,
			vatRate: 25,
			accountNumber: "4010",
			costCenter: "10",
			total: 3500,
		},
	];

	const lineItems: ExpenseLineItem[] =
		expense.lineItems && expense.lineItems.length > 0
			? expense.lineItems
			: defaultLineItems;

	const subtotal = calculations?.netTotal ?? 22460;
	const freightFee = expense.freightFee ?? 0;
	const invoiceFee = expense.invoiceFee ?? 0;
	const totalExVat = subtotal + freightFee + invoiceFee;
	const vat25 = calculations?.vatTotal ?? 5615;

	const cardContent = (
		<div className="bg-white rounded-lg border border-slate-200 p-8 shadow-2xs mb-6">
			{/* Top Bar: Logo & Fakturanummer matching Figma */}
			<div className="flex items-start justify-between pb-6">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-slate-900">
						Logo Type
					</h2>
					<p className="text-xs text-slate-500 mt-1 font-medium">
						{expense.supplier || "Cleaning Services AB"}
					</p>
				</div>

				<div className="bg-slate-100/90 rounded-md px-4 py-2 text-right">
					<span className="text-[11px] text-slate-400 block font-normal">
						<Translate text={localizationConstants.expenseDetailInvoiceNo} />
					</span>
					<span className="text-lg font-bold text-slate-900 tracking-tight">
						#{expense.fakturaNo || "4563"}
					</span>
				</div>
			</div>

			{/* 4 Metadata Fields matching Figma */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs pb-5">
				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailInvoiceDate} />
					</span>
					<span className="font-semibold text-slate-900">
						{expense.invoiceDate || "2025-01-22"}
					</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailDueDate} />
					</span>
					<span className="font-semibold text-slate-900">
						{expense.dueDate || "2025-02-21"}
					</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailPaymentTerms} />
					</span>
					<span className="font-semibold text-slate-900">
						{expense.paymentTerms || "30 dagar netto"}
					</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailContractNo} />
					</span>
					<span className="font-semibold text-slate-900">
						{expense.contractNo || "AVT-2025-001"}
					</span>
				</div>
			</div>

			<div className="border-b border-slate-100 mb-6" />

			{/* Parties Section: KUND & LEVERANTÖR */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs pb-6">
				{/* KUND */}
				<div>
					<span className="text-xs font-bold text-slate-900 uppercase tracking-wide block mb-2">
						<Translate text={localizationConstants.expenseDetailCustomerHeader} />
					</span>
					<h3 className="font-bold text-slate-900 text-sm mb-1.5">
						{expense.customerName || "AB Fastighetsutveckling"}
					</h3>
					<div className="space-y-0.5 text-slate-600">
						<p>
							Kontaktperson: {expense.customerContactPerson || "Anna Andersson"}
						</p>
						<p>{expense.customerAddress || "Storgatan 15"}</p>
						<p>{expense.customerPostalCity || "111 22 Stockholm"}</p>
						<p>
							Email: {expense.customerEmail || "anna.andersson@abfastighet.se"}
						</p>
						<p>Telefon: {expense.customerPhone || "+46 70 123 45 67"}</p>
					</div>
				</div>

				{/* LEVERANTÖR */}
				<div>
					<span className="text-xs font-bold text-slate-900 uppercase tracking-wide block mb-2">
						<Translate text={localizationConstants.expenseDetailSupplierHeader} />
					</span>
					<h3 className="font-bold text-slate-900 text-sm mb-1.5">
						{expense.supplier || "Cleaning Services AB"}
					</h3>
					<div className="space-y-0.5 text-slate-600">
						<p>
							Kontaktperson: {expense.supplierContactPerson || "Erik Eriksson"}
						</p>
						<p>{expense.supplierAddress || "Industrivägen 42"}</p>
						<p>{expense.supplierPostalCity || "123 45 Stockholm"}</p>
						<p>
							Email: {expense.supplierEmail || "erik@cleaningservices.se"}
						</p>
						<p>Telefon: {expense.supplierPhone || "+46 70 987 65 43"}</p>
					</div>
				</div>
			</div>

			{/* PROJEKT Light Blue Tinted Card matching Figma */}
			<div className="bg-[#f0f7ff] rounded-lg border border-blue-100/80 p-4 mb-6">
				<span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
					<Translate text={localizationConstants.expenseDetailProjectSectionHeader} />
				</span>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<span className="text-xs text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailProjectNo} />
						</span>
						<span className="text-sm font-semibold text-slate-900">
							{expense.projectNumber || "PROJ-2025-042"}
						</span>
					</div>
					<div>
						<span className="text-xs text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailProjectTitle} />
						</span>
						<span className="text-sm font-semibold text-slate-900">
							{expense.project || "Kontorsstädning Storgatan"}
						</span>
					</div>
				</div>
			</div>

			{/* Line Items Table matching Figma (11 Columns) */}
			<div className="border border-slate-200 rounded-md overflow-x-auto mb-6">
				<table className="w-full text-left text-xs border-collapse">
					<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
						<tr>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColArticle} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColDesc} />
							</th>
							<th className="py-2.5 px-3 text-center whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColDebQty} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColUnit} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColPrice} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColSubtotal} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColHandling} />
							</th>
							<th className="py-2.5 px-3 text-center whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColPercent} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColAdjustment} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColTotal} />
							</th>
							<th className="py-2.5 px-3 text-center whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColKs} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-slate-800">
						{lineItems.map((item) => (
							<tr key={item.id} className="hover:bg-slate-50/50">
								<td className="py-2.5 px-3 font-mono">{item.articleNo}</td>
								<td className="py-2.5 px-3 font-medium">{item.description}</td>
								<td className="py-2.5 px-3 text-center">{item.quantity}</td>
								<td className="py-2.5 px-3 text-slate-500">{item.unit}</td>
								<td className="py-2.5 px-3 text-right font-mono">
									{formatSEK(item.unitPrice)}
								</td>
								<td className="py-2.5 px-3 text-right font-mono">
									{formatSEK(item.subtotal || item.quantity * item.unitPrice)}
								</td>
								<td className="py-2.5 px-3 text-slate-600">
									{item.handling || "-"}
								</td>
								<td className="py-2.5 px-3 text-center">{item.percent || "-"}</td>
								<td className="py-2.5 px-3 text-right font-mono text-slate-600">
									{item.adjustment ? formatSEK(item.adjustment) : "-"}
								</td>
								<td className="py-2.5 px-3 text-right font-mono font-semibold">
									{formatSEK(item.total)}
								</td>
								<td className="py-2.5 px-3 text-center font-mono text-slate-500">
									{item.costCenter || "10"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Notes on Left, Financial Breakdown on Right */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6">
				{/* Left: Notes and Disclaimer */}
				<div className="space-y-4 text-xs text-slate-600">
					<p className="leading-relaxed">
						{expense.notes || (
							<Translate text={localizationConstants.expenseDetailNotesDefault} />
						)}
					</p>
					<p className="leading-relaxed text-slate-500">
						<Translate text={localizationConstants.expenseDetailTermsDefault} />
					</p>
				</div>

				{/* Right: Financial Totals Breakdown matching Figma */}
				<div className="w-72 ml-auto space-y-2 text-xs text-slate-700">
					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailSumSubtotal} />:
						</span>
						<span className="font-mono">{formatSEK(subtotal)} kr</span>
					</div>

					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailFreightFee} />
						</span>
						<span className="font-mono">{formatSEK(freightFee)} kr</span>
					</div>

					<div className="flex justify-between py-1 border-b border-slate-200 pb-2">
						<span>
							<Translate text={localizationConstants.expenseDetailInvoiceFee} />
						</span>
						<span className="font-mono">{formatSEK(invoiceFee)} kr</span>
					</div>

					<div className="flex justify-between py-1.5 font-bold text-slate-900 text-sm">
						<span>
							<Translate text={localizationConstants.expenseDetailTotalExVat} />
						</span>
						<span className="font-mono">{formatSEK(totalExVat)} kr</span>
					</div>

					<div className="flex justify-between py-1 text-slate-600">
						<span>
							<Translate text={localizationConstants.expenseDetailVat25} />
						</span>
						<span className="font-mono">{formatSEK(vat25)} kr</span>
					</div>
				</div>
			</div>

			<div className="border-b border-slate-100 my-6" />

			{/* Bottom Company Information (FÖRETAGSUPPGIFTER) */}
			<div className="text-xs">
				<h4 className="font-bold text-slate-800 uppercase tracking-wide mb-3">
					<Translate text={localizationConstants.expenseDetailCompanyInfoTitle} />
				</h4>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-slate-600">
					{/* Left Column */}
					<div className="space-y-1.5">
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailCompanyName} />
							</span>
							<span className="font-medium text-slate-800">
								{expense.supplier || "Cleaning Services AB"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailVatNo} />
							</span>
							<span className="font-mono">
								{expense.supplierVatNo || "SE556123456701"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailFTax} />
							</span>
							<span>{expense.fTaxStatus || "Ja"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailBankNumber} />
							</span>
							<span className="font-mono">
								{expense.bankgiro || "8327-9, 123 456 789-0"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailBic} />
							</span>
							<span className="font-mono">{expense.bic || "SWEDSESS"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailCompanyEmail} />
							</span>
							<span>{expense.supplierEmail || "info@cleaningservices.se"}</span>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-1.5">
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailAddress} />
							</span>
							<span>
								{expense.supplierAddress || "Industrivägen 42, 123 45 Stockholm"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailCompanyOrgNo} />
							</span>
							<span className="font-mono">
								{expense.supplierOrgNo || "556123-4567"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailBank} />
							</span>
							<span>{expense.bankName || "Swedbank"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailCompanyIban} />
							</span>
							<span className="font-mono">
								{expense.iban || "SE35 5000 0000 0583 9825 7466"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailSwish} />
							</span>
							<span className="font-mono">{expense.swishNo || "123 456 7890"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-500 font-medium">
								<Translate text={localizationConstants.expenseDetailPhone} />
							</span>
							<span>{expense.supplierPhone || "08-123 456 78"}</span>
						</div>
					</div>
				</div>

				{/* Notice Box */}
				<div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-500 text-[11px] leading-relaxed">
					<Translate text={localizationConstants.expenseDetailPaymentNotice} />
				</div>
			</div>
		</div>
	);

	if (isInboxWrapper) {
		return (
			<div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-4">
				{/* Top Header of the Faktura card */}
				<div className="flex items-center justify-between p-4 border-b border-slate-100">
					<div className="flex items-center gap-2">
						<UserPlus className="h-4 w-4 text-slate-700" />
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.expenseDetailInvoiceWrapperTitle} />
						</h3>
					</div>
					{onEdit && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onEdit}
							className="h-7 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
						>
							<Edit2 className="h-3 w-3 text-slate-500" />
							<span>
								<Translate text={localizationConstants.expenseDetailBtnEdit} />
							</span>
						</Button>
					)}
				</div>
				<div className="p-4">{cardContent}</div>
			</div>
		);
	}

	return cardContent;
}

export default ExpenseDetailInvoiceCard;
