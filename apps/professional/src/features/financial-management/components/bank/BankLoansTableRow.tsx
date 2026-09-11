"use client";

import React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankLoanItem } from "../../types/bank.types";

interface BankLoansTableRowProps {
	loan: BankLoanItem;
	onView: (loan: BankLoanItem) => void;
}

export function BankLoansTableRow({ loan, onView }: BankLoansTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
			{/* Lån id */}
			<td className="px-4 py-3.5 text-sm font-medium text-slate-900 whitespace-nowrap">
				{loan.loanNr}
			</td>

			{/* Titel */}
			<td className="px-4 py-3.5 text-sm text-slate-800 font-medium whitespace-nowrap">
				<button
					type="button"
					onClick={() => onView(loan)}
					className="hover:underline text-left cursor-pointer hover:text-slate-900"
				>
					{loan.title}
				</button>
			</td>

			{/* Lånetyp badge */}
			<td className="px-4 py-3.5 text-sm whitespace-nowrap">
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
					{loan.loanType}
				</span>
			</td>

			{/* Bank */}
			<td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
				{loan.bank}
			</td>

			{/* Start Datum */}
			<td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap font-mono">
				{loan.startDate}
			</td>

			{/* Slut Datum */}
			<td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap font-mono">
				{loan.endDate}
			</td>

			{/* Status */}
			<td className="px-4 py-3.5 text-sm whitespace-nowrap">
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
						loan.status === "active"
							? "bg-emerald-500 text-white"
							: "bg-slate-200 text-slate-700"
					}`}
				>
					{loan.status === "active"
						? t(localizationConstants.statusActive)
						: t(localizationConstants.statusInactive)}
				</span>
			</td>

			{/* Action: Eye */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onView(loan)}
					className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
					aria-label={t(localizationConstants.titleLoanDetails)}
				>
					<Eye className="w-4 h-4" />
				</Button>
			</td>
		</tr>
	);
}
