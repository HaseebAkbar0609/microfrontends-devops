"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProcessCategory } from "@/features/personnel/types/personalProcess.types";

interface ProcessToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	selectedCategory: ProcessCategory;
	onCategoryChange: (cat: ProcessCategory) => void;
	onCreateNew: () => void;
}

const CATEGORIES: { id: ProcessCategory; labelKey: string }[] = [
	{ id: "onboarding", labelKey: localizationConstants.processCategoryOnboarding },
	{ id: "annual_review", labelKey: localizationConstants.processCategoryAnnualReview },
	{ id: "certification", labelKey: localizationConstants.processCategoryCertification },
	{ id: "all", labelKey: localizationConstants.processCategoryAll },
];

export function ProcessToolbar({
	searchQuery,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	onCreateNew,
}: ProcessToolbarProps) {
	const { t } = useTranslation();
	const currentCat = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
			<div className="flex items-center gap-2.5 flex-1 flex-wrap">
				{/* Search Input */}
				<div className="relative w-full sm:w-64">
					<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
					<Input
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.processSearchPlaceholder)}
						className="pl-9 h-9 text-xs bg-white border-slate-200 shadow-2xs rounded-lg"
					/>
				</div>

				{/* Filter Button */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-700 shadow-2xs cursor-pointer gap-1.5"
				>
					<Translate text={localizationConstants.processFilterLabel} />
					<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
				</Button>

				{/* Category Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9 px-3 text-xs font-medium border-slate-200 bg-white text-slate-800 shadow-2xs cursor-pointer gap-1.5"
						>
							<Translate text={currentCat.labelKey} />
							<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						{CATEGORIES.map((cat) => (
							<DropdownMenuItem
								key={cat.id}
								onClick={() => onCategoryChange(cat.id)}
								className="text-xs cursor-pointer"
							>
								<Translate text={cat.labelKey} />
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Create New Button */}
			<Button
				type="button"
				onClick={onCreateNew}
				className="h-9 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs gap-1.5 shrink-0"
			>
				<Plus className="w-4 h-4" />
				<Translate text={localizationConstants.processBtnCreate} />
			</Button>
		</div>
	);
}
