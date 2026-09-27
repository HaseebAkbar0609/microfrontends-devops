"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Sigma, Trash2 } from "lucide-react";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { sortItems } from "@/utils/tableSort";
import type { TemplateCostSection, TemplateSectionRow } from "../../types/templateCalculation";
import { computeRowDelsumma } from "../../hooks/useTemplateCalculation";

interface CostCategorySectionProps {
	section: TemplateCostSection;
	onToggle: () => void;
	onAddRow: () => void;
	onUpdateRow?: (rowId: string, patch: Partial<TemplateSectionRow>) => void;
	onDeleteRow: (rowId: string) => void;
	onDeleteSection: () => void;
}

type SortField = keyof Pick<TemplateSectionRow, "artikel" | "benamning" | "antal">;

export function CostCategorySection({
	section,
	onToggle,
	onAddRow,
	onDeleteRow,
	onDeleteSection,
}: CostCategorySectionProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

	const localizedTitle = useMemo(() => {
		switch (section.categoryType) {
			case "konsulter":
				return t(localizationConstants.calcTemplateKonsulter);
			case "arbete":
				return t(localizationConstants.calcTemplateArbete);
			case "material":
				return t(localizationConstants.calcTemplateMaterial);
			case "uc":
				return t(localizationConstants.calcTemplateUC);
			default:
				return section.title;
		}
	}, [section.categoryType, section.title, t]);

	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			if (sortDir === "asc") setSortDir("desc");
			else if (sortDir === "desc") {
				setSortField(null);
				setSortDir(null);
			}
		} else {
			setSortField(field);
			setSortDir("asc");
		}
	};

	const sortedRows = useMemo(() => {
		if (!sortField || !sortDir) return section.rows;
		return sortItems(
			section.rows,
			sortField,
			sortDir,
			(row, field) => row[field as keyof TemplateSectionRow] || "",
		);
	}, [section.rows, sortField, sortDir]);

	const isMaterial = section.categoryType === "material";
	const sectionTotal = useMemo(
		() => section.rows.reduce((sum, r) => sum + computeRowDelsumma(r), 0),
		[section.rows],
	);

	const TH_SORTABLE =
		"cursor-pointer select-none whitespace-nowrap px-3 py-3 text-left text-xs font-semibold text-slate-700 hover:text-slate-900";
	const TH_STATIC =
		"whitespace-nowrap px-3 py-3 text-left text-xs font-semibold text-slate-700";

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none gap-0 pb-0">
			{/* Section Header */}
			<div
				className="flex h-14 cursor-pointer items-center justify-between border-b border-slate-200 bg-white px-5 transition-colors hover:bg-slate-50/50"
				onClick={onToggle}
			>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-slate-900">{localizedTitle}</span>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Toggle section"
					className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
				>
					{section.isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>
			</div>

			{/* Section Content */}
			{section.isOpen && (
				<div className="px-4 sm:px-5 pt-2 pb-3 space-y-2.5">
					<div className="overflow-x-auto scrollbar-thin">
						<Table className="w-full min-w-[720px]">
							<TableHeader>
								<TableRow className="h-10 border-b border-slate-200 bg-white hover:bg-transparent">
									<TableHead className={TH_SORTABLE} onClick={() => toggleSort("artikel")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcItemCol} />
											{renderSortIcon("artikel", sortField, sortDir)}
										</div>
									</TableHead>

									{isMaterial && (
										<>
											<TableHead className={TH_STATIC}>
												<Translate text={localizationConstants.calcTemplateLevArtikelCol} />
											</TableHead>
											<TableHead className={TH_STATIC}>
												<Translate text={localizationConstants.calcTemplateLeverantorCol} />
											</TableHead>
										</>
									)}

									<TableHead className={TH_SORTABLE} onClick={() => toggleSort("benamning")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcAPrisNaming} />
											{renderSortIcon("benamning", sortField, sortDir)}
										</div>
									</TableHead>

									<TableHead className={TH_SORTABLE} onClick={() => toggleSort("antal")}>
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcQuantityCol} />
											{renderSortIcon("antal", sortField, sortDir)}
										</div>
									</TableHead>

									<TableHead className={TH_STATIC}>
										<Translate text={localizationConstants.calcUnitCol} />
									</TableHead>

									<TableHead className={TH_STATIC}>
										<Translate text={localizationConstants.calcAPriceCol} />
									</TableHead>

									<TableHead className={TH_STATIC}>
										<Translate text={localizationConstants.calcBerPaslagCol} />
									</TableHead>

									<TableHead className={TH_STATIC}>
										<Translate text={localizationConstants.calcBerDelsummaCol} />
									</TableHead>

									<TableHead className="w-10 px-2" />
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
								{sortedRows.length === 0 ? (
									<TableRow className="h-20">
										<TableCell
											colSpan={isMaterial ? 10 : 8}
											className="text-center text-sm text-slate-400"
										>
											<Translate text={localizationConstants.noDataFound} />
										</TableCell>
									</TableRow>
								) : (
									sortedRows.map((row) => {
										const rowTotal = computeRowDelsumma(row);
										return (
											<TableRow
												key={row.id}
												className="h-12 border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
											>
												{/* Artikel */}
												<TableCell className="px-3 text-sm font-normal text-slate-900">
													{row.artikel || "-"}
												</TableCell>

												{/* Lev.artikel (Material only) */}
												{isMaterial && (
													<TableCell className="px-3 text-sm font-normal text-slate-800">
														{row.levArtikel || "-"}
													</TableCell>
												)}

												{/* Leverantör (Material only) */}
												{isMaterial && (
													<TableCell className="px-3 text-sm font-normal text-slate-800">
														{row.leverantor || "-"}
													</TableCell>
												)}

												{/* Benämning */}
												<TableCell className="px-3 text-sm font-normal text-slate-900">
													{row.benamning || "-"}
												</TableCell>

												{/* Antal */}
												<TableCell className="px-3 text-sm font-normal text-slate-800 tabular-nums">
													{row.antal || "0"}
												</TableCell>

												{/* Enhet */}
												<TableCell className="px-3 text-sm font-normal text-slate-800">
													{row.enhet || "tim"}
												</TableCell>

												{/* A-pris */}
												<TableCell className="px-3 text-sm font-normal text-slate-800 tabular-nums">
													{row.aPris || "0"}
												</TableCell>

												{/* Påslag */}
												<TableCell className="px-3 text-sm font-normal text-slate-800 tabular-nums">
													{row.paslagPct ? `${row.paslagPct}%` : "0%"}
												</TableCell>

												{/* Delsumma */}
												<TableCell className="px-3 text-sm font-semibold text-slate-950 tabular-nums whitespace-nowrap">
													{formatCurrency(rowTotal)}
												</TableCell>

												{/* Delete Action */}
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
										);
									})
								)}
							</TableBody>
						</Table>
					</div>

					{/* Add row bar */}
					<div>
						<Button
							type="button"
							variant="outline"
							onClick={onAddRow}
							className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-dashed border-slate-200 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 shadow-none"
						>
							<Plus className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.calcNewRow} />
						</Button>
					</div>

					{/* Section Footer Bar: Summa and Delete Section */}
					<div className="flex items-center justify-between border-t border-slate-100 pt-3">
						<div className="flex w-[233px] items-center justify-between rounded-lg bg-slate-200 px-4 py-2 shadow-none">
							<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
								<Sigma className="h-4 w-4 text-slate-800" />
								<span>
									<Translate text={localizationConstants.calcBerTotal} />
								</span>
							</div>
							<span className="text-base font-semibold tabular-nums text-slate-950">
								{formatCurrency(sectionTotal)}
							</span>
						</div>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onDeleteSection}
							className="h-8.5 cursor-pointer rounded-md border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-900 hover:bg-slate-50 shadow-none"
						>
							<Translate text={localizationConstants.calcDeleteSection} />
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
}
