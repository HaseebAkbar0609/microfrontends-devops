"use client";

import { Plus, Sigma, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { PurchaseOrderSpecLine } from "../../types/purchase.types";
import { lineSubtotal } from "../useCreatePurchaseOrderForm";

export interface SpecificationTableProps {
	lines: PurchaseOrderSpecLine[];
	errors: Record<string, string>;
	onUpdateLine: (id: string, patch: Partial<PurchaseOrderSpecLine>) => void;
	onAddLine: () => void;
	onRemoveLine: (id: string) => void;
	total: number;
}

const COLUMNS: { label: TranslationKeys; align?: "right" }[] = [
	{ label: localizationConstants.calcItemCol },
	{ label: localizationConstants.purchaseOrderColSupplierArticle },
	{ label: localizationConstants.purchaseColName },
	{ label: localizationConstants.calcQuantityCol },
	{ label: localizationConstants.calcUnitCol },
	{ label: localizationConstants.calcAPriceCol, align: "right" },
	{ label: localizationConstants.calcBerDelsummaCol, align: "right" },
];

const CELL_INPUT =
	"h-8 border-slate-200 bg-white text-sm shadow-none focus-visible:border-slate-400";

/**
 * The order's line items.
 *
 * Delsumma and Summa are always computed. The frame prints 500 x 358 as
 * 158 000 (it is 179 000) and a Summa of 0 above a non-zero row, so its numbers
 * are treated as placeholder data rather than as the specification.
 *
 * Rows are updated by id, not by index, so sorting or removing a row can never
 * write into the wrong one.
 */
export function SpecificationTable({
	lines,
	errors,
	onUpdateLine,
	onAddLine,
	onRemoveLine,
	total,
}: SpecificationTableProps) {
	const t = useTranslate();

	const errorFor = (index: number, field: string) =>
		errors[`lines.${index}.${field}`];

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200">
			<div className="overflow-x-auto">
				<table className="w-full min-w-200 border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-white">
							{COLUMNS.map((column) => (
								<th
									key={column.label}
									className={cn(
										"px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-slate-600",
										column.align === "right" &&
											"text-right",
									)}
								>
									<Translate text={column.label} />
								</th>
							))}
							<th className="w-12 px-2 py-2.5" />
						</tr>
					</thead>

					<tbody>
						{lines.map((line, index) => {
							const quantityError = errorFor(index, "quantity");
							const priceError = errorFor(index, "unitPrice");
							const designationError = errorFor(
								index,
								"designation",
							);

							return (
								<tr
									key={line.id}
									className="border-b border-slate-100 last:border-b-0"
								>
									<td className="px-3 py-1.5">
										<Input
											value={line.articleNo}
											onChange={(event) =>
												onUpdateLine(line.id, {
													articleNo:
														event.target.value,
												})
											}
											aria-label={`${t(localizationConstants.calcItemCol)} ${index + 1}`}
											className={CELL_INPUT}
										/>
									</td>
									<td className="px-3 py-1.5">
										<Input
											value={line.supplierArticleNo}
											onChange={(event) =>
												onUpdateLine(line.id, {
													supplierArticleNo:
														event.target.value,
												})
											}
											aria-label={`${t(localizationConstants.purchaseOrderColSupplierArticle)} ${index + 1}`}
											className={CELL_INPUT}
										/>
									</td>
									<td className="px-3 py-1.5">
										<Input
											value={line.designation}
											onChange={(event) =>
												onUpdateLine(line.id, {
													designation:
														event.target.value,
												})
											}
											aria-invalid={
												Boolean(designationError) ||
												undefined
											}
											aria-label={`${t(localizationConstants.purchaseColName)} ${index + 1}`}
											className={cn(
												CELL_INPUT,
												designationError &&
													"border-red-500",
											)}
										/>
									</td>
									<td className="px-3 py-1.5">
										<Input
											type="number"
											inputMode="decimal"
											min={0}
											value={line.quantity}
											onChange={(event) =>
												onUpdateLine(line.id, {
													quantity:
														event.target.value,
												})
											}
											aria-invalid={
												Boolean(quantityError) ||
												undefined
											}
											aria-label={`${t(localizationConstants.calcQuantityCol)} ${index + 1}`}
											className={cn(
												CELL_INPUT,
												"w-24 text-right",
												quantityError &&
													"border-red-500",
											)}
										/>
									</td>
									<td className="px-3 py-1.5">
										<Input
											value={line.unit}
											onChange={(event) =>
												onUpdateLine(line.id, {
													unit: event.target.value,
												})
											}
											aria-label={`${t(localizationConstants.calcUnitCol)} ${index + 1}`}
											className={cn(CELL_INPUT, "w-20")}
										/>
									</td>
									<td className="px-3 py-1.5">
										<Input
											type="number"
											inputMode="decimal"
											min={0}
											value={line.unitPrice}
											onChange={(event) =>
												onUpdateLine(line.id, {
													unitPrice:
														event.target.value,
												})
											}
											aria-invalid={
												Boolean(priceError) || undefined
											}
											aria-label={`${t(localizationConstants.calcAPriceCol)} ${index + 1}`}
											className={cn(
												CELL_INPUT,
												"w-28 text-right",
												priceError && "border-red-500",
											)}
										/>
									</td>
									<td className="px-3 py-1.5 text-right text-sm font-medium whitespace-nowrap text-slate-900 tabular-nums">
										{formatCurrency(lineSubtotal(line))}
									</td>
									<td className="w-12 px-2 py-1.5 text-center">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											disabled={lines.length <= 1}
											onClick={() =>
												onRemoveLine(line.id)
											}
											aria-label={`${t(localizationConstants.purchaseOrderRemoveLineAria)} ${index + 1}`}
											className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="border-t border-slate-100">
				<button
					type="button"
					onClick={onAddLine}
					aria-label={t(
						localizationConstants.purchaseOrderNewLineAria,
					)}
					className="flex w-full cursor-pointer items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
				>
					<Plus className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.calcNewRow} />
				</button>
			</div>

			<div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
				<Sigma className="h-4 w-4 text-slate-500" aria-hidden />
				<span className="text-sm text-slate-600">
					<Translate text={localizationConstants.lineTotal} />
				</span>
				<span className="ml-auto text-sm font-semibold text-slate-900 tabular-nums">
					{formatCurrency(total)}
				</span>
			</div>
		</div>
	);
}

export default SpecificationTable;
