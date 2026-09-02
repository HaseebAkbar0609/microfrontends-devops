"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseStatus, ExpenseCategory } from "../../types/expense.types";

interface ExpenseStatusBadgeProps {
	status: ExpenseStatus;
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
	switch (status) {
		case "klar":
			return (
				<Badge
					variant="outline"
					className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusKlar} />
				</Badge>
			);
		case "ej_attesterad":
			return (
				<Badge
					variant="outline"
					className="bg-sky-50 text-sky-700 border-sky-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-sky-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusEjAttesterad} />
				</Badge>
			);
		case "reklamerad":
			return (
				<Badge
					variant="outline"
					className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusReklamerad} />
				</Badge>
			);
		case "aktiv":
			return (
				<Badge
					variant="outline"
					className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusAktiv} />
				</Badge>
			);
		case "ledig":
			return (
				<Badge
					variant="outline"
					className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusLedig} />
				</Badge>
			);
		case "ej_paborjad":
			return (
				<Badge
					variant="outline"
					className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusEjPaborjad} />
				</Badge>
			);
		case "pending":
			return (
				<Badge
					variant="outline"
					className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusPending} />
				</Badge>
			);
		case "approved":
			return (
				<Badge
					variant="outline"
					className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusApproved} />
				</Badge>
			);
		case "paid":
			return (
				<Badge
					variant="outline"
					className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusPaid} />
				</Badge>
			);
		case "rejected":
			return (
				<Badge
					variant="outline"
					className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
					<Translate text={localizationConstants.expenseStatusRejected} />
				</Badge>
			);
		default:
			return <Badge variant="secondary">{status}</Badge>;
	}
}

interface ExpenseCategoryBadgeProps {
	category: ExpenseCategory;
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
	switch (category) {
		case "material":
			return (
				<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
					<Translate text={localizationConstants.expenseCategoryMaterial} />
				</span>
			);
		case "labor":
			return (
				<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
					<Translate text={localizationConstants.expenseCategoryLabor} />
				</span>
			);
		case "equipment":
			return (
				<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
					<Translate text={localizationConstants.expenseCategoryEquipment} />
				</span>
			);
		case "travel":
			return (
				<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
					<Translate text={localizationConstants.expenseCategoryTravel} />
				</span>
			);
		case "other":
		default:
			return (
				<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
					<Translate text={localizationConstants.expenseCategoryOther} />
				</span>
			);
	}
}
