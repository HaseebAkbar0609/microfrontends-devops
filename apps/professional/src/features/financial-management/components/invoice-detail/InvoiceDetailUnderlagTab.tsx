"use client";

import React from "react";
import { Edit2, Paperclip } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailData } from "../../types/invoiceDetail.types";

interface InvoiceDetailUnderlagTabProps {
	data: InvoiceDetailData;
	totals: {
		totalAmount: number;
		totalMarkup: number;
		totalSubtotal: number;
	};
	onOpenEdit: (section: "header" | "comments") => void;
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InvoiceDetailUnderlagTab({
	data,
	totals,
	onOpenEdit,
}: InvoiceDetailUnderlagTabProps) {
	return (
		<div>
			{/* Fakturainformation Header Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
					<div className="flex items-center gap-2">
						<Paperclip className="h-4 w-4 text-slate-600" />
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.createInvoiceTabAttachments} /> -{" "}
							<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
						</h3>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenEdit("header")}
						className="h-7 px-3 text-xs gap-1.5 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-md"
					>
						<Edit2 className="h-3 w-3" />
						<span>
							<Translate text={localizationConstants.actionEdit} />
						</span>
					</Button>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-6 text-xs">
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

					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.createInvoiceFieldCustomer} />
						</p>
						<p className="font-medium text-slate-800 mt-1">{data.customer}</p>
					</div>

					<div>
						<p className="text-slate-500 font-normal">
							<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
						</p>
						<p className="font-medium text-slate-800 mt-1">{data.projectNumber}</p>
					</div>
				</div>
			</div>

			{/* Underlag Table */}
			<div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 shadow-2xs">
				<div className="p-4 border-b border-slate-100">
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.createInvoiceTabAttachments} />
					</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse text-xs">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.createInvoiceTimeColDate} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.invoiceDetailSupplier} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.invoiceDetailSupplierNo} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.invoiceDetailAmount} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.createInvoiceLineColUnit} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.invoiceDetailAtaNo} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.invoiceDetailMarkup} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.invoiceDetailMarkupAmount} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.createInvoiceLineColKS} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.createInvoiceLineColSubtotal} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.createInvoiceCommentTitle} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{data.underlagItems.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">{item.date}</td>
									<td className="py-3 px-3 text-slate-900 font-medium whitespace-nowrap">{item.supplier}</td>
									<td className="py-3 px-3 bg-amber-50/70 text-amber-900 font-medium">
										{item.supplierInvoiceNo}
									</td>
									<td className="py-3 px-3 text-right bg-emerald-50/60 text-emerald-900 font-medium">
										{formatNum(item.amount)}
									</td>
									<td className="py-3 px-3 text-slate-600">{item.unit}</td>
									<td className="py-3 px-3 text-center text-slate-800">{item.ataNo}</td>
									<td className="py-3 px-3 text-right text-slate-700">{item.markupPercent} %</td>
									<td className="py-3 px-3 text-right text-slate-700">{formatNum(item.markupAmount)}</td>
									<td className="py-3 px-3 text-center text-slate-600">{item.ks}</td>
									<td className="py-3 px-3 text-right font-semibold text-slate-900">
										{formatNum(item.subtotal)}
									</td>
									<td className="py-3 px-3 text-slate-600 max-w-xs truncate">{item.comments}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Underlag Summary Box */}
				<div className="bg-slate-50/50 p-5 border-t border-slate-200 flex justify-end">
					<div className="w-64 space-y-1.5 text-xs text-right pr-2">
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.invoiceDetailAmount} />:
							</span>
							<span className="text-slate-900 font-medium">{formatNum(totals.totalAmount)}</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceLineColSubtotal} />:
							</span>
							<span className="text-slate-900 font-medium">{formatNum(totals.totalSubtotal)}</span>
						</div>
						<div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
							<span>
								<Translate text={localizationConstants.createInvoiceCalcTotal} />:
							</span>
							<span className="text-slate-900">{formatNum(totals.totalAmount)} SEK</span>
						</div>
					</div>
				</div>
			</div>

			{/* Comments Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.createInvoiceCommentTitle} />
					</h3>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenEdit("comments")}
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
		</div>
	);
}

export default InvoiceDetailUnderlagTab;
