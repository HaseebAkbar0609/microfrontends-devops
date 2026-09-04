"use client";

import React from "react";
import { ExpenseItem } from "../../types/expense.types";
import { ExpenseDetailInvoiceInfoCard } from "./ExpenseDetailInvoiceInfoCard";
import { ExpenseDetailPaymentPlanCard } from "./ExpenseDetailPaymentPlanCard";
import { ExpenseDetailCommentCard } from "./ExpenseDetailCommentCard";

interface ExpenseDetailOversiktTabProps {
	expense: ExpenseItem;
	onEdit?: () => void;
	onSaveComment?: (comment: string) => void;
}

export function ExpenseDetailOversiktTab({
	expense,
	onEdit,
	onSaveComment,
}: ExpenseDetailOversiktTabProps) {
	return (
		<div>
			{/* 1. Fakturainformation Card (Grid + Line Items Table + Financial Summary) */}
			<ExpenseDetailInvoiceInfoCard expense={expense} onEdit={onEdit} />

			{/* 2. Betalningsplan Card (Table matching Figma) */}
			<ExpenseDetailPaymentPlanCard items={expense.paymentPlanItems} onEdit={onEdit} />

			{/* 3. Kommentar Card */}
			<ExpenseDetailCommentCard
				comment={expense.comments || expense.notes}
				onSaveComment={onSaveComment}
			/>
		</div>
	);
}

export default ExpenseDetailOversiktTab;
