"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Eye, Trash2 } from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderTimeplan, TimeplanColumnKey } from "../types/timeplan.types";

export interface TimeplanListTableProps {
	plans: OrderTimeplan[];
	isLoading?: boolean;
	sortField: TimeplanColumnKey | null;
	sortOrder: "asc" | "desc";
	onSort: (field: TimeplanColumnKey) => void;
	onView: (plan: OrderTimeplan) => void;
	onDelete: (plan: OrderTimeplan) => void;
}

export function TimeplanListTable({
	plans,
	isLoading = false,
	sortField,
	sortOrder,
	onSort,
	onView,
	onDelete,
}: TimeplanListTableProps) {
	const renderSortIcon = (field: TimeplanColumnKey) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 ml-1 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		);
	};

	if (isLoading) {
		return (
			<div className="w-full overflow-x-auto bg-white">
				<Table className="w-full font-sans">
					<TableHeader className="bg-white border-b border-slate-200">
						<TableRow className="h-12 hover:bg-white">
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500">
								<Translate text={localizationConstants.orderTimeplanColDatum} />
							</TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500">
								<Translate text={localizationConstants.orderTimeplanColTidsplan} />
							</TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500">
								<Translate text={localizationConstants.orderTimeplanColCreatedBy} />
							</TableHead>
							<TableHead className="w-36" />
							<TableHead className="w-12 border-l border-slate-200 px-2 text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 3 }).map((_, i) => (
							<TableRow key={i} className="border-b border-slate-100">
								<TableCell className="p-4"><Skeleton className="h-5 w-24 rounded" /></TableCell>
								<TableCell className="p-4"><Skeleton className="h-5 w-32 rounded" /></TableCell>
								<TableCell className="p-4"><Skeleton className="h-5 w-28 rounded" /></TableCell>
								<TableCell className="p-4"><Skeleton className="h-8 w-28 rounded" /></TableCell>
								<TableCell className="p-4 border-l border-slate-100"><Skeleton className="h-6 w-6 rounded" /></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-auto bg-white">
			<Table className="w-full font-sans border-collapse">
				<TableHeader className="bg-white">
					<TableRow className="h-12 border-b border-slate-200 bg-white hover:bg-white">
						{/* 1. Datum */}
						<TableHead
							onClick={() => onSort("date")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span>
									<Translate text={localizationConstants.orderTimeplanColDatum} />
								</span>
								{renderSortIcon("date")}
							</div>
						</TableHead>

						{/* 2. Tidsplan */}
						<TableHead
							onClick={() => onSort("kind")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span>
									<Translate text={localizationConstants.orderTimeplanColTidsplan} />
								</span>
								{renderSortIcon("kind")}
							</div>
						</TableHead>

						{/* 3. Skapad av */}
						<TableHead
							onClick={() => onSort("createdBy")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span>
									<Translate text={localizationConstants.orderTimeplanColCreatedBy} />
								</span>
								{renderSortIcon("createdBy")}
							</div>
						</TableHead>

						{/* Empty header for View button column */}
						<TableHead className="w-40" />

						{/* Empty header for Action menu column without + icon */}
						<TableHead className="w-12 border-l border-slate-200 px-2 text-center align-middle" />
					</TableRow>
				</TableHeader>

				<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
					{plans.length === 0 ? (
						<TableRow className="border-b border-slate-200">
							<TableCell colSpan={5} className="h-28 text-center font-sans text-sm text-slate-400">
								<Translate text={localizationConstants.orderTimeplanEmpty} />
							</TableCell>
						</TableRow>
					) : (
						plans.map((plan) => (
							<TableRow
								key={plan.id}
								className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors font-sans text-sm text-slate-900"
							>
								{/* Datum */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{plan.date}
								</TableCell>

								{/* Tidsplan */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm font-semibold text-slate-900">
									{plan.kind}
								</TableCell>

								{/* Skapad av */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{plan.createdBy}
								</TableCell>

								{/* View tidsplan button */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap text-right">
									<Button
										type="button"
										variant="outline"
										onClick={() => onView(plan)}
										className="h-9 px-3 rounded-md border-slate-200 hover:bg-slate-100 font-sans text-sm font-medium text-slate-900 cursor-pointer shadow-none"
									>
										<Translate text={localizationConstants.orderTimeplanViewBtn} />
									</Button>
								</TableCell>

								{/* Actions Menu */}
								<TableCell className="border-l border-slate-200 px-2 py-3.5 whitespace-nowrap text-center">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-black hover:text-black hover:bg-slate-100 rounded cursor-pointer"
											>
												<MoreVertical className="h-4 w-4 text-black" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-40 bg-white border border-slate-200 shadow-lg rounded-lg font-sans">
											<DropdownMenuItem
												onClick={() => onView(plan)}
												className="flex items-center gap-2 text-xs font-medium text-black hover:text-black cursor-pointer"
											>
												<Eye className="h-3.5 w-3.5 text-black" />
												<Translate text={localizationConstants.orderTimeplanViewBtn} />
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(plan)}
												className="flex items-center gap-2 text-xs font-medium text-black hover:text-black hover:bg-slate-50 cursor-pointer"
											>
												<Trash2 className="h-3.5 w-3.5 text-black" />
												<Translate text={localizationConstants.orderTimeplanDeleteAction} />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default TimeplanListTable;

