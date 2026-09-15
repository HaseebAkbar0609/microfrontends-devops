"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityLineItem } from "../../types/authorities.types";

interface AuthorityDetailLineItemsTableProps {
	lineItems?: AuthorityLineItem[];
}

export function AuthorityDetailLineItemsTable({
	lineItems,
}: AuthorityDetailLineItemsTableProps) {
	const defaultItems: AuthorityLineItem[] = [
		{
			id: "1",
			articleNumber: "101",
			description: "Kontorsstädning - veckovis städning",
			quantity: 40,
			unit: "tim",
			price: 350,
			subtotal: 14000,
		},
		{
			id: "2",
			articleNumber: "102",
			description: "Fönsterputsning våning 3-4",
			quantity: 1,
			unit: "st",
			price: 2500,
			subtotal: 2500,
		},
		{
			id: "3",
			articleNumber: "103",
			description: "Golvvård och polishbehandling",
			quantity: 1,
			unit: "st",
			price: 4200,
			subtotal: 4200,
		},
	];

	const items = lineItems && lineItems.length > 0 ? lineItems : defaultItems;

	return (
		<div className="p-6 border-b border-slate-200">
			<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
				<Translate text={localizationConstants.authorityArticleLines} />
			</h4>
			<div className="overflow-x-auto rounded-lg border border-slate-200">
				<table className="w-full text-left text-xs text-slate-700">
					<thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
						<tr>
							<th className="px-4 py-2.5">
								<Translate text={localizationConstants.colArticleNumber} />
							</th>
							<th className="px-4 py-2.5">
								<Translate text={localizationConstants.colDescription} />
							</th>
							<th className="px-4 py-2.5 text-right">
								<Translate text={localizationConstants.colQuantity} />
							</th>
							<th className="px-4 py-2.5">
								<Translate text={localizationConstants.colUnit} />
							</th>
							<th className="px-4 py-2.5 text-right">
								<Translate text={localizationConstants.colUnitPrice} />
							</th>
							<th className="px-4 py-2.5 text-right">
								<Translate text={localizationConstants.colAmount} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{items.map((item) => (
							<tr key={item.id} className="hover:bg-slate-50/50">
								<td className="px-4 py-3 font-medium text-slate-900">
									{item.articleNumber}
								</td>
								<td className="px-4 py-3">{item.description}</td>
								<td className="px-4 py-3 text-right font-medium">
									{item.quantity}
								</td>
								<td className="px-4 py-3 text-slate-500">{item.unit}</td>
								<td className="px-4 py-3 text-right text-slate-600">
									{item.price.toLocaleString("sv-SE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{" "}
									kr
								</td>
								<td className="px-4 py-3 text-right font-bold text-slate-900">
									{item.subtotal.toLocaleString("sv-SE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{" "}
									kr
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default AuthorityDetailLineItemsTable;
