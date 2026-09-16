"use client";

import { ChevronDown, Plus, Printer } from "lucide-react";

import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WARRANTY_CONSTANTS } from "../../constants/warranty.constants";

/** The value the filter carries when nothing is selected. */
export const WARRANTY_FILTER_ALL = "all";

export interface WarrantyTableToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	onOpenAdd?: () => void;
}

/** Search, the warranty-period filter, print and add, above the list. */
export function WarrantyTableToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onOpenAdd,
}: WarrantyTableToolbarProps) {
	const t = useTranslate();

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 w-full sm:w-auto min-w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer"
						>
							<span>
								{statusFilter === WARRANTY_FILTER_ALL ? (
									<Translate text={localizationConstants.filter} />
								) : (
									statusFilter
								)}
							</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-50"
					>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange(WARRANTY_FILTER_ALL)}
							className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
						>
							<Translate
								text={localizationConstants.filterAllStatuses}
							/>
						</DropdownMenuItem>
						{WARRANTY_CONSTANTS.WARRANTY_PERIOD_FILTERS.map((period) => (
							<DropdownMenuItem
								key={period}
								onClick={() => onStatusFilterChange(period)}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								{period}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={handlePrint}
					className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none shrink-0"
					title={t(localizationConstants.orgPrintButton)}
					aria-label={t(localizationConstants.orgPrintButton)}
				>
					<Printer className="h-4 w-4 text-slate-700" />
				</Button>

				{onOpenAdd && (
					<Button
						type="button"
						onClick={onOpenAdd}
						className="h-10 flex-1 sm:flex-none px-4 sm:px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-none gap-2 cursor-pointer flex items-center justify-center whitespace-nowrap"
					>
						<Plus className="h-4 w-4 shrink-0" />
						<span>
							<Translate text={localizationConstants.add} />
						</span>
					</Button>
				)}
			</div>
		</div>
	);
}

export default WarrantyTableToolbar;
