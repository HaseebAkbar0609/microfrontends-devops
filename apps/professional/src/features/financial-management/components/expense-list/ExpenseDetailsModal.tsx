"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "../../types/expense.types";
import { ExpenseStatusBadge, ExpenseCategoryBadge } from "./ExpenseBadges";

interface ExpenseDetailsModalProps {
	expense: ExpenseItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
	onMarkPaid: (id: string) => void;
}

function formatSEK(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ExpenseDetailsModal({
	expense,
	open,
	onOpenChange,
	onApprove,
	onReject,
	onMarkPaid,
}: ExpenseDetailsModalProps) {
	if (!expense) return null;

	const exVat = Math.max(0, expense.amount - expense.vatAmount);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg bg-white p-6 rounded-xl shadow-2xl">
				<DialogHeader className="border-b border-slate-100 pb-3">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.expenseDetailsTitle} /> - {expense.expenseNo}
						</DialogTitle>
						<ExpenseStatusBadge status={expense.status} />
					</div>
				</DialogHeader>

				<div className="space-y-4 py-3 text-xs">
					{/* Supplier & Amount Hero */}
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
						<div>
							<p className="text-[10px] text-slate-500 uppercase font-semibold">
								<Translate text={localizationConstants.expenseColSupplier} />
							</p>
							<p className="text-base font-bold text-slate-900 mt-0.5">{expense.supplier}</p>
							{expense.invoiceRef && (
								<p className="text-slate-500 text-[11px]">Fakturanr: {expense.invoiceRef}</p>
							)}
						</div>
						<div className="text-right">
							<p className="text-[10px] text-slate-500 uppercase font-semibold">
								<Translate text={localizationConstants.expenseColAmount} />
							</p>
							<p className="text-lg font-black text-slate-900 mt-0.5">
								{formatSEK(expense.amount)} SEK
							</p>
							<p className="text-slate-400 text-[10px]">
								{formatSEK(exVat)} SEK exkl. moms ({formatSEK(expense.vatAmount)} moms)
							</p>
						</div>
					</div>

					{/* Metadata Grid */}
					<div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
						<div>
							<span className="text-slate-500 block">
								<Translate text={localizationConstants.expenseColCategory} />:
							</span>
							<div className="mt-1">
								<ExpenseCategoryBadge category={expense.category} />
							</div>
						</div>
						<div>
							<span className="text-slate-500 block">
								<Translate text={localizationConstants.expenseColProject} />:
							</span>
							<span className="font-semibold text-slate-900 block mt-1">
								{expense.project}
							</span>
							<span className="text-slate-400 text-[10px]">
								{expense.projectNumber} &bull; {expense.costCenter}
							</span>
						</div>
						<div>
							<span className="text-slate-500 block">
								<Translate text={localizationConstants.expenseColDate} />:
							</span>
							<span className="font-medium text-slate-800 block mt-1">{expense.date}</span>
						</div>
						<div>
							<span className="text-slate-500 block">
								<Translate text={localizationConstants.expenseColDueDate} />:
							</span>
							<span className="font-medium text-slate-800 block mt-1">{expense.dueDate}</span>
						</div>
					</div>

					{/* Notes / Description */}
					<div>
						<p className="font-semibold text-slate-700 mb-1">
							<Translate text={localizationConstants.createInvoiceModalNotes} />
						</p>
						<div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600 leading-relaxed">
							{expense.notes || <Translate text={localizationConstants.invoiceDetailNoComment} />}
						</div>
					</div>
				</div>

				<DialogFooter className="border-t border-slate-100 pt-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						{expense.status === "pending" && (
							<>
								<Button
									size="sm"
									onClick={() => {
										onApprove(expense.id);
										onOpenChange(false);
									}}
									className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
								>
									<Translate text={localizationConstants.expenseActionApprove} />
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										onReject(expense.id);
										onOpenChange(false);
									}}
									className="text-xs border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
								>
									<Translate text={localizationConstants.expenseActionReject} />
								</Button>
							</>
						)}

						{expense.status === "approved" && (
							<Button
								size="sm"
								onClick={() => {
									onMarkPaid(expense.id);
									onOpenChange(false);
								}}
								className="text-xs bg-zinc-900 hover:bg-slate-800 text-white cursor-pointer"
							>
								<Translate text={localizationConstants.expenseActionMarkAsPaid} />
							</Button>
						)}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="text-xs cursor-pointer border-slate-200"
					>
						<Translate text={localizationConstants.actionClose} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ExpenseDetailsModal;
