"use client";

import React from "react";
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
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#138855] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusKlar} />
				</span>
			);
		case "ej_attesterad":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#0284c7] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusEjAttesterad} />
				</span>
			);
		case "reklamerad":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#f59e0b] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusReklamerad} />
				</span>
			);
		case "aktiv":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#138855] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusAktiv} />
				</span>
			);
		case "ledig":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#eab308] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusLedig} />
				</span>
			);
		case "ej_paborjad":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#94a3b8] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusEjPaborjad} />
				</span>
			);
		case "pending":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#f59e0b] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusPending} />
				</span>
			);
		case "approved":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#0284c7] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusApproved} />
				</span>
			);
		case "paid":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#138855] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusPaid} />
				</span>
			);
		case "rejected":
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#ef4444] text-white shadow-2xs">
					<Translate text={localizationConstants.expenseStatusRejected} />
				</span>
			);
		default:
			return (
				<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-200 text-slate-800">
					{status}
				</span>
			);
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
