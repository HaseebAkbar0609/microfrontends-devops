"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankTabType } from "../../types/bank.types";

interface BankOverviewHeaderProps {
	activeTab: BankTabType;
	onTabChange: (tab: BankTabType) => void;
}

export function BankOverviewHeader({
	activeTab,
	onTabChange,
}: BankOverviewHeaderProps) {
	const tabs: { id: BankTabType; labelKey: string }[] = [
		{ id: "bankkonton", labelKey: localizationConstants.tabBankAccounts },
		{ id: "lan-finansiering", labelKey: localizationConstants.tabBankLoans },
		{ id: "bank-dokument", labelKey: localizationConstants.tabBankDocs },
	];

	return (
		<div className="flex items-center gap-8 border-b border-[#E2E8F0] mb-6">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
							isActive
								? "text-[#0F172A] border-b-2 border-[#0F172A]"
								: "text-[#64748B] hover:text-[#0F172A]"
						}`}
					>
						<Translate text={tab.labelKey} />
					</button>
				);
			})}
		</div>
	);
}

export default BankOverviewHeader;
