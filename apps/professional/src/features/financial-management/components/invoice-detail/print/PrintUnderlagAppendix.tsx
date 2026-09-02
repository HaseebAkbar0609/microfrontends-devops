"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailUnderlagItem } from "../../../types/invoiceDetail.types";

interface PrintUnderlagAppendixProps {
	isOpen: boolean;
	onToggle: () => void;
	items: InvoiceDetailUnderlagItem[];
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PrintUnderlagAppendix({
	isOpen,
	onToggle,
	items,
}: PrintUnderlagAppendixProps) {
	return (
		<div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer border-b border-slate-200"
			>
				<span>
					<Translate text={localizationConstants.invoiceDetailAttachedUnderlag} />
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
							{items.map((item) => (
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
	);
}

export default PrintUnderlagAppendix;
