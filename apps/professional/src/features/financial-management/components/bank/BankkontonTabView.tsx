"use client";

import React, { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankAccountItem } from "../../types/bank.types";
import { BankAccountCard } from "./BankAccountCard";

export interface BankkontonTabViewProps {
	accounts: BankAccountItem[];
	searchQuery?: string;
	onSearchChange?: (val: string) => void;
	onCreateAccount?: () => void;
	onCreateClick?: () => void;
}

export function BankkontonTabView({
	accounts,
	searchQuery: externalSearch,
	onSearchChange: externalOnSearchChange,
	onCreateAccount,
	onCreateClick,
}: BankkontonTabViewProps) {
	const { t } = useTranslation();
	const [internalSearch, setInternalSearch] = useState("");

	const searchQuery = externalSearch !== undefined ? externalSearch : internalSearch;
	const handleSearchChange = (val: string) => {
		if (externalOnSearchChange) {
			externalOnSearchChange(val);
		} else {
			setInternalSearch(val);
		}
	};

	const handleCreate = onCreateAccount || onCreateClick || (() => {});

	const filteredAccounts = accounts.filter((acc) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return (
			(acc.bankName && acc.bankName.toLowerCase().includes(q)) ||
			(acc.accountNumber && acc.accountNumber.toLowerCase().includes(q)) ||
			(acc.iban && acc.iban.toLowerCase().includes(q)) ||
			(acc.title && acc.title.toLowerCase().includes(q))
		);
	});

	return (
		<div className="space-y-4">
			{/* Top Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2 flex-1 max-w-xl">
					<div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[300px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							placeholder={t(localizationConstants.searchBankPlaceholder)}
							className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer"
							>
								<Filter className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.filterBankPlaceholder} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							<DropdownMenuItem className="cursor-pointer text-xs">
								<Translate text={localizationConstants.filterAll} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Button
						type="button"
						onClick={handleCreate}
						className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.btnCreateNew} />
					</Button>
				</div>
			</div>

			{/* Cards List */}
			{filteredAccounts.length === 0 ? (
				<div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
					<p className="text-base font-semibold text-slate-800 mb-1">
						<Translate text={localizationConstants.emptyBankAccountsTitle} />
					</p>
					<p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
						<Translate text={localizationConstants.emptyBankAccountsDesc} />
					</p>
					<Button
						type="button"
						onClick={handleCreate}
						className="bg-slate-900 text-white text-xs h-9 px-4 cursor-pointer"
					>
						<Plus className="w-3.5 h-3.5 mr-1" />
						<Translate text={localizationConstants.btnCreateNew} />
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					{filteredAccounts.map((account) => (
						<BankAccountCard
							key={account.id}
							account={account}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default BankkontonTabView;
