"use client";

import React from "react";
import { Edit2, FileText } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	InvoiceDetailData,
	InvoiceDetailCalculations,
} from "../../types/invoiceDetail.types";

interface InvoiceDetailOverviewTabProps {
	data: InvoiceDetailData;
	calculations: InvoiceDetailCalculations;
	onOpenEdit: (section: "header" | "paymentPlan" | "comments") => void;
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE");
}

/* =========================================================================
   1. Fakturainformation Header Card
   ========================================================================= */
function InvoiceDetailHeaderCard({
	data,
	onEdit,
}: {
	data: InvoiceDetailData;
	onEdit: () => void;
}) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-slate-600" />
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
					</h3>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-7 px-3 text-xs gap-1.5 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-md"
				>
					<Edit2 className="h-3 w-3" />
					<span>
						<Translate text={localizationConstants.actionEdit} />
					</span>
				</Button>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-4 gap-x-6 text-xs">
				{/* Row 1 */}
				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceNo} />
					</p>
					<p className="font-semibold text-slate-900 mt-1">{data.invoiceNo}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.invoiceColumnStatus} />
					</p>
					<div className="mt-1">
						<Badge
							variant="outline"
							className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-medium uppercase px-2 py-0.5"
						>
							{data.status}
						</Badge>
					</div>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldTemplate} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.invoiceTemplate}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceAttachTimeReport} />
					</p>
					<p className="font-medium text-slate-800 mt-1">
						{data.attachTimeReport ? (
							<Translate text={localizationConstants.invoiceDetailYes} />
						) : (
							<Translate text={localizationConstants.invoiceDetailNo} />
						)}
					</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceAttachDocumentation} />
					</p>
					<p className="font-medium text-slate-800 mt-1">
						{data.attachUnderlag ? (
							<Translate text={localizationConstants.invoiceDetailYes} />
						) : (
							<Translate text={localizationConstants.invoiceDetailNo} />
						)}
					</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceCreditInvoice} />
					</p>
					<p className="font-medium text-slate-800 mt-1">
						{data.isCreditInvoice ? (
							<Translate text={localizationConstants.invoiceDetailYes} />
						) : (
							<Translate text={localizationConstants.invoiceDetailNo} />
						)}
					</p>
				</div>

				{/* Row 2 */}
				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldProjectName} />
					</p>
					<p className="font-medium text-slate-900 mt-1">{data.projectName}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.projectNumber}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldContactPerson} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.contactPerson}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldProjectSum} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{formatNum(data.projectSum)} SEK</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldInvoicedEarlier} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{formatNum(data.invoicedEarlier)} SEK</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceInclThis} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{formatNum(data.invoiceInclThis)} SEK</p>
				</div>

				{/* Row 3 */}
				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceDate} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.invoiceDate}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldRotRut} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.rotRut}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldPaymentPlan} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.paymentPlanName}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldPricingModel} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.pricingModel}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldCategory} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.category}</p>
				</div>

				<div>
					<p className="text-slate-500 font-normal">
						<Translate text={localizationConstants.createInvoiceFieldCustomer} />
					</p>
					<p className="font-medium text-slate-800 mt-1">{data.customer}</p>
				</div>
			</div>
		</div>
	);
}

/* =========================================================================
   2. Line Items Table & Financial Calculations Box
   ========================================================================= */
