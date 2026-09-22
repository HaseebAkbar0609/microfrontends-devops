"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListRow } from "../../../types/article.types";
import { PriceListModal } from "./PriceListModal";

interface PriceListSubTableProps {
	readonly rows: PriceListRow[];
	readonly onAddRow: (row: PriceListRow) => void;
	readonly onRemoveRow: (id: string) => void;
}

export function PriceListSubTable({
	rows,
	onAddRow,
	onRemoveRow,
}: PriceListSubTableProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.articlePrislistaLabel} />
				</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setIsModalOpen(true)}
					className="gap-1.5 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.articleNewRowButton} />
				</Button>
			</div>

			{rows.length === 0 ? (
				<div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
					<Translate text={localizationConstants.priceListReviewNoArticles} />
				</div>
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
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.actionLabel} />
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
									<td className="py-2.5 px-3 text-right">
										<button
											type="button"
											onClick={() => onRemoveRow(row.id)}
											className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<PriceListModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={onAddRow}
			/>
		</div>
	);
}
