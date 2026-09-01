"use client";

import React from "react";
import Link from "next/link";
import { Plus, Send, ChevronDown, Filter } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	selectedCount: number;
	onSendSelected: () => void;
}

export function InvoiceToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	selectedCount,
	onSendSelected,
}: InvoiceToolbarProps) {

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
			{/* Left: Search and Filter dropdown */}
			<div className="flex flex-wrap items-center gap-3">
				<Search
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={localizationConstants.search}
					className="h-10 w-full"
					wrapperClassName="w-full sm:w-[260px] md:w-[300px]"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-10 px-3.5 gap-2 border-slate-200 bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
						>
							<Filter className="h-3.5 w-3.5 text-slate-500" />
							<span>
								<Translate text={localizationConstants.filter} />
							</span>
							<ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md">
						<DropdownMenuLabel className="text-xs font-semibold text-slate-500">
							<Translate text={localizationConstants.filter} />
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("all")}
							className={`text-xs cursor-pointer ${statusFilter === "all" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceFilterAll} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("paid")}
							className={`text-xs cursor-pointer ${statusFilter === "paid" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceStatusPaid} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("sent")}
							className={`text-xs cursor-pointer ${statusFilter === "sent" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceStatusSent} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("saved")}
							className={`text-xs cursor-pointer ${statusFilter === "saved" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceStatusSaved} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("reminder1")}
							className={`text-xs cursor-pointer ${statusFilter === "reminder1" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceStatusReminder1} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onStatusFilterChange("overdue")}
							className={`text-xs cursor-pointer ${statusFilter === "overdue" ? "font-semibold bg-slate-50 text-slate-900" : "text-slate-700"}`}
						>
							<Translate text={localizationConstants.invoiceStatusOverdue} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Right: Actions */}
			<div className="flex items-center gap-3">
				{selectedCount > 0 && (
					<Button
						onClick={onSendSelected}
						className="h-10 gap-2 rounded-lg bg-[#16a34a] hover:bg-[#15803d] px-4 text-xs font-medium text-white shadow-2xs cursor-pointer transition-colors"
					>
						<Send className="h-3.5 w-3.5" />
						<span>
							<Translate text={localizationConstants.invoiceSendButton} /> ({selectedCount})
						</span>
					</Button>
				)}

				<Link href="/module/financial-management/invoice/create">
					<Button className="h-10 gap-2 rounded-lg bg-[#111721] hover:bg-slate-800 px-4 text-xs font-medium text-white shadow-2xs cursor-pointer transition-colors">
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.invoiceNewButton} />
					</Button>
				</Link>
			</div>
		</div>
	);
}