function InvoiceDetailLineItemsTable({
	data,
	calculations,
}: {
	data: InvoiceDetailData;
	calculations: InvoiceDetailCalculations;
}) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 shadow-2xs">
			<div className="p-4 border-b border-slate-100 flex items-center justify-between">
				<h3 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.invoiceDetailLineItemsTitle} />
				</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
							<th className="py-2.5 px-3 w-20">
								<Translate text={localizationConstants.createInvoiceLineColArticle} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.createInvoiceLineColDesc} />
							</th>
							<th className="py-2.5 px-3 text-right w-20">
								<Translate text={localizationConstants.createInvoiceLineColQty} />
							</th>
							<th className="py-2.5 px-3 text-left w-16">
								<Translate text={localizationConstants.createInvoiceLineColUnit} />
							</th>
							<th className="py-2.5 px-3 text-right w-24">
								<Translate text={localizationConstants.createInvoiceLineColPrice} />
							</th>
							<th className="py-2.5 px-3 text-right w-28">
								<Translate text={localizationConstants.createInvoiceCalcSubtotal} />
							</th>
							<th className="py-2.5 px-3 text-left w-24">
								<Translate text={localizationConstants.createInvoiceLineColHandling} />
							</th>
							<th className="py-2.5 px-3 text-right w-16">%</th>
							<th className="py-2.5 px-3 text-right w-24">
								<Translate text={localizationConstants.createInvoiceLineColAdjustment} />
							</th>
							<th className="py-2.5 px-3 text-right w-28">
								<Translate text={localizationConstants.createInvoiceLineColTotal} />
							</th>
							<th className="py-2.5 px-3 text-right w-16">
								<Translate text={localizationConstants.createInvoiceLineColKS} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{data.lineItems.map((item) => (
							<tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
								<td className="py-3 px-3 font-medium text-slate-700">{item.articleId}</td>
								<td className="py-3 px-3 text-slate-900 font-medium">{item.description}</td>
								<td className="py-3 px-3 text-right text-slate-800">{item.quantity}</td>
								<td className="py-3 px-3 text-slate-600">{item.unit}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.unitPrice)}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.delsumma)}</td>
								<td className="py-3 px-3 text-slate-600 capitalize">{item.handlingType}</td>
								<td className="py-3 px-3 text-right text-slate-600">
									{item.handlingPercentage > 0 ? `${item.handlingPercentage} %` : "-"}
								</td>
								<td className="py-3 px-3 text-right text-slate-700">
									{item.adjustment !== 0 ? formatNum(item.adjustment) : "-"}
								</td>
								<td className="py-3 px-3 text-right font-semibold text-slate-900">
									{formatNum(item.total)}
								</td>
								<td className="py-3 px-3 text-right text-slate-600">{item.ks}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Financial Summary Box */}
			<div className="bg-slate-50/50 p-5 border-t border-slate-200 flex justify-end">
				<div className="w-80 space-y-2 text-xs">
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcSubtotal} />
						</span>
						<span className="text-slate-900 font-medium">{formatNum(calculations.delsumma)} SEK</span>
					</div>

					{calculations.totalDiscount !== 0 && (
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceCalcDiscount} />
							</span>
							<span className="text-slate-900 font-medium">
								-{formatNum(Math.abs(calculations.totalDiscount))} SEK
							</span>
						</div>
					)}

					{calculations.totalMarkup !== 0 && (
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceCalcMarkup} />
							</span>
							<span className="text-slate-900 font-medium">
								+{formatNum(calculations.totalMarkup)} SEK
							</span>
						</div>
					)}

					{calculations.totalRotRut !== 0 && (
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceCalcRotRut} />
							</span>
							<span className="text-slate-900 font-medium">
								-{formatNum(Math.abs(calculations.totalRotRut))} SEK
							</span>
						</div>
					)}

					<div className="flex justify-between text-slate-700 font-medium pt-2 border-t border-slate-200">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTotal} />
						</span>
						<span className="text-slate-900 font-semibold">
							{formatNum(calculations.totalExclVat)} SEK
						</span>
					</div>

					<div className="flex justify-between text-slate-700 font-medium">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTax} />
						</span>
						<span className="text-slate-900 font-semibold">
							{formatNum(calculations.vatAmount)} SEK
						</span>
					</div>

					<div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
						<span className="text-slate-900 font-bold text-sm">
							<Translate text={localizationConstants.createInvoiceCalcPayable} />:
						</span>
						<span className="text-emerald-600 font-extrabold text-base">
							{formatNum(calculations.attErhalla)} SEK
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/* =========================================================================
   3. Payment Plan Table
   ========================================================================= */
function InvoiceDetailPaymentPlanTable({
	data,
	onEdit,
}: {
	data: InvoiceDetailData;
	onEdit: () => void;
}) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 shadow-2xs">
			<div className="p-4 border-b border-slate-100 flex items-center justify-between">
				<h3 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.createInvoicePaymentPlanTitle} />
				</h3>
				<Button
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-7 px-3 text-xs gap-1.5 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-md"
				>
					<Edit2 className="h-3 w-3" />
					<span>
						<Translate text={localizationConstants.actionEdit} />
					</span>
				</Button>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.createInvoicePaymentColInvoiceNo} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.createInvoicePaymentColDate} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.createInvoicePaymentColDesc} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColQty} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.createInvoicePaymentColUnit} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColUnitPrice} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColWithheld} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColAmount} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColPaid} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.createInvoicePaymentColCost} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{data.paymentPlanItems.map((item) => (
							<tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
								<td className="py-3 px-3 font-medium text-slate-900">{item.invoiceNo}</td>
								<td className="py-3 px-3 text-slate-700">{item.date}</td>
								<td className="py-3 px-3 text-slate-900">{item.description}</td>
								<td className="py-3 px-3 text-right text-slate-800">{item.quantity}</td>
								<td className="py-3 px-3 text-slate-600">{item.unit}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.unitPrice)}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.withheld)}</td>
								<td className="py-3 px-3 text-right font-medium text-slate-900">{formatNum(item.amount)}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.paid)}</td>
								<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.cost)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

/* =========================================================================
   4. Comment Card
   ========================================================================= */
function InvoiceDetailCommentCard({
	data,
	onEdit,
}: {
	data: InvoiceDetailData;
	onEdit: () => void;
}) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
				<h3 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.createInvoiceCommentTitle} />
				</h3>
				<Button
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-7 px-3 text-xs gap-1.5 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-md"
				>
					<Edit2 className="h-3 w-3" />
					<span>
						<Translate text={localizationConstants.actionEdit} />
					</span>
				</Button>
			</div>
			<p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
				{data.comments || <Translate text={localizationConstants.invoiceDetailNoComment} />}
			</p>
		</div>
	);
}

/* =========================================================================
   Main Overview Tab Component
   ========================================================================= */
export function InvoiceDetailOverviewTab({
	data,
	calculations,
	onOpenEdit,
}: InvoiceDetailOverviewTabProps) {
	return (
		<div>
			<InvoiceDetailHeaderCard data={data} onEdit={() => onOpenEdit("header")} />
			<InvoiceDetailLineItemsTable data={data} calculations={calculations} />
			<InvoiceDetailPaymentPlanTable data={data} onEdit={() => onOpenEdit("paymentPlan")} />
			<InvoiceDetailCommentCard data={data} onEdit={() => onOpenEdit("comments")} />
		</div>
	);
}

export default InvoiceDetailOverviewTab;
