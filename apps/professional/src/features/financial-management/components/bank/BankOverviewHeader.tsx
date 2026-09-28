"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { EconomySubTabs, type EconomySubTabItem } from "../common/EconomySubTabs";
import type { BankTabType } from "../../types/bank.types";

interface BankOverviewHeaderProps {
	activeTab: BankTabType;
	onTabChange: (tab: BankTabType) => void;
}

const BANK_SUB_TABS: EconomySubTabItem<BankTabType>[] = [
	{ id: "bankkonton", labelKey: localizationConstants.tabBankAccounts },
	{ id: "lan-finansiering", labelKey: localizationConstants.tabBankLoans },
	{ id: "bank-dokument", labelKey: localizationConstants.tabBankDocs },
];

export function BankOverviewHeader({
	activeTab,
	onTabChange,
}: BankOverviewHeaderProps) {
	return (
		<EconomySubTabs
			tabs={BANK_SUB_TABS}
			activeTab={activeTab}
			onTabChange={onTabChange}
		/>
	);
}

export default BankOverviewHeader;
