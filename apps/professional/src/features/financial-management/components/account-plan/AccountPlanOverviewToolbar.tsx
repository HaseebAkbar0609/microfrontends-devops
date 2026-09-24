"use client";

import React from "react";
import { Plus, Check, ChevronDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	ACCOUNT_PLAN_CREATE_ROUTE,
	ACCOUNT_PLAN_IMPORT_ROUTE,
} from "@/features/financial-management/constants/accountPlan.constants";

interface AccountPlanOverviewToolbarProps {
	readonly searchQuery: string;
	readonly statusParam: string;
	readonly onSearchChange: (val: string) => void;
	readonly onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
}

export function AccountPlanOverviewToolbar({
	searchQuery,
	statusParam,
	onSearchChange,
	onStatusFilterChange,
}: AccountPlanOverviewToolbarProps) {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-6">
			{/* Sub Navigation Tab */}
			<div className="border-b border-slate-200">
				<div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-3 px-1 text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.accountPlanTab} />
				</div>
			</div>

			{/* Page Title */}
			<h1 className="text-xl font-bold text-slate-900 tracking-tight">
				<Translate text={localizationConstants.accountPlanTitle} />
			</h1>

			{/* Search, Filter & Actions Bar */}
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-24 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-2xs justify-between cursor-pointer"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-3.5 w-3.5 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.allStatus} />
								{statusParam === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("active")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.activeStatus} />
								{statusParam === "active" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onStatusFilterChange("inactive")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.inactiveStatus} />
								{statusParam === "inactive" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-end">
					<Button
						variant="outline"
						onClick={() => router.push(ACCOUNT_PLAN_IMPORT_ROUTE)}
						className="h-10 w-full sm:w-auto gap-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-2xs justify-center cursor-pointer"
					>
						<Download className="h-4 w-4 text-slate-700" aria-hidden />
						<Translate text={localizationConstants.importAccountPlan} />
					</Button>

					<Button
						onClick={() => router.push(ACCOUNT_PLAN_CREATE_ROUTE)}
						className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.registerNewAccount} />
					</Button>
				</div>
			</div>
		</div>
	);
}
