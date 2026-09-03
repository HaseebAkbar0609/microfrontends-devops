"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailLineItem } from "../../../types/invoiceDetail.types";

interface PrintLineItemsTableProps {
	lineItems: InvoiceDetailLineItem[];
}

function formatNum(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PrintLineItemsTable({ lineItems }: PrintLineItemsTableProps) {
	return (
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
					{lineItems.map((item) => (
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
	);
}

export default PrintLineItemsTable;
