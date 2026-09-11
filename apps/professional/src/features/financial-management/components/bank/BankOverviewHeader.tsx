"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
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
		<>
			{/* Page Header & Breadcrumbs */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
					<Translate text={localizationConstants.titleBank} />
				</h1>
				<div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1.5 font-medium">
					<span>
						<Translate text={localizationConstants.breadcrumbHome} />
					</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span>
						<Translate text={localizationConstants.breadcrumbModule} />
					</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span>
						<Translate text={localizationConstants.economy} />
					</span>
					<ChevronRight className="w-3.5 h-3.5 text-slate-400" />
					<span className="text-[#0F172A] font-semibold">
						<Translate text={localizationConstants.breadcrumbBank} />
					</span>
				</div>
			</div>

			{/* Sub-navigation Tabs */}
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
		</>
	);
}
