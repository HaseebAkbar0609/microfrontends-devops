"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, FilePenLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { SUPPORTED_BANKS_LIST } from "../../constants/bank.constants";

export interface BankSelectionGridProps {
	onSelectBankForBankId: (bankName: string) => void;
	onSelectManual: () => void;
}

export function BankSelectionGrid({
	onSelectBankForBankId,
	onSelectManual,
}: BankSelectionGridProps) {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredBanks = SUPPORTED_BANKS_LIST.filter((b) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return (
			b.name.toLowerCase().includes(q) ||
			b.shortName.toLowerCase().includes(q) ||
			b.bic.toLowerCase().includes(q)
		);
	});

	return (
		<div className="space-y-5">
			<div className="text-center space-y-1">
				<h3 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.titleSelectBank} />
				</h3>
				<p className="text-xs text-slate-500 max-w-md mx-auto">
					<Translate text={localizationConstants.subtitleSelectBank} />
				</p>
			</div>

			<div className="relative max-w-md mx-auto">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
				<Input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder={t(localizationConstants.searchBankPlaceholder)}
					className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
				/>
			</div>

			{/* Bank Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{filteredBanks.map((bank) => (
					<button
						key={bank.id}
						type="button"
						onClick={() => onSelectBankForBankId(bank.name)}
						className="flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-xl shadow-2xs transition-all text-center group cursor-pointer"
					>
						<div
							className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm mb-2 shadow-2xs ${bank.badgeBg} ${bank.badgeText}`}
						>
							{bank.shortName.slice(0, 3).toUpperCase()}
						</div>
						<span className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-slate-900">
							{bank.shortName}
						</span>
						<span className="text-[10px] text-slate-400">BIC: {bank.bic}</span>
					</button>
				))}
			</div>

			{/* Actions Footer */}
			<div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
				<div className="flex items-center gap-1.5 text-[11px] text-slate-500">
					<ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
					<span>BankID PSD2 Open Banking API</span>
				</div>

				<Button
					type="button"
					variant="outline"
					onClick={onSelectManual}
					className="h-9 px-4 text-xs font-medium text-slate-700 bg-white border-slate-200 hover:bg-slate-50 gap-2 cursor-pointer"
				>
					<FilePenLine className="w-3.5 h-3.5 text-slate-500" />
					<Translate text={localizationConstants.btnManualRegistration} />
				</Button>
			</div>
		</div>
	);
}

export default BankSelectionGrid;
