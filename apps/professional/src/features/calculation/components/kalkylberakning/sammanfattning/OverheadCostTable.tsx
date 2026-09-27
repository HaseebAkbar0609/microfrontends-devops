"use client";

import { Plus, Sigma, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import type { OverheadComputedRow } from "../../../hooks/useTemplateCalculation";

interface OverheadCostTableProps {
	rows: OverheadComputedRow[];
	totals: {
		totalSummering: number;
		totalPaslagKr: number;
		totalDelsumma: number;
	};
	onAddRow: () => void;
	onDeleteRow: (rowId: string) => void;
}

export function OverheadCostTable({
	rows,
	totals,
	onAddRow,
	onDeleteRow,
}: OverheadCostTableProps) {
	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none gap-0 pb-0 p-0">
			{/* Card Header Bar */}
			<div className="flex h-14 items-center bg-[#E5EAEF] px-5 border-b border-slate-200">
				<span className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.calcBerOverhead} />
				</span>
			</div>

			<div className="overflow-x-auto scrollbar-thin">
				<Table className="w-full min-w-[840px]">
					<TableHeader>
						<TableRow className="h-10 border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead className="px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcItemCol} />
							</TableHead>
							<TableHead className="px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcAPrisNaming} />
							</TableHead>
							<TableHead className="w-16 px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcQuantityCol} />
							</TableHead>
							<TableHead className="w-16 px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcUnitCol} />
							</TableHead>
							<TableHead className="w-24 px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcAPriceCol} />
							</TableHead>
							<TableHead className="px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerSummering} />
							</TableHead>
							<TableHead className="w-20 px-3 text-left text-xs font-semibold text-slate-500">
								%
							</TableHead>
							<TableHead className="px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerPaslagKr} />
							</TableHead>
							<TableHead className="px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerDelsummaCol} />
							</TableHead>
							<TableHead className="w-20 px-3 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerJustering} />
							</TableHead>
							<TableHead className="w-10 px-2" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{rows.length === 0 ? (
							<TableRow className="h-20">
								<TableCell colSpan={11} className="text-center text-sm text-slate-400">
									<Translate text={localizationConstants.noDataFound} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow key={row.id} className="h-12 border-b border-slate-100 hover:bg-slate-50/50">
									{/* Artikel */}
									<TableCell className="px-3 text-sm font-semibold text-slate-900">
										{row.artikel}
									</TableCell>

									{/* Benämning */}
									<TableCell className="px-3 text-sm font-semibold text-slate-900">
										{row.benamning}
									</TableCell>

									{/* Antal */}
									<TableCell className="px-3 text-sm font-medium text-slate-800 tabular-nums">
										{row.antal}
									</TableCell>

									{/* Enhet */}
									<TableCell className="px-3 text-sm font-medium text-slate-800">
										{row.enhet}
									</TableCell>

									{/* A-pris */}
									<TableCell className="px-3 text-sm font-medium text-slate-800 tabular-nums">
										{row.aPris}
									</TableCell>

									{/* Summering */}
									<TableCell className="px-3 text-sm font-medium text-slate-900 tabular-nums">
										<span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800">
											{formatCurrency(row.summering)}
										</span>
									</TableCell>

									{/* % */}
									<TableCell className="px-3 text-sm font-semibold text-slate-800 tabular-nums">
										{row.paslagPct}%
									</TableCell>

									{/* Påslag kr */}
									<TableCell className="px-3 text-sm font-bold text-slate-900 tabular-nums">
										{formatCurrency(row.paslagKr)}
									</TableCell>

									{/* Delsumma */}
									<TableCell className="px-3 text-sm font-bold text-slate-900 tabular-nums">
										{formatCurrency(row.delsumma)}
									</TableCell>

									{/* Justering */}
									<TableCell className="px-3 text-sm font-medium text-slate-800 tabular-nums">
										<span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800">
											{row.justering || "0"}
										</span>
									</TableCell>

									{/* Delete */}
									<TableCell className="px-2 text-right">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => onDeleteRow(row.id)}
											className="h-7 w-7 text-slate-900 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
										>
											<Trash2 className="h-4 w-4 text-slate-900" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}

						{/* Summary row */}
						<TableRow className="h-12 bg-slate-100 font-bold border-t border-slate-200 hover:bg-slate-100">
							<TableCell colSpan={7} className="px-3 text-sm font-bold text-slate-950">
								<div className="flex items-center gap-1.5">
									<Sigma className="h-4 w-4 text-slate-900 shrink-0" />
									<span><Translate text={localizationConstants.calcBerSummaOverhead} /></span>
								</div>
							</TableCell>
							<TableCell className="px-3 text-sm font-bold text-slate-950 tabular-nums">
								{formatCurrency(totals.totalPaslagKr)}
							</TableCell>
							<TableCell className="px-3 text-sm font-bold text-slate-950 tabular-nums">
								{formatCurrency(totals.totalDelsumma)}
							</TableCell>
							<TableCell colSpan={2} />
						</TableRow>
					</TableBody>
				</Table>
			</div>

			{/* Add row button container */}
			<div className="px-4 sm:px-5 py-2 border-t border-slate-100">
				<Button
					type="button"
					variant="outline"
					onClick={onAddRow}
					className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 shadow-none"
				>
					<Plus className="h-3.5 w-3.5 text-slate-600" />
					<Translate text={localizationConstants.calcNewRow} />
				</Button>
			</div>
		</Card>
	);
}
