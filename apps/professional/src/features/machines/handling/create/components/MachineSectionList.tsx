"use client";

import { useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	Info,
	Plus,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { MachineSection } from "../types/newMachineList.types";

interface MachineSectionListProps {
	/** Own sections are green in the design, external ones blue. */
	variant: "own" | "external";
	sections: MachineSection[];
	onAddSection: () => void;
	onDeleteSection: (sectionId: string) => void;
	onAddRow: (sectionId: string) => void;
	onDeleteRow: (sectionId: string, rowId: string) => void;
}

function ColumnHead({ labelKey }: { labelKey: TranslationKeys }) {
	return (
		<TableHead className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-500">
			<div className="flex items-center gap-1">
				<Translate text={labelKey} />
				<ArrowUpDown className="h-3 w-3 opacity-60" />
			</div>
		</TableHead>
	);
}

/** Read-only supplier block shown above external section tables. */
function SupplierBlock({ section }: { section: MachineSection }) {
	if (!section.supplier) return null;

	const fields: { labelKey: TranslationKeys; value: string }[] = [
		{
			labelKey: localizationConstants.machineListCompanyName,
			value: section.supplier.companyName,
		},
		{
			labelKey: localizationConstants.machineListCompanyAddress,
			value: section.supplier.companyAddress,
		},
		{
			labelKey: localizationConstants.machineHandlingStart,
			value: section.supplier.startDate,
		},
		{
			labelKey: localizationConstants.machineHandlingEnd,
			value: section.supplier.endDate,
		},
	];

	return (
		<div className="border-b border-slate-200 px-4 py-3">
			<p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
				<Info className="h-4 w-4 text-slate-500" />
				<Translate text={localizationConstants.machineListSupplierInfo} />
			</p>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{fields.map((field) => (
					<div key={field.labelKey} className="flex flex-col gap-0.5">
						<span className="text-xs font-medium text-slate-900">
							<Translate text={field.labelKey} />
						</span>
						<span className="text-xs text-slate-500">{field.value || "—"}</span>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * The repeated "section" block on the Egna / Externa Maskiner tabs: a coloured
 * bar with a "Ny sektion" action, then one collapsible card per section holding
 * its machine table, a "Ny maskin" row and a delete action.
 */
export function MachineSectionList({
	variant,
	sections,
	onAddSection,
	onDeleteSection,
	onAddRow,
	onDeleteRow,
}: MachineSectionListProps) {
	const { t } = useTranslation();
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
	const isExternal = variant === "external";

	const toggle = (id: string) =>
		setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

	return (
		<div className="flex flex-col gap-4">
			<div
				className={`flex items-center justify-between rounded-md px-4 py-2.5 ${
					isExternal ? "bg-[#1D6FE0] text-white" : "bg-[#16A34A] text-white"
				}`}
			>
				<span className="text-sm font-semibold">
					<Translate
						text={
							isExternal
								? localizationConstants.machineListExternalMachines
								: localizationConstants.machineListOwnMachines
						}
					/>
				</span>
				<Button
					type="button"
					onClick={onAddSection}
					className="h-8 cursor-pointer gap-1.5 bg-[#111721] px-3 text-xs font-medium text-white hover:bg-slate-800"
				>
					<Plus className="h-3.5 w-3.5" aria-hidden />
					<Translate text={localizationConstants.machineListNewSection} />
				</Button>
			</div>

			{sections.length === 0 ? (
				<p className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.machineListNoSections} />
				</p>
			) : (
				sections.map((section) => {
					const isCollapsed = !!collapsed[section.id];

					return (
						<div
							key={section.id}
							className="overflow-hidden rounded-lg border border-slate-200 bg-white"
						>
							<button
								type="button"
								onClick={() => toggle(section.id)}
								aria-expanded={!isCollapsed}
								className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-slate-900"
							>
								{section.title}
								{isCollapsed ? (
									<ChevronDown className="h-4 w-4 text-slate-500" />
								) : (
									<ChevronUp className="h-4 w-4 text-slate-500" />
								)}
							</button>

							{!isCollapsed && (
								<>
									<SupplierBlock section={section} />

									<div className="w-full overflow-x-auto">
										<Table className="w-full min-w-200 table-auto border-collapse">
											<TableHeader>
												<TableRow className="border-y border-slate-200 bg-white hover:bg-white">
													<ColumnHead
														labelKey={localizationConstants.machineColumnId}
													/>
													<ColumnHead labelKey={localizationConstants.machine} />
													{isExternal && (
														<ColumnHead
															labelKey={localizationConstants.machineListSupplier}
														/>
													)}
													<ColumnHead
														labelKey={
															isExternal
																? localizationConstants.machineListExternalRent
																: localizationConstants.machineColumnInternalRent
														}
													/>
													<ColumnHead
														labelKey={
															isExternal
																? localizationConstants.machineListRentedDay
																: localizationConstants.machineListDeliveryDate
														}
													/>
													<ColumnHead
														labelKey={localizationConstants.machineListReturnDate}
													/>
													<ColumnHead
														labelKey={localizationConstants.machineListDays}
													/>
													<ColumnHead
														labelKey={localizationConstants.machineListRentalCost}
													/>
													<TableHead className="w-10 px-2 py-2.5" />
												</TableRow>
											</TableHeader>
											<TableBody>
												{section.rows.length === 0 ? (
													<TableRow>
														<TableCell
															colSpan={isExternal ? 9 : 8}
															className="py-6 text-center text-xs text-slate-500"
														>
															<Translate
																text={localizationConstants.machineListNoMachines}
															/>
														</TableCell>
													</TableRow>
												) : (
													section.rows.map((row) => (
														<TableRow
															key={row.id}
															className="border-b border-slate-100"
														>
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																{row.machineNo || "—"}
															</TableCell>
															<TableCell className="px-3 py-2.5 text-xs font-medium whitespace-nowrap text-slate-900">
																{row.name || "—"}
															</TableCell>
															{isExternal && (
																<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																	{row.supplier || "—"}
																</TableCell>
															)}
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																{row.rate || "—"}
															</TableCell>
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																{row.fromDate || "—"}
															</TableCell>
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																{row.returnDate || "—"}
															</TableCell>
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-700">
																{row.days}
															</TableCell>
															<TableCell className="px-3 py-2.5 text-xs whitespace-nowrap text-slate-900">
																{row.cost || "—"}
															</TableCell>
															<TableCell className="px-2 py-2.5 text-right">
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	aria-label={t(localizationConstants.actionDelete)}
																	onClick={() => onDeleteRow(section.id, row.id)}
																	className="h-7 w-7 cursor-pointer text-slate-500 hover:text-red-600"
																>
																	<Trash2 className="h-3.5 w-3.5" />
																</Button>
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
									</div>

									<div className="px-4 py-3">
										<button
											type="button"
											onClick={() => onAddRow(section.id)}
											className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-slate-50 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
										>
											<Plus className="h-3.5 w-3.5" aria-hidden />
											<Translate text={localizationConstants.machineListNewMachine} />
										</button>
									</div>

									<div className="flex justify-end border-t border-slate-100 px-4 py-3">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onDeleteSection(section.id)}
											className="h-8 cursor-pointer border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
										>
											<Translate
												text={localizationConstants.machineListDeleteSection}
											/>
										</Button>
									</div>
								</>
							)}
						</div>
					);
				})
			)}
		</div>
	);
}
