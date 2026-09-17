"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import type { CaseCategory, CaseStatus } from "../../types/cases.types";
import { CASE_CATEGORIES } from "../../constants/cases.constants";
import { getCategoryLabelKey } from "./shared";

interface CasesToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: CaseStatus | "all";
	onStatusFilterChange: (status: CaseStatus | "all") => void;
	categoryFilter: CaseCategory | "all";
	onCategoryFilterChange: (category: CaseCategory | "all") => void;
}

export function CasesToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
}: CasesToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-3 w-full sm:w-auto">
			<div className="relative flex-1 sm:w-64">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
				<Input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t(localizationConstants.casesSearchPlaceholder)}
					className="pl-9 h-9 text-xs bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400"
				/>
			</div>

			<Select
				value={categoryFilter}
				onValueChange={(val) => onCategoryFilterChange(val as CaseCategory | "all")}
			>
				<SelectTrigger className="h-9 w-[130px] text-xs bg-white border-slate-200">
					<SelectValue placeholder={t(localizationConstants.casesCategoryAll)} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all" className="text-xs cursor-pointer">
						<Translate text={localizationConstants.casesCategoryAll} />
					</SelectItem>
					{CASE_CATEGORIES.map((cat: CaseCategory) => (
						<SelectItem key={cat} value={cat} className="text-xs cursor-pointer">
							<Translate text={getCategoryLabelKey(cat)} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export default CasesToolbar;
