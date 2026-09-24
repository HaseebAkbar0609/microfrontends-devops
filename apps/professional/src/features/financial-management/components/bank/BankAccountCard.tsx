"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankAccountItem } from "../../types/bank.types";

interface BankAccountCardProps {
	account: BankAccountItem;
}

export function BankAccountCard({ account }: BankAccountCardProps) {
	const formatCurrency = (val: number, curr = "SEK") => {
		return `${val.toLocaleString("sv-SE")} ${curr}`;
	};

	const getLocalizedAccountType = (type: string) => {
		if (type === "Företagskonto") return localizationConstants.accountTypeForetagskonto;
		if (type === "Sparkonto") return localizationConstants.accountTypeSparkonto;
		if (type === "Transaktionskonto") return localizationConstants.accountTypeTransaktionskonto;
		return type;
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Header */}
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
						<FileText className="w-5 h-5" />
					</div>
					<div className="flex items-center gap-2.5 flex-wrap">
						<h3 className="text-base font-semibold text-slate-900">
							{account.title || account.bankName}
						</h3>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
							<Translate text={getLocalizedAccountType(account.accountType)} />
						</span>
						{account.isConnected && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
								<Translate text={localizationConstants.badgeBankIdVerified} />
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Account Details */}
			<div className="p-6 space-y-5">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div>
						<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colAccountNumber} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{account.accountNumber}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colIban} />
						</span>
						<span className="text-sm font-medium text-slate-800 font-mono">
							{account.iban}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colSwiftBic} />
						</span>
						<span className="text-sm font-medium text-slate-800 font-mono">
							{account.swiftBic}
						</span>
					</div>

					<div>
						<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
							<Translate text={localizationConstants.colCurrency} />
						</span>
						<span className="text-sm font-medium text-slate-800">
							{account.currency}
						</span>
					</div>
				</div>

				{/* Saldo */}
				<div>
					<span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
						<Translate text={localizationConstants.colBalance} />
					</span>
					<span className="text-base font-bold text-emerald-600 font-mono">
						{formatCurrency(account.balance, account.currency)}
					</span>
				</div>

				{/* Contact Person Sub-section */}
				{account.contactPerson && (account.contactPerson.name || account.contactPerson.email) && (
					<div className="pt-4 border-t border-slate-100 space-y-3">
						<span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
							<Translate text={localizationConstants.contactPersonHeader} />
						</span>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div>
								<span className="block text-xs font-semibold text-slate-500 mb-1">
									<Translate text={localizationConstants.fieldContactName} />
								</span>
								<span className="text-sm font-medium text-slate-800">
									{account.contactPerson.name || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-500 mb-1">
									<Translate text={localizationConstants.fieldContactRole} />
								</span>
								<span className="text-sm font-medium text-slate-600">
									{account.contactPerson.role || "—"}
								</span>
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-500 mb-1">
									<Translate text={localizationConstants.fieldContactEmail} />
								</span>
								{account.contactPerson.email ? (
									<a
										href={`mailto:${account.contactPerson.email}`}
										className="text-sm font-medium text-blue-600 hover:underline"
									>
										{account.contactPerson.email}
									</a>
								) : (
									<span className="text-sm font-medium text-slate-800">—</span>
								)}
							</div>

							<div>
								<span className="block text-xs font-semibold text-slate-500 mb-1">
									<Translate text={localizationConstants.fieldContactPhone} />
								</span>
								<span className="text-sm font-medium text-slate-800 font-mono">
									{account.contactPerson.phone || "—"}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default BankAccountCard;
