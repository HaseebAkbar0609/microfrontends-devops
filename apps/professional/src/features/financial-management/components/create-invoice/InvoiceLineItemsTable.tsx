"use client";

import React from "react";
import { Trash2 } from "lucide-react";
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
		<div className="bg-white rounded-lg border border-slate-200 p-5 mb-5 overflow-hidden">
			{/* Table with visible light border grid matching Figma */}
			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[1050px] border-collapse border border-slate-200">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-24 border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColArticle} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 min-w-[160px] border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColDesc} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColQty} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-24 border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColUnit} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColPrice} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColSubtotal} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColHandling} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-20 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColPercent} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColAdjustment} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColTotal} />
							</TableHead>
							<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-20 text-left border-r border-slate-200">
								<Translate text={localizationConstants.createInvoiceLineColKS} />
							</TableHead>
							<TableHead className="py-2 px-2 w-12 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.id} className="border-b border-slate-200 hover:bg-slate-50/50">
								{/* Artikel */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.articleId}
										onChange={(e) => onUpdateItem(row.id, { articleId: e.target.value })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>

								{/* Beskrivning */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.description}
										onChange={(e) => onUpdateItem(row.id, { description: e.target.value })}
										placeholder="Beskrivning..."
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>

								{/* Deb. Antal */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.quantity}
										onChange={(e) => onUpdateItem(row.id, { quantity: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>

								{/* Enhet */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={row.unit}
										onValueChange={(val) => onUpdateItem(row.id, { unit: val })}
									>
										<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
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
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.unitPrice}
										onChange={(e) => onUpdateItem(row.id, { unitPrice: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>

								{/* Delsumma */}
								<TableCell className="py-2 px-3 text-xs text-slate-800 border-r border-slate-200 whitespace-nowrap">
									{formatNum(row.subtotal)}
								</TableCell>

								{/* Hantering */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={row.handlingType}
										onValueChange={(val) =>
											onUpdateItem(row.id, { handlingType: val as HandlingType })
										}
									>
										<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
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
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="text"
										value={
											row.handlingPercentage ? `${row.handlingPercentage} %` : "-"
										}
										onChange={(e) => {
											const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
											onUpdateItem(row.id, { handlingPercentage: val });
										}}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>

								{/* Justering */}
								<TableCell className="py-2 px-3 text-xs text-slate-800 border-r border-slate-200 whitespace-nowrap">
									{row.adjustmentAmount !== 0 ? formatNum(row.adjustmentAmount) : "-"}
								</TableCell>

								{/* Total */}
								<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 border-r border-slate-200 whitespace-nowrap">
									{formatNum(row.total)}
								</TableCell>

								{/* KS */}
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.costCenter}
										onChange={(e) => onUpdateItem(row.id, { costCenter: e.target.value })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
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

			{/* Add Row Button & Financial Summary */}
			<div className="pt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				{/* Dashed button matching Figma Image 3 */}
				<button
					type="button"
					onClick={onAddItem}
					className="h-8 px-4 border border-dashed border-slate-300 bg-[#f8fafc] text-xs font-normal text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
				>
					+ Ny rad
				</button>

				{/* Financial Calculation Breakdown Box matching Figma layout */}
				<div className="w-full sm:w-80 text-xs space-y-1.5 text-right pr-2">
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcSubtotal} />
						</span>
						<span className="text-slate-800">
							{formatNum(calculations.delsumma)}
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcDiscount} />
						</span>
						<span className="text-slate-800">
							-1000
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcMarkup} />
						</span>
						<span className="text-slate-800">
							15 000
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcRotRut} />
						</span>
						<span className="text-slate-800">
							-1 500
						</span>
					</div>

					<div className="flex justify-between text-slate-700 font-normal">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTotal} />
						</span>
						<span className="text-slate-800">178 000</span>
					</div>

					<div className="border-t border-slate-200 my-1 pt-1" />

					<div className="flex justify-between text-slate-900 font-bold text-xs">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcTax} />
						</span>
						<span>33 750 SEK</span>
					</div>

					<div className="flex justify-between text-[#16a34a] font-bold text-sm pt-0.5">
						<span>
							<Translate text={localizationConstants.createInvoiceCalcPayable} />
						</span>
						<span>203 300 SEK</span>
					</div>
				</div>
			</div>
		</div>
	);
}
