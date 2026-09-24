"use client";

import React from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
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
import type { ClaimStatus } from "../../types/claims.types";

interface ClaimsToolbarProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	statusFilter: ClaimStatus | "all";
	onStatusFilterChange: (val: ClaimStatus | "all") => void;
	onCreateClick: () => void;
}

export function ClaimsToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onCreateClick,
}: ClaimsToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
			<div className="flex items-center gap-2 flex-1 max-w-lg">
				<div className="relative w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t(localizationConstants.claimsSearchPlaceholder)}
						className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
						>
							<Translate text={localizationConstants.claimsFilter} />
							<ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-44">
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className={`cursor-pointer text-xs ${statusFilter === "all" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterAll} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("sent")}
							className={`cursor-pointer text-xs ${statusFilter === "sent" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterSent} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("draft")}
							className={`cursor-pointer text-xs ${statusFilter === "draft" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterDraft} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("approved")}
							className={`cursor-pointer text-xs ${statusFilter === "approved" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterApproved} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("paid")}
							className={`cursor-pointer text-xs ${statusFilter === "paid" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterPaid} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("rejected")}
							className={`cursor-pointer text-xs ${statusFilter === "rejected" ? "font-semibold bg-slate-50" : ""}`}
						>
							<Translate text={localizationConstants.claimsFilterRejected} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div>
				<Button
					type="button"
					onClick={onCreateClick}
					className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-2xs gap-1.5 cursor-pointer transition-colors"
				>
					<Plus className="w-4 h-4" />
					<Translate text={localizationConstants.claimsCreateNew} />
				</Button>
			</div>
		</div>
	);
}

export default ClaimsToolbar;
