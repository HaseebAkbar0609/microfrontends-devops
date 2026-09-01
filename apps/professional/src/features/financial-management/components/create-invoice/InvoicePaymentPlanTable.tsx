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
import { Button } from "@/components/ui/button";
import { PaymentPlanItem } from "../../types/createInvoice.types";

interface InvoicePaymentPlanTableProps {
	items: PaymentPlanItem[];
	onAddRow: () => void;
	onRemoveRow: (id: string) => void;
}

export function InvoicePaymentPlanTable({
	items,
	onAddRow,
	onRemoveRow,
}: InvoicePaymentPlanTableProps) {
	const formatNum = (num: number) => {
		return num.toLocaleString("sv-SE");
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-5">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
				<Translate text={localizationConstants.createInvoicePaymentPlanTitle} />
			</h3>

			<div className="w-full overflow-x-auto">
				<Table className="w-full min-w-[950px] border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24">
								Invoice nr
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28">
								Datum
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[160px]">
								Beskrivning
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Deb. Antal
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-20">
								Enhet
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Pris / styck
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Innehållet
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Belopp
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Betalt
							</TableHead>
							<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-right">
								Kost
							</TableHead>
							<TableHead className="py-2.5 px-2 w-12 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
								<TableCell className="py-2 px-3 text-xs font-medium text-slate-800">
									{row.invoiceNo}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700">
									{row.date}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs font-medium text-slate-800">
									{row.description}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700 text-right">
									{row.quantity}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700">
									{row.unit}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700 text-right">
									{formatNum(row.unitPrice)}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700 text-right">
									{formatNum(row.withheld)}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs font-medium text-slate-800 text-right">
									{formatNum(row.amount)}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700 text-right">
									{formatNum(row.paid)}
								</TableCell>
								<TableCell className="py-2 px-3 text-xs text-slate-700 text-right">
									{formatNum(row.cost)}
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

			<div className="pt-3">
				<Button
					variant="outline"
					onClick={onAddRow}
					className="h-8 px-3 gap-1.5 border-slate-200 text-xs font-normal text-slate-700 hover:bg-slate-50 cursor-pointer"
				>
					<Plus className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.createInvoiceAddRow} />
				</Button>
			</div>
		</div>
	);
}
