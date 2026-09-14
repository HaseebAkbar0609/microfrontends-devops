"use client";

import React from "react";
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

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			<div className="flex items-center gap-2.5 flex-1 max-w-xl">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.searchPlaceholder)}
						className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
						>
							<Filter className="w-4 h-4 text-slate-500" />
							<Translate
								text={
									categoryFilter === "Govt Docs"
										? localizationConstants.categoryGovtDocs
										: categoryFilter === "Financial"
											? localizationConstants.categoryFinancial
											: categoryFilter === "Tax"
												? localizationConstants.categoryTax
												: categoryFilter === "Legal"
													? localizationConstants.categoryLegal
													: localizationConstants.fieldAuthorityCategory
								}
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44">
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("all")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.filterAll} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Govt Docs")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.categoryGovtDocs} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Financial")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.categoryFinancial} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Tax")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.categoryTax} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onCategoryFilterChange("Legal")}
							className="cursor-pointer text-xs"
						>
							<Translate text={localizationConstants.categoryLegal} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div>
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer transition-colors"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.btnCreateNew} />
				</Button>
			</div>
		</div>
	);
}

export default AuthoritiesToolbar;
