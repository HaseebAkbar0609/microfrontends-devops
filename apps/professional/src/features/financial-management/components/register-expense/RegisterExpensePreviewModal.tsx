"use client";

import React from "react";
import { Printer } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { RegisterExpenseFormData, RegisterExpenseCalculations } from "../../types/expense.types";

interface RegisterExpensePreviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: RegisterExpenseFormData;
	calculations: RegisterExpenseCalculations;
}

export function RegisterExpensePreviewModal({
	open,
	onOpenChange,
	formData,
	calculations,
}: RegisterExpensePreviewModalProps) {
	const formatNum = (num: number) => {
		return num.toLocaleString("sv-SE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl border border-slate-200 shadow-2xl">
				<DialogHeader className="flex flex-row items-center justify-between border-b border-slate-200 pb-4">
					<div>
						<DialogTitle className="text-base font-bold text-slate-900">
							Förhandsgranskning av utgift
						</DialogTitle>
						<p className="text-xs text-slate-400 mt-0.5">
							Kontrollera utgiftsdetaljer och bokföringsposter innan slutgiltig registrering.
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-8 text-xs gap-1.5 border-slate-200 cursor-pointer mr-6"
					>
						<Printer className="h-3.5 w-3.5" />
						Skriv ut
					</Button>
				</DialogHeader>

				<div className="space-y-6 pt-3 text-xs">
					{/* Supplier & Invoice Info Header */}
					<div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
						<div className="space-y-1">
							<p className="text-slate-500 font-medium">Leverantör</p>
							<p className="text-sm font-bold text-slate-900">{formData.supplier || "—"}</p>
							<p className="text-slate-500 mt-2 font-medium">Kategori</p>
							<p className="text-slate-800 font-semibold capitalize">{formData.category}</p>
						</div>
						<div className="space-y-1 text-right sm:text-left">
							<p className="text-slate-500 font-medium">Fakturanummer</p>
							<p className="text-sm font-bold text-slate-900">{formData.fakturaNo || "—"}</p>
							<div className="flex gap-4 mt-2">
								<div>
									<p className="text-slate-500 font-medium">Fakturadatum</p>
									<p className="text-slate-800">{formData.date}</p>
								</div>
								<div>
									<p className="text-slate-500 font-medium">Förfallodatum</p>
									<p className="text-slate-800">{formData.dueDate}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Line Items Table */}
					<div>
						<h4 className="text-xs font-semibold text-slate-900 mb-2">Utgiftsposter</h4>
						<Table className="border border-slate-200">
							<TableHeader>
								<TableRow className="bg-slate-50/70 border-b border-slate-200">
									<TableHead className="py-2 px-3 text-xs font-semibold">Beskrivning</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-center w-20">Antal</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-center w-20">Enhet</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-right w-24">Á-pris</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-center w-20">Moms</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-center w-20">Konto</TableHead>
									<TableHead className="py-2 px-3 text-xs font-semibold text-right w-28">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{formData.lineItems.map((item) => (
									<TableRow key={item.id} className="border-b border-slate-200">
										<TableCell className="py-2 px-3 font-medium text-slate-800">
											{item.description || "—"}
										</TableCell>
										<TableCell className="py-2 px-3 text-center">{item.quantity}</TableCell>
										<TableCell className="py-2 px-3 text-center">{item.unit}</TableCell>
										<TableCell className="py-2 px-3 text-right">{formatNum(item.unitPrice)} kr</TableCell>
										<TableCell className="py-2 px-3 text-center">{item.vatRate} %</TableCell>
										<TableCell className="py-2 px-3 text-center">{item.accountNumber}</TableCell>
										<TableCell className="py-2 px-3 text-right font-semibold text-slate-900">
											{formatNum(item.total)} kr
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Summary Breakdown */}
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 max-w-sm ml-auto space-y-2">
						<div className="flex justify-between text-slate-600">
							<span>Delsumma exkl. moms:</span>
							<span className="font-semibold text-slate-900">{formatNum(calculations.subtotal)} SEK</span>
						</div>
						{calculations.vatBreakdown.map((b) => (
							<div key={b.rate} className="flex justify-between text-slate-500 pl-2">
								<span>Moms ({b.rate} %):</span>
								<span>{formatNum(b.vatAmount)} SEK</span>
							</div>
						))}
						<div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
							<span>Totalt att betala:</span>
							<span className="text-emerald-600 font-bold">{formatNum(calculations.grandTotal)} SEK</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default RegisterExpensePreviewModal;
