"use client";

import React from "react";
import { FileText, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankLoanItem } from "../../types/bank.types";

interface BankLoanInfoCardProps {
	loan: BankLoanItem;
	onEdit: (loan: BankLoanItem) => void;
}

export function BankLoanInfoCard({ loan, onEdit }: BankLoanInfoCardProps) {
	const { t } = useTranslation();

	const formatCurrency = (val: number | undefined) => {
		if (val === undefined || val === null) return "0 kr";
		return `${val.toLocaleString("sv-SE")} kr`;
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Card Header */}
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
						<FileText className="w-5 h-5" />
					</div>
					<div className="flex items-center gap-2.5">
						<h2 className="text-base font-semibold text-slate-900">
							{loan.title}
						</h2>
						<span
							className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
								loan.status === "active"
									? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
									: "bg-slate-100 text-slate-700"
							}`}
						>
							{loan.status === "active"
								? t(localizationConstants.statusActive)
								: t(localizationConstants.statusInactive)}
						</span>
					</div>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onEdit(loan)}
					className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					<Edit2 className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnEdit} />
				</Button>
			</div>

			{/* Grid Content */}
			<div className="p-6 space-y-5">
				{/* Row 1: ID, Bank, Lånetyp, Ränta */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							ID
						</span>
						<span className="text-sm font-medium text-slate-800">
							{loan.id}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colBank} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{loan.bank}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colLoanType} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{loan.loanType}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldInterestRate} />
						</span>
						<span className="text-sm font-medium text-slate-800 font-mono">
							{loan.interestRate ? `${loan.interestRate}%` : "3.25%"}
						</span>
					</div>
				</div>

				{/* Row 2: Månadskostnad (red), Ursprungligt belopp, Kvarstående skuld (red), Återbetalt (green) */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldMonthlyCost} />
						</span>
						<span className="text-sm font-bold text-rose-600 font-mono">
							{formatCurrency(loan.monthlyCost || 48500)}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldOriginalAmount} />
						</span>
						<span className="text-sm font-medium text-slate-800 font-mono">
							{formatCurrency(loan.originalAmount || 5000000)}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldRemainingDebt} />
						</span>
						<span className="text-sm font-bold text-rose-600 font-mono">
							{formatCurrency(loan.remainingDebt || 3750000)}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.fieldRepaidPercent} />
						</span>
						<span className="text-sm font-bold text-emerald-600 font-mono">
							{loan.repaidPercent !== undefined ? `${loan.repaidPercent}%` : "25.0%"}
						</span>
					</div>
				</div>

				{/* Row 3: Start datum, Slut datum */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colStartDate} />
						</span>
						<span className="text-sm font-medium text-slate-700 font-mono">
							{loan.startDate}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colEndDate} />
						</span>
						<span className="text-sm font-medium text-slate-700 font-mono">
							{loan.endDate}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
