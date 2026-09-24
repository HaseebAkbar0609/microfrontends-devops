"use client";

import { useMemo, useState } from "react";
import { FilePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search } from "@/components/search/Search";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { sortItems } from "@/utils/tableSort";
import type { CalculationTemplateOption } from "../../types/templateCalculation";

interface KalkylFlowSelectorProps {
	selectedMode: "mall" | "ny" | null;
	onSelectMode: (mode: "mall" | "ny") => void;
	templates: CalculationTemplateOption[];
	selectedTemplateId: string;
	onSelectTemplate: (id: string) => void;
	onStart: () => void;
	onCancel?: () => void;
}

type TemplateSortField = "name" | "sektionCount" | "mallType" | "datum" | "description";

export function KalkylFlowSelector({
	selectedMode,
	onSelectMode,
	templates,
	selectedTemplateId,
	onSelectTemplate,
	onStart,
	onCancel,
}: KalkylFlowSelectorProps) {
	const [search, setSearch] = useState("");
	const [sortField, setSortField] = useState<TemplateSortField | null>(null);
	const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

	const toggleSort = (field: TemplateSortField) => {
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

	const filteredTemplates = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return templates;
		return templates.filter(
			(tmpl) =>
				tmpl.name.toLowerCase().includes(q) ||
				(tmpl.mallType && tmpl.mallType.toLowerCase().includes(q)) ||
				(tmpl.description && tmpl.description.toLowerCase().includes(q)) ||
				(tmpl.datum && tmpl.datum.includes(q)),
		);
	}, [templates, search]);

	const sortedTemplates = useMemo(() => {
		if (!sortField || !sortDir) return filteredTemplates;
		return sortItems(
			filteredTemplates,
			sortField,
			sortDir,
			(tmpl, field) => {
				if (field === "sektionCount") return tmpl.sektionCount ?? tmpl.sections.length ?? 0;
				return (tmpl[field as keyof CalculationTemplateOption] as string) || "";
			},
		);
	}, [filteredTemplates, sortField, sortDir]);

	const TH_SORTABLE =
		"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-700 hover:text-slate-900";

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Main area with body + sidebar */}
			<div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
				{/* Right Sidebar Step Card (Top on small screens, right side on lg screens) */}
				<div className="order-1 lg:order-2 shrink-0 px-4 pt-4 pb-1 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-6 sm:pb-1 lg:p-6 lg:pl-0 lg:pb-6 lg:overflow-y-auto">
					<div className="w-full lg:w-72">
						<Card className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-none">
							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between text-sm font-semibold text-slate-900">
									<span>
										<Translate text={localizationConstants.stepLabel} /> 1/2
									</span>
								</div>
								<div
									className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
									role="progressbar"
									aria-valuenow={25}
									aria-valuemin={0}
									aria-valuemax={100}
								>
									<div className="h-full w-1/4 rounded-full bg-slate-900 transition-all duration-300" />
								</div>
								<Button
									type="button"
									onClick={onStart}
									disabled={!selectedMode}
									className={cn(
										"mt-2 h-10 w-full gap-2 text-sm font-medium text-white shadow-none transition-colors",
										!selectedMode
											? "cursor-not-allowed bg-slate-300 hover:bg-slate-300 text-slate-500"
											: "cursor-pointer bg-neutral-950 hover:bg-neutral-800",
									)}
								>
									<Send className="h-4 w-4" />
									<Translate text={localizationConstants.calcNewCreateBtn} />
								</Button>
							</div>
						</Card>
					</div>
				</div>

				{/* Selection Options Area */}
				<div className="order-2 lg:order-1 flex-1 px-4 pt-3 pb-6 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-3 sm:pb-6 lg:p-6 lg:pl-15 lg:pr-6 lg:overflow-y-auto space-y-5">
					{/* Flow Choice Cards */}
					<Card className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-none">
						<Label className="mb-0.5 block text-base font-semibold text-slate-900 leading-none">
							<Translate text={localizationConstants.calcBerSkapeNy} />
						</Label>
						<div role="radiogroup" aria-label="Kalkyltyp" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{/* Option 1: Kalkyl mall */}
							<button
								type="button"
								role="radio"
								aria-checked={selectedMode === "mall"}
								onClick={() => onSelectMode("mall")}
								className={cn(
									"flex cursor-pointer flex-col gap-1 rounded-lg border p-4 text-left transition-all",
									selectedMode === "mall"
										? "border-slate-300 bg-slate-100/70"
										: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40",
								)}
							>
								<div className="flex items-center gap-3">
									<div
										className={cn(
											"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
											selectedMode === "mall" ? "border-slate-900" : "border-slate-400",
										)}
									>
										{selectedMode === "mall" && (
											<div className="h-2 w-2 rounded-full bg-slate-900" />
										)}
									</div>
									<span className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.calcBerKalkylMall} />
									</span>
								</div>
								<p className="pl-7 text-xs text-slate-500">
									<Translate text={localizationConstants.calcBerValjFranMallar} />
								</p>
							</button>

							{/* Option 2: Ny kalkyl */}
							<button
								type="button"
								role="radio"
								aria-checked={selectedMode === "ny"}
								onClick={() => onSelectMode("ny")}
								className={cn(
									"flex cursor-pointer flex-col gap-1 rounded-lg border p-4 text-left transition-all",
									selectedMode === "ny"
										? "border-slate-300 bg-slate-100/70"
										: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40",
								)}
							>
								<div className="flex items-center gap-3">
									<div
										className={cn(
											"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
											selectedMode === "ny" ? "border-slate-900" : "border-slate-400",
										)}
									>
										{selectedMode === "ny" && (
											<div className="h-2 w-2 rounded-full bg-slate-900" />
										)}
									</div>
									<span className="text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.calcBerNyKalkyl} />
									</span>
								</div>
								<p className="pl-7 text-xs text-slate-500">
									<Translate text={localizationConstants.calcBerBorjaFranBorjan} />
								</p>
							</button>
						</div>
					</Card>

					{/* Template Selection Table — opens when "Kalkyl mall" is selected */}
					{selectedMode === "mall" && (
						<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
							{/* Table Header */}
							<div className="flex items-center gap-2.5 border-b border-slate-200 px-5 sm:px-6 py-4 bg-white">
								<FilePlus className="h-5 w-5 text-slate-700" aria-hidden />
								<span className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.calcBerAnvandMall} />
								</span>
							</div>

							{/* Card Body */}
							<div className="px-5 sm:px-6 pt-0 pb-5 space-y-3.5">
								{/* Search input */}
								<div>
									<Search
										value={search}
										onChange={setSearch}
										placeholder={localizationConstants.search}
										className="h-9 w-full"
										wrapperClassName="w-full sm:w-72"
									/>
								</div>

								{/* Table */}
								<div className="overflow-x-auto">
									<Table className="w-full min-w-[640px]">
										<TableHeader>
											<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
												<TableHead className="w-12 px-4" />
												<TableHead className={TH_SORTABLE} onClick={() => toggleSort("name")}>
													<div className="flex items-center gap-1">
														<Translate text={localizationConstants.calcAPrisNaming} />
														{renderSortIcon("name", sortField, sortDir)}
													</div>
												</TableHead>
												<TableHead className={TH_SORTABLE} onClick={() => toggleSort("sektionCount")}>
													<div className="flex items-center gap-1">
														<Translate text={localizationConstants.calcBerSektionCol} />
														{renderSortIcon("sektionCount", sortField, sortDir)}
													</div>
												</TableHead>
												<TableHead className={TH_SORTABLE} onClick={() => toggleSort("mallType")}>
													<div className="flex items-center gap-1">
														<Translate text={localizationConstants.calcBerMallCol} />
														{renderSortIcon("mallType", sortField, sortDir)}
													</div>
												</TableHead>
												<TableHead className={TH_SORTABLE} onClick={() => toggleSort("datum")}>
													<div className="flex items-center gap-1">
														<Translate text={localizationConstants.agreementDetailDatum} />
														{renderSortIcon("datum", sortField, sortDir)}
													</div>
												</TableHead>
												<TableHead className="px-4 py-3 text-right" />
											</TableRow>
										</TableHeader>
										<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
											{sortedTemplates.length === 0 ? (
												<TableRow>
													<TableCell colSpan={6} className="h-24 text-center text-sm text-slate-400">
														<Translate text={localizationConstants.noDataFound} />
													</TableCell>
												</TableRow>
											) : (
												sortedTemplates.map((tmpl) => {
													const isSelected = selectedTemplateId === tmpl.id;
													return (
														<TableRow
															key={tmpl.id}
															onClick={() => onSelectTemplate(tmpl.id)}
															className={cn(
																"cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/70",
																isSelected && "bg-slate-50/50",
															)}
														>
															<TableCell className="px-4 py-3.5">
																<div className="flex items-center justify-center">
																	<div
																		className={cn(
																			"flex h-4 w-4 items-center justify-center rounded-full border-2",
																			isSelected ? "border-slate-900" : "border-slate-400",
																		)}
																	>
																		{isSelected && (
																			<div className="h-2 w-2 rounded-full bg-slate-900" />
																		)}
																	</div>
																</div>
															</TableCell>
															<TableCell className="px-4 py-3.5 font-normal text-slate-900 text-sm">
																{tmpl.name}
															</TableCell>
															<TableCell className="px-4 py-3.5 text-slate-800 text-sm">
																{tmpl.sektionCount ?? tmpl.sections.length}
															</TableCell>
															<TableCell className="px-4 py-3.5 text-slate-800 text-sm">
																{tmpl.mallType ?? tmpl.description ?? "Standard"}
															</TableCell>
															<TableCell className="px-4 py-3.5 text-slate-800 text-sm">
																{tmpl.datum ?? "2025-09-01"}
															</TableCell>
															<TableCell className="px-4 py-3.5 text-right">
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		onSelectTemplate(tmpl.id);
																	}}
																	className="h-7 cursor-pointer rounded border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 hover:bg-slate-50 shadow-none"
																>
																	<Translate text={localizationConstants.calcBerSeMall} />
																</Button>
															</TableCell>
														</TableRow>
													);
												})
											)}
										</TableBody>
									</Table>
								</div>
							</div>
						</Card>
					)}
				</div>
			</div>

			{/* Sticky Bottom Bar */}
			<div className="flex h-16 items-center justify-end border-t border-slate-200 bg-white px-6 sm:pl-15 sm:pr-6">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onCancel}
					className="h-9 min-w-24 cursor-pointer rounded-md border-slate-200 bg-white px-5 text-sm font-normal text-slate-900 hover:bg-slate-50 shadow-none"
				>
					<Translate text={localizationConstants.cancelButton} />
				</Button>
			</div>
		</div>
	);
}
