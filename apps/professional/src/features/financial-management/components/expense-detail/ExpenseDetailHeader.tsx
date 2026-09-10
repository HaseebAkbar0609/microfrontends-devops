"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "../../types/expense.types";
import { EXPENSE_LIST_ROUTE } from "../../constants/expense.constants";

interface ExpenseDetailHeaderProps {
	expense: ExpenseItem;
	onDispute?: () => void;
	onMarkCertified?: () => void;
	onMoveToSupplierList?: () => void;
	isSubmitting?: boolean;
}

export function ExpenseDetailHeader({
	expense,
	onDispute,
	onMarkCertified,
	onMoveToSupplierList,
	isSubmitting = false,
}: ExpenseDetailHeaderProps) {
	const { t } = useTranslation();
	const isInbox = Boolean(expense.isInboxItem);

	return (
		<div className="flex items-center justify-between pb-4">
			{/* Left: Back Button & Detaljer Title matching Figma */}
			<div className="flex items-center gap-2">
				<Link href={EXPENSE_LIST_ROUTE}>
					<Button
						variant="ghost"
						size="icon"
						aria-label={t(localizationConstants.expenseDetailBack)}
						className="h-8 w-8 text-slate-800 hover:text-slate-900 cursor-pointer -ml-2"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.expenseDetailTitle} />
				</h1>
			</div>

			{/* Right: Actions matching Figma */}
			<div className="flex items-center gap-2.5">
				{isInbox ? (
					/* Inbox Action: Flytta till leverantörslistan */
					<Button
						type="button"
						size="sm"
						disabled={isSubmitting}
						onClick={onMoveToSupplierList}
						className="h-9 px-4 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer gap-2 shadow-xs rounded-md"
					>
						<Check className="h-3.5 w-3.5" />
						<span>
							<Translate text={localizationConstants.expenseDetailBtnMoveToSupplierList} />
						</span>
					</Button>
				) : (
					/* Supplier Invoice Actions: göra reklamation + Markera som bestyrkt */
					<>
						<Button
							type="button"
							size="sm"
							disabled={isSubmitting}
							onClick={onDispute}
							className="h-9 px-4 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer gap-2 shadow-xs rounded-md"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.expenseDetailBtnDispute} />
							</span>
						</Button>

						<Button
							type="button"
							size="sm"
							disabled={isSubmitting}
							onClick={onMarkCertified}
							className="h-9 px-4 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2 shadow-xs rounded-md"
						>
							<Check className="h-3.5 w-3.5" />
							<span>
								<Translate text={localizationConstants.expenseDetailBtnMarkCertified} />
							</span>
						</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default ExpenseDetailHeader;
