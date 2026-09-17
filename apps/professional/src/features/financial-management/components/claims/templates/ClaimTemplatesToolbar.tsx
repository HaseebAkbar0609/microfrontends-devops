"use client";

import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ClaimTemplatesToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onCreateClick: () => void;
}

export function ClaimTemplatesToolbar({
	searchQuery,
	onSearchChange,
	onCreateClick,
}: ClaimTemplatesToolbarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			{/* Left controls: Search & Filter */}
			<div className="flex items-center gap-3 flex-1">
				{/* Search box */}
				<div className="relative flex-1 max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder=""
						className="pl-9 h-9 text-sm bg-white border-slate-200 rounded-md shadow-2xs focus-visible:ring-1"
					/>
					{!searchQuery && (
						<span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">
							<Translate text={localizationConstants.claimTplSearchPlaceholder} />
						</span>
					)}
				</div>

				{/* Filter dropdown button */}
				<button
					type="button"
					className="flex items-center gap-2 h-9 px-3.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
				>
					<Translate text={localizationConstants.claimTplFilterBtn} />
					<ChevronDown className="w-4 h-4 text-slate-400" />
				</button>
			</div>

			{/* Right control: + skapa mall button */}
			<Button
				type="button"
				onClick={onCreateClick}
				className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
			>
				<Plus className="w-4 h-4 stroke-[2.5]" />
				<Translate text={localizationConstants.claimTplBtnSkapaMall} />
			</Button>
		</div>
	);
}

export default ClaimTemplatesToolbar;
