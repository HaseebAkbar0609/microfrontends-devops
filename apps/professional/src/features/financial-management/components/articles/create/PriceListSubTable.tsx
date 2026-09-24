"use client";

import React, { useState } from "react";
import { Plus, Trash2, Star, ChevronDown, ChevronUp } from "lucide-react";
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

const DEFAULT_SAMPLE_PRICE_ROWS: PriceListRow[] = [
	{
		id: "sample_pl_1",
		isFavorite: true,
		name: "A (El-produkter)",
		benamning: "Standard prislista",
		price: "102,00",
		prisUt: "102,00",
		prisKalkyl: "60",
		tgPercent: "35,00 %",
		tbSek: "42",
		kostnad: "-60,00",
		andringsDatum: "2025-09-01",
		statistik: "-",
	},
	{
		id: "sample_pl_2",
		isFavorite: true,
		name: "B (El-produkter)",
		benamning: "privatpersoner",
		price: "120,00",
		prisUt: "120,00",
		prisKalkyl: "60",
		tgPercent: "50,00 %",
		tbSek: "60",
		kostnad: "-60,00",
		andringsDatum: "2025-09-01",
		statistik: "-",
	},
];

export function PriceListSubTable({
	rows,
	onAddRow,
	onRemoveRow,
}: PriceListSubTableProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const displayRows = rows && rows.length > 0 ? rows : DEFAULT_SAMPLE_PRICE_ROWS;

	return (
		<div className="flex flex-col gap-3">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full text-left cursor-pointer border-b border-slate-100 pb-2"
			>
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.articlePrislistaLabel} />
				</h3>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-slate-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-400" />
				)}
			</button>

			{isOpen && (
				<div className="flex flex-col gap-3">
					<div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
						<table className="w-full text-xs text-left min-w-[700px]">
							<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
								<tr>
									<th className="py-2.5 px-3 w-8 text-center">
										<Star className="h-3.5 w-3.5 fill-[#111721] text-[#111721] mx-auto" />
									</th>
									<th className="py-2.5 px-3">Prislista</th>
									<th className="py-2.5 px-3">BENÄMNING</th>
									<th className="py-2.5 px-3">Prisist -ut</th>
									<th className="py-2.5 px-3">Pris - kalkyl</th>
									<th className="py-2.5 px-3">TG %</th>
									<th className="py-2.5 px-3">TB - SEK</th>
									<th className="py-2.5 px-3">Kostnad</th>
									<th className="py-2.5 px-3">Ändrings datum</th>
									<th className="py-2.5 px-3">Statistik</th>
									<th className="py-2.5 px-3 text-right"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{displayRows.map((row) => (
									<tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
										<td className="py-2.5 px-3 text-center">
											<Star className="h-3.5 w-3.5 fill-[#111721] text-[#111721] mx-auto" />
										</td>
										<td className="py-2.5 px-3 font-medium text-slate-900">{row.name}</td>
										<td className="py-2.5 px-3 text-slate-600">{row.benamning || row.name}</td>
										<td className="py-2.5 px-3 text-slate-800">{row.prisUt || row.price}</td>
										<td className="py-2.5 px-3 text-slate-600">{row.prisKalkyl || "60"}</td>
										<td className="py-2.5 px-3 text-slate-600">{row.tgPercent || "35,00 %"}</td>
										<td className="py-2.5 px-3 text-slate-600">{row.tbSek || "42"}</td>
										<td className="py-2.5 px-3 text-slate-600">{row.kostnad || "-60,00"}</td>
										<td className="py-2.5 px-3 text-slate-500">{row.andringsDatum || "2025-09-01"}</td>
										<td className="py-2.5 px-3 text-slate-400">{row.statistik || "-"}</td>
										<td className="py-2.5 px-3 text-right">
											<button
												type="button"
												onClick={() => onRemoveRow(row.id)}
												className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex justify-start">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setIsModalOpen(true)}
							className="h-9 px-4 gap-1.5 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg shadow-2xs"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.articleNewRowButton} />
						</Button>
					</div>
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
