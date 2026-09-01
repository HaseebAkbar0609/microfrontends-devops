"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { InvoiceLineItem, HandlingType } from "../../types/createInvoice.types";

interface InvoiceLineItemsTableProps {
	items: InvoiceLineItem[];
	onAddItem: () => void;
	onUpdateItem: (id: string, updates: Partial<InvoiceLineItem>) => void;
	onRemoveItem: (id: string) => void;
	calculations: {
		delsumma: number;
		totalDiscount: number;
		totalMarkup: number;
		totalRotRut: number;
		totalExclVat: number;
		vatAmount: number;
		attErhalla: number;
	};
}

export function InvoiceLineItemsTable({
	items,
	onAddItem,
	onUpdateItem,
	onRemoveItem,
	calculations,
}: InvoiceLineItemsTableProps) {
	const formatNum = (num: number) => {
		return num.toLocaleString("sv-SE");
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-5 overflow-hidden">
			{/* Table */}
			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[1050px] border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24">
								<Translate text={localizationConstants.createInvoiceLineColArticle} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[160px]">
								<Translate text={localizationConstants.createInvoiceLineColDesc} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								<Translate text={localizationConstants.createInvoiceLineColQty} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24">
								<Translate text={localizationConstants.createInvoiceLineColUnit} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28 text-right">
								<Translate text={localizationConstants.createInvoiceLineColPrice} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28 text-right">
								<Translate text={localizationConstants.createInvoiceLineColSubtotal} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28">
								<Translate text={localizationConstants.createInvoiceLineColHandling} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-20 text-right">
								<Translate text={localizationConstants.createInvoiceLineColPercent} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28 text-right">
								<Translate text={localizationConstants.createInvoiceLineColAdjustment} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28 text-right">
								<Translate text={localizationConstants.createInvoiceLineColTotal} />
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-20 text-center">
								<Translate text={localizationConstants.createInvoiceLineColKS} />
							</TableHead>
							<TableHead className="py-2.5 px-2 w-12 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
								{/* Artikel */}
								<TableCell className="py-2 px-3">
									<Input
										value={row.articleId}
										onChange={(e) => onUpdateItem(row.id, { articleId: e.target.value })}
										className="h-8 text-xs border-slate-200"
									/>
								</TableCell>

								{/* Beskrivning */}
								<TableCell className="py-2 px-3">
									<Input
										value={row.description}
										onChange={(e) => onUpdateItem(row.id, { description: e.target.value })}
										placeholder="Beskrivning..."
										className="h-8 text-xs border-slate-200"
									/>
								</TableCell>

								{/* Deb. Antal */}
								<TableCell className="py-2 px-3">
									<Input
										type="number"
										value={row.quantity}
										onChange={(e) => onUpdateItem(row.id, { quantity: Number(e.target.value) })}
										className="h-8 text-xs text-right border-slate-200"
									/>
								</TableCell>

								{/* Enhet */}
								<TableCell className="py-2 px-3">
									<Select
										value={row.unit}
										onValueChange={(val) => onUpdateItem(row.id, { unit: val })}
									>
										<SelectTrigger className="h-8 text-xs border-slate-200 bg-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectItem value="tim">tim</SelectItem>
											<SelectItem value="styck">styck</SelectItem>
											<SelectItem value="st">st</SelectItem>
											<SelectItem value="mån">mån</SelectItem>
											<SelectItem value="km">km</SelectItem>
											<SelectItem value="dagar">dagar</SelectItem>
										</SelectContent>
									</Select>
								</TableCell>

								{/* Pris */}
								<TableCell className="py-2 px-3">
									<Input
										type="number"
										value={row.unitPrice}
										onChange={(e) => onUpdateItem(row.id, { unitPrice: Number(e.target.value) })}
										className="h-8 text-xs text-right border-slate-200"
									/>
								</TableCell>

								{/* Delsumma */}
								<TableCell className="py-2 px-3 text-xs font-medium text-slate-800 text-right whitespace-nowrap">
									{formatNum(row.subtotal)}
								</TableCell>

								{/* Hantering */}
								<TableCell className="py-2 px-3">
									<Select
										value={row.handlingType}
										onValueChange={(val) =>
											onUpdateItem(row.id, { handlingType: val as HandlingType })
										}
									>
										<SelectTrigger className="h-8 text-xs border-slate-200 bg-white">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectItem value="none">-</SelectItem>
											<SelectItem value="discount">Rabatt</SelectItem>
											<SelectItem value="markup">Påslag</SelectItem>
											<SelectItem value="rotrut">Rot/rut</SelectItem>
										</SelectContent>
									</Select>
								</TableCell>

								{/* % */}
								<TableCell className="py-2 px-3">
									<Input
										type="number"
										value={row.handlingPercentage || ""}
										onChange={(e) =>
											onUpdateItem(row.id, { handlingPercentage: Number(e.target.value) })
										}
										placeholder="0"
										className="h-8 text-xs text-right border-slate-200"
									/>
								</TableCell>

								{/* Justering */}
								<TableCell className="py-2 px-3 text-xs text-slate-800 text-right whitespace-nowrap">
									{row.adjustmentAmount !== 0 ? formatNum(row.adjustmentAmount) : "-"}
								</TableCell>

								{/* Total */}
								<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 text-right whitespace-nowrap">
									{formatNum(row.total)}
								</TableCell>

								{/* KS */}
								<TableCell className="py-2 px-3">
									<Input
										value={row.costCenter}
										onChange={(e) => onUpdateItem(row.id, { costCenter: e.target.value })}
										className="h-8 text-xs text-center border-slate-200"
									/>
								</TableCell>

								{/* Delete Row Action */}
								<TableCell className="py-2 px-2 text-center">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onRemoveItem(row.id)}
										className="h-7 w-7 text-slate-400 hover:text-red-600 cursor-pointer"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Add Row Button */}
			<div className="pt-4 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<Button
					variant="outline"
					onClick={onAddItem}
					className="h-8 px-3 gap-1.5 border-slate-200 text-xs font-normal text-slate-700 hover:bg-slate-50 cursor-pointer"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.createInvoiceAddRow} />
				</Button>

				{/* Financial Calculation Breakdown Box */}
				<div className="w-full sm:w-72 bg-slate-50/60 rounded-md border border-slate-200 p-3.5 text-xs space-y-1.5">
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcSubtotal} />
						</span>
						<span className="font-medium text-slate-800">
							{formatNum(calculations.delsumma)}
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcDiscount} />
						</span>
						<span className="font-medium text-slate-800">
							{calculations.totalDiscount !== 0 ? formatNum(calculations.totalDiscount) : "0"}
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcMarkup} />
						</span>
						<span className="font-medium text-slate-800">
							{calculations.totalMarkup !== 0 ? `+${formatNum(calculations.totalMarkup)}` : "0"}
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcRotRut} />
						</span>
						<span className="font-medium text-slate-800">
							{calculations.totalRotRut !== 0 ? formatNum(calculations.totalRotRut) : "0"}
						</span>
					</div>

					<div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTotal} />
						</span>
						<span>{formatNum(calculations.totalExclVat)}</span>
					</div>

					<div className="flex justify-between text-slate-900 font-semibold pt-1 border-t border-slate-200">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTax} />
						</span>
						<span>{formatNum(calculations.vatAmount)} SEK</span>
					</div>

					<div className="flex justify-between text-[#16a34a] font-bold text-sm pt-1 border-t border-slate-200">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcPayable} />
						</span>
						<span>{formatNum(calculations.attErhalla)} SEK</span>
					</div>
				</div>
			</div>
		</div>
	);
}
