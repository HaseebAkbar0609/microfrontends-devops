"use client";

import { useRef, useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { LaborRow } from "../types/kalkyl";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800";

const DEFAULT_ROW: LaborRow = {
	id: "labor-default-1",
	item: "",
	description: "",
	quantity: "",
	unit: "",
	aPrice: "",
};

type LaborSortField = keyof Pick<LaborRow, "item" | "description" | "quantity" | "unit" | "aPrice">;

interface Props {
	initialRows?: LaborRow[];
}

export function CalculationLaborSection({ initialRows }: Props) {
	const t = useTranslate();
	const idCounterRef = useRef(100);
	const initial = initialRows ?? [DEFAULT_ROW];
	const [isOpen, setIsOpen] = useState(true);
	const [rows, setRows] = useState<LaborRow[]>(initial);
	const [savedRows, setSavedRows] = useState<LaborRow[]>(initial);
	const { sortField, sortDir, toggleSort } = useTableSort<LaborSortField>();

	const sorted = useMemo(
		() =>
			sortItems(
				rows,
				sortField,
				sortDir,
				(item, field) => item[field as keyof LaborRow] as string,
			),
		[rows, sortField, sortDir],
	);

	function handleAddRow() {
		const newRow: LaborRow = {
			id: `labor-row-${++idCounterRef.current}`,
			item: "",
			description: "",
			quantity: "",
			unit: "",
			aPrice: "",
		};
		setRows((prev) => [...prev, newRow]);
	}

	function handleChange(id: string, field: keyof LaborRow, value: string) {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
		);
	}

	function handleSave() {
		setSavedRows(rows);
	}

	function handleCancel() {
		setRows(savedRows);
	}

	function handleDeleteSection() {
		setRows([]);
		setSavedRows([]);
	}

	return (
		<div className="flex flex-col rounded-md border border-slate-200 bg-white">
			{/* Collapsible header */}
			<div
				className="flex cursor-pointer items-center justify-between px-5 py-4"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<div className="flex items-center gap-2">
					{isOpen ? (
						<ChevronDown size={16} className="text-slate-500" aria-hidden />
					) : (
						<ChevronRight size={16} className="text-slate-500" aria-hidden />
					)}
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.calcLaborCost} />
					</h2>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						handleAddRow();
					}}
					className="h-8 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
				>
					<Plus size={13} aria-hidden />
					{t(localizationConstants.calcNewRow)}
				</Button>
			</div>

			{isOpen && (
				<>
					<div className="b2b-table-scroll overflow-x-auto border-t border-slate-200">
						<table className="min-w-max w-full text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-white">
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("item")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcItemCol)}
											{renderSortIcon("item", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("description")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcDescriptionCol)}
											{renderSortIcon("description", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("quantity")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcQuantityCol)}
											{renderSortIcon("quantity", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("unit")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcUnitCol)}
											{renderSortIcon("unit", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("aPrice")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcAPriceCol)}
											{renderSortIcon("aPrice", sortField, sortDir)}
										</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{sorted.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-3 py-10 text-center text-sm text-slate-400"
										>
											{t(localizationConstants.noDataFound)}
										</td>
									</tr>
								) : (
									sorted.map((row) => (
										<tr
											key={row.id}
											className="border-b border-slate-100 last:border-0"
										>
											<td className="px-3 py-2 min-w-32">
												<Input
													value={row.item}
													onChange={(e) =>
														handleChange(row.id, "item", e.target.value)
													}
													className="h-8 border-slate-200 text-sm"
												/>
											</td>
											<td className="px-3 py-2 min-w-48">
												<Input
													value={row.description}
													onChange={(e) =>
														handleChange(row.id, "description", e.target.value)
													}
													className="h-8 border-slate-200 text-sm"
												/>
											</td>
											<td className="px-3 py-2 min-w-24">
												<Input
													value={row.quantity}
													onChange={(e) =>
														handleChange(row.id, "quantity", e.target.value)
													}
													className="h-8 border-slate-200 text-sm"
												/>
											</td>
											<td className="px-3 py-2 min-w-20">
												<Input
													value={row.unit}
													onChange={(e) =>
														handleChange(row.id, "unit", e.target.value)
													}
													className="h-8 border-slate-200 text-sm"
												/>
											</td>
											<td className="px-3 py-2 min-w-28">
												<Input
													value={row.aPrice}
													onChange={(e) =>
														handleChange(row.id, "aPrice", e.target.value)
													}
													className="h-8 border-slate-200 text-sm"
												/>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={handleDeleteSection}
							className="h-8 cursor-pointer border-slate-200 text-sm text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
						>
							<Translate text={localizationConstants.calcDeleteSection} />
						</Button>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleCancel}
								className="h-8 cursor-pointer border-slate-200 text-sm text-slate-700"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								size="sm"
								onClick={handleSave}
								className="h-8 cursor-pointer bg-neutral-950 text-sm text-white hover:bg-neutral-800"
							>
								<Translate text={localizationConstants.save} />
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
