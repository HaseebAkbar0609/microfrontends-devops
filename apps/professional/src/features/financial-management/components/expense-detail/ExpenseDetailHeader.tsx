"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, CheckCircle, Check, Trash2, CreditCard } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "../../types/expense.types";

interface ExpenseDetailHeaderProps {
	expense: ExpenseItem;
	onPrint: () => void;
	onApprove: () => void;
	onMarkAsPaid: () => void;
	onDelete: () => void;
	isSubmitting: boolean;
}

export function ExpenseDetailHeader({
	expense,
	onPrint,
	onApprove,
	onMarkAsPaid,
	onDelete,
	isSubmitting,
}: ExpenseDetailHeaderProps) {
	const isApproved = expense.approvalStatus === "approved" || expense.status === "klar";
	const isPaid = Boolean(expense.paymentDate);

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
			{/* Left: Back Button & Title */}
			<div className="flex items-center gap-3">
				<Link href="/module/financial-management/economy">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Back"
						className="h-8 w-8 text-slate-700 hover:text-slate-900 cursor-pointer -ml-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
						<Translate text={localizationConstants.expenseDetailTitle} />
						<span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
							{expense.fakturaNo || expense.expenseNo}
						</span>
					</h1>
				</div>
			</div>

			{/* Right: Actions */}
			<div className="flex items-center gap-2 flex-wrap">
				{/* Print Button */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onPrint}
					className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer gap-1.5"
				>
					<Printer className="h-3.5 w-3.5 text-slate-500" />
					<span>
						<Translate text={localizationConstants.expenseDetailPrintBtn} />
					</span>
				</Button>

				{/* Approve Button / Approved Badge */}
				{isApproved ? (
					<div className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
						<Check className="h-3.5 w-3.5 text-emerald-600" />
						<span>
							<Translate text={localizationConstants.expenseDetailBtnApproved} />
						</span>
					</div>
				) : (
					<Button
						type="button"
						size="sm"
						disabled={isSubmitting}
						onClick={onApprove}
						className="h-8 px-3 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5 shadow-xs"
					>
						<CheckCircle className="h-3.5 w-3.5" />
						<span>
							<Translate text={localizationConstants.expenseDetailBtnApprove} />
						</span>
					</Button>
				)}

				{/* Mark as Paid Action */}
				{!isPaid && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isSubmitting}
						onClick={onMarkAsPaid}
						className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer gap-1.5"
					>
						<CreditCard className="h-3.5 w-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.expenseDetailBtnMarkPaid} />
						</span>
					</Button>
				)}

				{/* Delete Action */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					disabled={isSubmitting}
					onClick={onDelete}
					aria-label="Delete expense"
					className="h-8 w-8 text-slate-400 hover:text-rose-600 cursor-pointer"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	);
}

export default ExpenseDetailHeader;
