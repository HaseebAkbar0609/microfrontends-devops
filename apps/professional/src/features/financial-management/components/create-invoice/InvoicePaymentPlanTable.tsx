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
import { PaymentPlanItem } from "../../types/createInvoice.types";

interface InvoicePaymentPlanTableProps {
	items: PaymentPlanItem[];
	onAddRow: () => void;
	onUpdateRow: (id: string, updates: Partial<PaymentPlanItem>) => void;
	onRemoveRow: (id: string) => void;
}

export function InvoicePaymentPlanTable({
	items,
	onAddRow,
	onUpdateRow,
	onRemoveRow,
}: InvoicePaymentPlanTableProps) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
				<Translate text={localizationConstants.createInvoicePaymentPlanTitle} />
			</h3>

			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[950px] border-collapse border border-slate-200">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 border-r border-slate-200">
								Invoice nr
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-28 border-r border-slate-200">
								Datum
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 min-w-[160px] border-r border-slate-200">
								Beskrivning
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Deb. Antal
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-20 border-r border-slate-200">
								Enhet
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Pris / styck
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Innehållet
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Belopp
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Betalt
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-normal text-slate-700 w-24 text-left border-r border-slate-200">
								Kost
							</TableHead>
							<TableHead className="py-2.5 px-2 w-12 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.id} className="border-b border-slate-200 hover:bg-slate-50/50">
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.invoiceNo}
										onChange={(e) => onUpdateRow(row.id, { invoiceNo: e.target.value })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="date"
										value={row.date}
										onChange={(e) => onUpdateRow(row.id, { date: e.target.value })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										value={row.description}
										onChange={(e) => onUpdateRow(row.id, { description: e.target.value })}
										placeholder="Beskrivning..."
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.quantity}
										onChange={(e) => onUpdateRow(row.id, { quantity: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Select
										value={row.unit}
										onValueChange={(val) => onUpdateRow(row.id, { unit: val })}
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
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.unitPrice}
										onChange={(e) => onUpdateRow(row.id, { unitPrice: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.withheld}
										onChange={(e) => onUpdateRow(row.id, { withheld: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.amount}
										onChange={(e) => onUpdateRow(row.id, { amount: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none font-medium text-slate-800"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.paid}
										onChange={(e) => onUpdateRow(row.id, { paid: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-3 border-r border-slate-200">
									<Input
										type="number"
										value={row.cost}
										onChange={(e) => onUpdateRow(row.id, { cost: Number(e.target.value) })}
										className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none"
									/>
								</TableCell>
								<TableCell className="py-2 px-2 text-center">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onRemoveRow(row.id)}
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

			<div className="pt-4">
				<button
					type="button"
					onClick={onAddRow}
					className="h-8 px-4 border border-dashed border-slate-300 bg-[#f8fafc] text-xs font-normal text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
				>
					+ Ny rad
				</button>
			</div>
		</div>
	);
}
