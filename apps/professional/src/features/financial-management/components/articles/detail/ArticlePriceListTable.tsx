"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListRow } from "../../../types/article.types";

interface ArticlePriceListTableProps {
	readonly rows?: PriceListRow[];
	readonly onEdit?: () => void;
}

export function ArticlePriceListTable({
	rows = [],
	onEdit,
}: ArticlePriceListTableProps) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-2xs">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3">
				<CardTitle className="text-sm font-semibold text-zinc-950">
					<Translate text={localizationConstants.articlePrislistaLabel} />
				</CardTitle>
				{onEdit && (
					<Button
						variant="ghost"
						size="icon"
						onClick={onEdit}
						aria-label="Edit price lists"
						className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
					>
						<Pencil className="h-4 w-4" />
					</Button>
				)}
			</CardHeader>
			<CardContent className="px-4 sm:px-6 py-4">
				{rows.length === 0 ? (
					<p className="text-xs text-slate-400 py-2">
						<Translate text={localizationConstants.priceListReviewNoArticles} />
					</p>
				) : (
					<div className="border border-slate-200 rounded-lg overflow-hidden">
						<table className="w-full text-xs text-left">
							<thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
								<tr>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.articlePrislistaHeader} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.articlePrisUtHeader} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.customerCurrencyLabel} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.priceListValidPeriodHeader} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.articleAndringsDatumHeader} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{rows.map((row) => (
									<tr key={row.id} className="hover:bg-slate-50/50">
										<td className="py-2.5 px-3 font-medium text-slate-900">{row.name}</td>
										<td className="py-2.5 px-3 text-slate-700">{row.price}</td>
										<td className="py-2.5 px-3 text-slate-500">{row.currency}</td>
										<td className="py-2.5 px-3 text-slate-500">{row.validFrom || "-"}</td>
										<td className="py-2.5 px-3 text-slate-500">{row.validTo || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
