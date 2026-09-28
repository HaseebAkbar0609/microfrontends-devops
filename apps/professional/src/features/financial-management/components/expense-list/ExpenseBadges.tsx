"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseStatus, ExpenseCategory } from "../../types/expense.types";
import { EconomyStatusBadge } from "../common/EconomyStatusBadge";

interface ExpenseStatusBadgeProps {
	status: ExpenseStatus;
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
	switch (status) {
		case "klar":
			return (
				<EconomyStatusBadge
					status="klar"
					label={localizationConstants.expenseStatusKlar}
				/>
			);
		case "ej_attesterad":
			return (
				<EconomyStatusBadge
					status="ej_attesterad"
					label={localizationConstants.expenseStatusEjAttesterad}
				/>
			);
		case "reklamerad":
			return (
				<EconomyStatusBadge
					status="reklamerad"
					label={localizationConstants.expenseStatusReklamerad}
				/>
			);
		case "aktiv":
			return (
				<EconomyStatusBadge
					status="aktiv"
					label={localizationConstants.expenseStatusAktiv}
				/>
			);
		case "ledig":
			return (
				<EconomyStatusBadge
					status="ledig"
					label={localizationConstants.expenseStatusLedig}
				/>
			);
		case "ej_paborjad":
			return (
				<EconomyStatusBadge
					status="ej_paborjad"
					label={localizationConstants.expenseStatusEjPaborjad}
				/>
			);
		case "pending":
			return (
				<EconomyStatusBadge
					status="pending"
					label={localizationConstants.expenseStatusPending}
				/>
			);
		case "approved":
			return (
				<EconomyStatusBadge
					status="approved"
					label={localizationConstants.expenseStatusApproved}
				/>
			);
		case "paid":
			return (
				<EconomyStatusBadge
					status="paid"
					label={localizationConstants.expenseStatusPaid}
				/>
			);
		case "rejected":
			return (
				<EconomyStatusBadge
					status="rejected"
					label={localizationConstants.expenseStatusRejected}
				/>
			);
		default:
			return <EconomyStatusBadge status={status} />;
	}
}

interface ExpenseCategoryBadgeProps {
	category: ExpenseCategory;
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
	switch (category) {
		case "material":
			return (
				<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-slate-100 text-slate-700 border border-slate-200/80">
					<Translate text={localizationConstants.expenseCategoryMaterial} />
				</span>
			);
		case "labor":
			return (
				<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-indigo-50 text-indigo-700 border border-indigo-200/80">
					<Translate text={localizationConstants.expenseCategoryLabor} />
				</span>
			);
		case "equipment":
			return (
				<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-purple-50 text-purple-700 border border-purple-200/80">
					<Translate text={localizationConstants.expenseCategoryEquipment} />
				</span>
			);
		case "travel":
			return (
				<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-cyan-50 text-cyan-700 border border-cyan-200/80">
					<Translate text={localizationConstants.expenseCategoryTravel} />
				</span>
			);
		case "other":
		default:
			return (
				<span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-slate-100 text-slate-600 border border-slate-200/80">
					<Translate text={localizationConstants.expenseCategoryOther} />
				</span>
			);
	}
}

export default ExpenseStatusBadge;
