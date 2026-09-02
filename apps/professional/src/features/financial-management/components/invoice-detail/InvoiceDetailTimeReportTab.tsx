"use client";

import React from "react";
import { Edit2, Clock } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailData } from "../../types/invoiceDetail.types";

interface InvoiceDetailTimeReportTabProps {
	data: InvoiceDetailData;
	totals: {
		regularHours: number;
		ataHours: number;
		totalHours: number;
	};
	onOpenEdit: (section: "header" | "comments") => void;
}

export function InvoiceDetailTimeReportTab({
	data,
	totals,
	onOpenEdit,
}: InvoiceDetailTimeReportTabProps) {
	return (
		<div>
			{/* Allmän information Header Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-slate-600" />
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.createInvoiceTabTimeReport} /> -{" "}
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

			{/* Time Report Table */}
			<div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 shadow-2xs">
				<div className="p-4 border-b border-slate-100">
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.createInvoiceTabTimeReport} />
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
									<Translate text={localizationConstants.createInvoiceTimeColEmployee} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColWorkHours} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.createInvoiceTimeColUnit} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColAta} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColTotalTime} />
								</th>
								<th className="py-2.5 px-3 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColKS} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.createInvoiceTimeColAddComment} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{data.timeReportItems.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">{item.date}</td>
									<td className="py-3 px-3 text-slate-900 font-medium whitespace-nowrap">{item.employee}</td>
									<td className="py-3 px-3 text-center bg-emerald-50/50 text-emerald-900 font-medium">
										{item.regularHours}
									</td>
									<td className="py-3 px-3 text-slate-600">{item.unit}</td>
									<td className="py-3 px-3 text-center text-slate-800">{item.ataHours}</td>
									<td className="py-3 px-3 text-center font-semibold text-slate-900">{item.totalHours}</td>
									<td className="py-3 px-3 text-center text-slate-600">{item.ks}</td>
									<td className="py-3 px-3 text-slate-600 max-w-xs truncate">{item.comments}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Total Time Summary Box */}
				<div className="bg-slate-50/50 p-5 border-t border-slate-200 flex justify-end">
					<div className="w-64 space-y-1.5 text-xs text-right pr-2">
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.invoiceDetailWorkTime} />:
							</span>
							<span className="text-slate-900 font-medium">{totals.regularHours}</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.invoiceDetailAtaTime} />:
							</span>
							<span className="text-slate-900 font-medium">{totals.ataHours}</span>
						</div>
						<div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeColTotalTime} />:
							</span>
							<span className="text-slate-900">{totals.totalHours}</span>
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

export default InvoiceDetailTimeReportTab;
