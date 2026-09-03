"use client";

import React, { useState } from "react";
import { FileText, Edit2, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem, ExpenseUnderlagItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";
import { ExpenseDetailCommentCard } from "./ExpenseDetailCommentCard";
import { formatSEK } from "../../utils/expenseUtils";

interface ExpenseDetailUnderlagTabProps {
	expense: ExpenseItem;
	onEdit?: () => void;
	onSaveComment?: (comment: string) => void;
}

export function ExpenseDetailUnderlagTab({
	expense,
	onEdit,
	onSaveComment,
}: ExpenseDetailUnderlagTabProps) {
	const defaultUnderlagItems: ExpenseUnderlagItem[] = [
		{
			id: "und-1",
			date: "2026-01-12",
			supplier: "Bygg Max",
			supplierInvoiceNo: "2025-001-11",
			amount: 15685,
			unit: "st",
			ataNo: "5",
			markupPercent: 12,
			markupKr: 1560,
			costCenter: "10",
			subtotal: 163685,
			comments: "Lorem Ipsum is simply dummy",
		},
		{
			id: "und-2",
			date: "2026-01-14",
			supplier: "Beijer",
			supplierInvoiceNo: "2025-001-11",
			amount: 15685,
			unit: "st",
			ataNo: "14",
			markupPercent: 15,
			markupKr: 1685,
			costCenter: "10",
			subtotal: 163685,
			comments: "Lorem Ipsum is simply dummy",
		},
	];

	const [items, setItems] = useState<ExpenseUnderlagItem[]>(
		expense.underlagItems && expense.underlagItems.length > 0
			? expense.underlagItems
			: defaultUnderlagItems
	);

	const handleAddRow = () => {
		const newItem: ExpenseUnderlagItem = {
			id: `und-${Date.now()}`,
			date: new Date().toISOString().split("T")[0],
			supplier: "Ny Leverantör",
			supplierInvoiceNo: "2026-001",
			amount: 10000,
			unit: "st",
			ataNo: "1",
			markupPercent: 10,
			markupKr: 1000,
			costCenter: "10",
			subtotal: 11000,
			comments: "",
		};
		setItems((prev) => [...prev, newItem]);
	};

	const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
	const totalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<div>
			{/* 1. Fakturainformation Card */}
			<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-6">
				{/* Card Header */}
				<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-slate-600" />
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.expenseDetailCardInvoiceInfo} />
						</h3>
					</div>
					{onEdit && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onEdit}
							className="h-7 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
						>
							<Edit2 className="h-3 w-3 text-slate-500" />
							<span>
								<Translate text={localizationConstants.expenseDetailBtnEdit} />
							</span>
						</Button>
					)}
				</div>

				{/* Metadata Grid matching Figma detail_underlag.png */}
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-3.5 text-xs mb-6">
					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseColInvoiceNo} />
						</span>
						<span className="text-slate-800">
							{expense.fakturaNo || expense.expenseNo}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseColStatus} />
						</span>
						<div>
							<ExpenseStatusBadge status={expense.status} />
						</div>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailAttachTimeReport} />
						</span>
						<span className="text-slate-800">
							{expense.attachTimeReport !== false ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailUnderlag} />
						</span>
						<span className="text-slate-800">
							{expense.hasUnderlag !== false ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailCreditInvoice} />
						</span>
						<span className="text-slate-800">
							{expense.isCreditInvoice ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailCustomer} />
						</span>
						<span className="text-slate-800 font-medium">
							{expense.customerName || "Allmännyttan"}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailObjectNo} />
						</span>
						<span className="text-slate-800">
							{expense.projectNumber || "PROJ-2026-001"}
						</span>
					</div>
				</div>

				{/* Underlag Table matching Figma */}
				<div className="overflow-x-auto border border-slate-200 rounded-md mb-3">
					<table className="w-full text-left text-xs border-collapse">
						<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
							<tr>
								<th className="py-2.5 px-3 whitespace-nowrap">
									<Translate text={localizationConstants.expenseColDate} />
								</th>
								<th className="py-2.5 px-3 whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColSupplier} />
								</th>
								<th className="py-2.5 px-3 text-center whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColSupplierNo} />
								</th>
								<th className="py-2.5 px-3 text-right whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColAmount} />
								</th>
								<th className="py-2.5 px-3 whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailColUnit} />
								</th>
								<th className="py-2.5 px-3 text-center whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColAtaNo} />
								</th>
								<th className="py-2.5 px-3 text-center whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColMarkup} />
								</th>
								<th className="py-2.5 px-3 text-right whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColMarkupKr} />
								</th>
								<th className="py-2.5 px-3 text-center whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailColKs} />
								</th>
								<th className="py-2.5 px-3 text-right whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailUnderlagColSubtotal} />
								</th>
								<th className="py-2.5 px-3 whitespace-nowrap">
									<Translate text={localizationConstants.expenseDetailTimeColComments} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{items.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/50">
									<td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
										{item.date}
									</td>
									<td className="py-2.5 px-3 text-slate-900 font-medium">
										{item.supplier}
									</td>
									{/* Leverantörs nummer with yellow highlight tint */}
									<td className="py-2.5 px-3 text-center font-medium bg-amber-50 text-amber-900">
										{item.supplierInvoiceNo}
									</td>
									{/* Belopp with green highlight tint */}
									<td className="py-2.5 px-3 text-right font-semibold bg-emerald-50 text-emerald-900 font-mono">
										{formatSEK(item.amount)}
									</td>
									<td className="py-2.5 px-3 text-slate-500">
										{item.unit}
									</td>
									<td className="py-2.5 px-3 text-center text-slate-700">
										{item.ataNo || "-"}
									</td>
									<td className="py-2.5 px-3 text-center text-slate-700">
										{item.markupPercent}%
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
										{formatSEK(item.markupKr)}
									</td>
									<td className="py-2.5 px-3 text-center text-slate-500 font-mono">
										{item.costCenter}
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700 font-mono font-medium">
										{formatSEK(item.subtotal)}
									</td>
									<td className="py-2.5 px-3 text-slate-600">
										{item.comments || "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* + Lägg till Button matching Figma */}
				<div className="mb-6">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleAddRow}
						className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
					>
						<Plus className="h-3.5 w-3.5" />
						<span>
							<Translate text={localizationConstants.expenseDetailUnderlagBtnAdd} />
						</span>
					</Button>
				</div>

				{/* Summary Block matching Figma */}
				<div className="flex justify-end">
					<div className="w-72 space-y-1.5 text-xs text-slate-700">
						<div className="flex justify-between py-1">
							<span>
								<Translate text={localizationConstants.expenseDetailUnderlagSumAmount} />
							</span>
							<span className="font-mono font-medium">{formatSEK(totalAmount)}</span>
						</div>

						<div className="flex justify-between py-1 border-b border-slate-200">
							<span>
								<Translate text={localizationConstants.expenseDetailUnderlagSumSum} />
							</span>
							<span className="font-mono font-medium">{formatSEK(totalSum)}</span>
						</div>

						<div className="flex justify-between py-1.5 font-bold text-slate-900 text-sm">
							<span>
								<Translate text={localizationConstants.expenseDetailUnderlagSumTotalAmount} />
							</span>
							<span className="font-mono font-bold">
								{formatSEK(totalAmount)}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Kommentar Card */}
			<ExpenseDetailCommentCard
				comment={expense.comments || expense.notes}
				onSaveComment={onSaveComment}
			/>
		</div>
	);
}

export default ExpenseDetailUnderlagTab;
