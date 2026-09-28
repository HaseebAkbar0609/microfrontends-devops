"use client";

import React from "react";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	AUTHORITY_CATEGORY_OPTIONS,
	getAuthorityCategoryLabel,
	type AuthorityCategoryOption,
} from "../../utils/authoritiesLocalization";
import type { AuthorityCategory } from "../../types/authorities.types";

interface AuthoritiesToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (val: string) => void;
	onCreateClick: () => void;
}

export function AuthoritiesToolbar({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	onCreateClick,
}: AuthoritiesToolbarProps) {
	const { t } = useTranslation();

	const activeFilterLabel =
		categoryFilter === "all"
			? t(localizationConstants.filterAllCategoriesAuthority)
			: getAuthorityCategoryLabel(categoryFilter as AuthorityCategory, t);

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-1">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={t(localizationConstants.searchPlaceholderAuthority)}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal rounded-lg shadow-2xs gap-1.5 cursor-pointer justify-between sm:justify-start"
						>
							<Filter className="w-3.5 h-3.5 text-slate-500" />
							<span>{activeFilterLabel}</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="cursor-pointer text-xs focus:bg-slate-100"
						>
							<Translate text={localizationConstants.filterAllCategoriesAuthority} />
						</DropdownMenuItem>
						{AUTHORITY_CATEGORY_OPTIONS.map((opt: AuthorityCategoryOption) => (
							<DropdownMenuItem
								key={opt.value}
								onClick={() => onCategoryFilterChange(opt.value)}
								className="cursor-pointer text-xs focus:bg-slate-100"
							>
								{getAuthorityCategoryLabel(opt.value, t)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex items-center justify-end">
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-2 cursor-pointer transition-colors w-full sm:w-auto justify-center"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnAddAuthority} />
				</Button>
			</div>
		</div>
	);
}


export default AuthoritiesToolbar;
