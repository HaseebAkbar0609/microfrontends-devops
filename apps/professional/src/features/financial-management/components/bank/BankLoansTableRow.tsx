"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankLoanItem } from "../../types/bank.types";

interface BankLoansTableRowProps {
	loan: BankLoanItem;
	onDelete?: (id: string, title: string) => void;
}

export function BankLoansTableRow({
	loan,
	onDelete,
}: BankLoansTableRowProps) {
	const { t } = useTranslation();

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs text-slate-700">
			{/* ID */}
			<td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
				{loan.loanNr || `#${loan.id}`}
			</td>

			{/* Villkorsnamn */}
			<td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
				{loan.title || "Standard leverantörsvillkor"}
			</td>

			{/* Leverantör */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
				{loan.supplier || loan.bank || "Alla leverantörer"}
			</td>

			{/* Betalningstid */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
				{loan.paymentTerms || `${loan.startDate}...`}
			</td>

			{/* Rabatt */}
			<td className="px-4 py-3.5 whitespace-nowrap text-emerald-600 font-medium">
				{loan.discount || "2% (10 dagar).."}
			</td>

			{/* Dröjsmål */}
			<td className="px-4 py-3.5 whitespace-nowrap text-rose-600 font-medium">
				{loan.overdueInterest || "8%"}
			</td>

			{/* Action: Delete */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				{onDelete && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onDelete(loan.id, loan.title)}
						className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
						aria-label={t(localizationConstants.btnDelete)}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				)}
			</td>
		</tr>
	);
}

export default BankLoansTableRow;
