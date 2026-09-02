"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailTimeReportItem } from "../../../types/invoiceDetail.types";

interface PrintTimeReportAppendixProps {
	isOpen: boolean;
	onToggle: () => void;
	items: InvoiceDetailTimeReportItem[];
}

export function PrintTimeReportAppendix({
	isOpen,
	onToggle,
	items,
}: PrintTimeReportAppendixProps) {
	return (
		<div className="mt-8 border border-slate-200 rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer border-b border-slate-200"
			>
				<span>
					<Translate text={localizationConstants.invoiceDetailAttachedTimeReport} />
				</span>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-500" />
				)}
			</button>
			{isOpen && (
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
							{items.map((item) => (
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
	);
}

export default PrintTimeReportAppendix;
