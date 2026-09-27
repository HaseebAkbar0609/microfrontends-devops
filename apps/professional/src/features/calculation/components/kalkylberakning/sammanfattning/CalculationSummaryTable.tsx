"use client";

import { Sigma } from "lucide-react";
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
import type { SectionSummaryComputedRow } from "../../../hooks/useTemplateCalculation";

interface CalculationSummaryTableProps {
	rows: SectionSummaryComputedRow[];
	totals: {
		totalCalculation: number;
		totalMarkupKr: number;
		totalSubtotal: number;
		totalAdjustment: number;
	};
}

export function CalculationSummaryTable({
	rows,
	totals,
}: CalculationSummaryTableProps) {
	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none gap-0 pb-0 p-0">
			{/* Card Header Bar */}
			<div className="flex h-14 items-center bg-[#E5EAEF] px-5 border-b border-slate-200">
				<span className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.calcBerCalculation} />
				</span>
			</div>

			<div className="overflow-x-auto scrollbar-thin">
				<Table className="w-full min-w-[700px]">
					<TableHeader>
						<TableRow className="h-10 border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead className="px-4 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerSektionCol} />
							</TableHead>
							<TableHead className="px-4 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerCalculation} />
							</TableHead>
							<TableHead className="w-24 px-4 text-left text-xs font-semibold text-slate-500">
								%
							</TableHead>
							<TableHead className="px-4 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerMarkupSection} />
							</TableHead>
							<TableHead className="px-4 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerSubtotal} />
							</TableHead>
							<TableHead className="w-28 px-4 text-left text-xs font-semibold text-slate-500">
								<Translate text={localizationConstants.calcBerAdjustment} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{rows.map((row) => {
							const rowTitle = (() => {
								switch (row.categoryType) {
									case "konsulter":
										return <Translate text={localizationConstants.calcTemplateKonsulter} />;
									case "arbete":
										return <Translate text={localizationConstants.calcTemplateArbete} />;
									case "material":
										return <Translate text={localizationConstants.calcTemplateMaterial} />;
									case "uc":
										return <Translate text={localizationConstants.calcTemplateUC} />;
									default:
										return row.title;
								}
							})();

							return (
								<TableRow key={row.id} className="h-12 border-b border-slate-100 hover:bg-slate-50/50">
									{/* Section Name */}
									<TableCell className="px-4 text-sm font-bold text-slate-900">
										{rowTitle}
									</TableCell>

									{/* Base Calculation */}
									<TableCell className="px-4 text-sm font-medium text-slate-800 tabular-nums">
										<span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800">
											{formatCurrency(row.calculation)}
										</span>
									</TableCell>

									{/* Markup % */}
									<TableCell className="px-4 text-sm font-semibold text-slate-800 tabular-nums">
										{row.markupPct}%
									</TableCell>

									{/* Markup Section (kr) */}
									<TableCell className="px-4 text-sm font-bold text-slate-900 tabular-nums">
										{formatCurrency(row.markupKr)}
									</TableCell>

									{/* Subtotal */}
									<TableCell className="px-4 text-sm font-bold text-slate-900 tabular-nums">
										{formatCurrency(row.subtotal)}
									</TableCell>

									{/* Adjustment */}
									<TableCell className="px-4 text-sm font-medium text-slate-800 tabular-nums">
										<span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800">
											{row.adjustment || "0"}
										</span>
									</TableCell>
								</TableRow>
							);
						})}

						{/* Total Row */}
						<TableRow className="h-12 bg-slate-100 font-bold border-t border-slate-200 hover:bg-slate-100">
							<TableCell className="px-4 text-sm font-bold text-slate-950">
								<div className="flex items-center gap-1.5">
									<Sigma className="h-4 w-4 text-slate-900 shrink-0" />
									<span><Translate text={localizationConstants.calcBerTotal} /></span>
								</div>
							</TableCell>
							<TableCell className="px-4 text-sm font-bold text-slate-950 tabular-nums">
								{formatCurrency(totals.totalCalculation)}
							</TableCell>
							<TableCell className="w-24 px-4 text-sm font-normal text-slate-400">
								—
							</TableCell>
							<TableCell className="px-4 text-sm font-bold text-slate-950 tabular-nums">
								{formatCurrency(totals.totalMarkupKr)}
							</TableCell>
							<TableCell className="px-4 text-sm font-bold text-slate-950 tabular-nums">
								{formatCurrency(totals.totalSubtotal)}
							</TableCell>
							<TableCell className="w-28 px-4 text-sm font-bold text-slate-950 tabular-nums">
								{totals.totalAdjustment ? formatCurrency(totals.totalAdjustment) : "0"}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
