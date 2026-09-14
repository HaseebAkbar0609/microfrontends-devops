"use client";

import React from "react";
import { Eye, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankLoanItem } from "../../types/bank.types";

interface BankLoansTableRowProps {
	loan: BankLoanItem;
	onView: (loan: BankLoanItem) => void;
	onEdit?: (loan: BankLoanItem) => void;
	onDelete?: (id: string, title: string) => void;
}

export function BankLoansTableRow({
	loan,
	onView,
	onEdit,
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
				<button
					type="button"
					onClick={() => onView(loan)}
					className="hover:underline text-left cursor-pointer hover:text-slate-900"
				>
					{loan.title || "Standard leverantörsvillkor"}
				</button>
			</td>

			{/* Leverantör */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
				{loan.supplier || loan.bank || "Alla leverantörer"}
			</td>

			{/* Betalningstid */}
			<td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
				{loan.paymentTerms || `${loan.startDate}...`}
			</td>

			{/* Rabatt (Green font as in Figma) */}
			<td className="px-4 py-3.5 whitespace-nowrap text-emerald-600 font-medium">
				{loan.discount || "2% (10 dagar).."}
			</td>

			{/* Dröjsmål (Red font as in Figma) */}
			<td className="px-4 py-3.5 whitespace-nowrap text-rose-600 font-medium">
				{loan.overdueInterest || "8%"}
			</td>

			{/* Action: Eye + 3 Dots Menu */}
			<td className="px-4 py-3.5 text-right whitespace-nowrap">
				<div className="flex items-center justify-end gap-1">
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

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
								aria-label="Actions"
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => onView(loan)}
								className="gap-2 cursor-pointer text-xs"
							>
								<Eye className="w-3.5 h-3.5" />
								<Translate text={localizationConstants.titleLoanDetails} />
							</DropdownMenuItem>
							{onEdit && (
								<DropdownMenuItem
									onClick={() => onEdit(loan)}
									className="gap-2 cursor-pointer text-xs"
								>
									<Edit2 className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.btnEdit} />
								</DropdownMenuItem>
							)}
							{onDelete && (
								<DropdownMenuItem
									onClick={() => onDelete(loan.id, loan.title)}
									className="gap-2 cursor-pointer text-xs text-rose-600 hover:text-rose-700"
								>
									<Trash2 className="w-3.5 h-3.5" />
									<Translate text={localizationConstants.btnDelete} />
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</td>
		</tr>
	);
}

export default BankLoansTableRow;

