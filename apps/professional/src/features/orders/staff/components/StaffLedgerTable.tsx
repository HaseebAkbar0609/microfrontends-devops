"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { StaffLedgerItem } from "../types/staff.types";

export interface StaffLedgerTableProps {
	items: StaffLedgerItem[];
	isLoading?: boolean;
	sortField: keyof StaffLedgerItem | null;
	sortOrder: "asc" | "desc";
	onSort: (field: keyof StaffLedgerItem) => void;
}

export function StaffLedgerTable({
	items,
	isLoading = false,
	sortField,
	sortOrder,
	onSort,
}: StaffLedgerTableProps) {
	const renderSortIcon = (field: keyof StaffLedgerItem) => {
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
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColDatum} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColPersonNr} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColName} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColRole} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColOwnStaff} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColUe} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColTimeIn} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColTimeOut} /></TableHead>
							<TableHead className="px-4 py-0 font-medium text-xs text-slate-500"><Translate text={localizationConstants.staffColTool} /></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i} className="border-b border-slate-100">
								{Array.from({ length: 9 }).map((_, j) => (
									<TableCell key={j} className="p-4">
										<Skeleton className="h-5 w-full rounded" />
									</TableCell>
								))}
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
								<span><Translate text={localizationConstants.staffColDatum} /></span>
								{renderSortIcon("date")}
							</div>
						</TableHead>

						{/* 2. Person nr */}
						<TableHead
							onClick={() => onSort("personNumber")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span><Translate text={localizationConstants.staffColPersonNr} /></span>
								{renderSortIcon("personNumber")}
							</div>
						</TableHead>

						{/* 3. Namn */}
						<TableHead
							onClick={() => onSort("name")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span><Translate text={localizationConstants.staffColName} /></span>
								{renderSortIcon("name")}
							</div>
						</TableHead>

						{/* 4. Roll */}
						<TableHead
							onClick={() => onSort("role")}
							className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
						>
							<div className="flex items-center gap-1">
								<span><Translate text={localizationConstants.staffColRole} /></span>
								{renderSortIcon("role")}
							</div>
						</TableHead>

						{/* 5. Egen personal */}
						<TableHead className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 whitespace-nowrap align-middle">
							<Translate text={localizationConstants.staffColOwnStaff} />
						</TableHead>

						{/* 6. UE */}
						<TableHead className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 whitespace-nowrap align-middle">
							<Translate text={localizationConstants.staffColUe} />
						</TableHead>

						{/* 7. Inloggad */}
						<TableHead className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 whitespace-nowrap align-middle">
							<Translate text={localizationConstants.staffColTimeIn} />
						</TableHead>

						{/* 8. Utloggad */}
						<TableHead className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 whitespace-nowrap align-middle">
							<Translate text={localizationConstants.staffColTimeOut} />
						</TableHead>

						{/* 9. Verktyg */}
						<TableHead className="px-4 py-0 font-sans text-xs font-semibold text-slate-500 whitespace-nowrap align-middle">
							<Translate text={localizationConstants.staffColTool} />
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="[&_tr:last-child]:border-b-0">
					{items.length === 0 ? (
						<TableRow className="border-b border-slate-200">
							<TableCell colSpan={9} className="h-28 text-center font-sans text-sm text-slate-400">
								<Translate text={localizationConstants.staffNoDataFound} />
							</TableCell>
						</TableRow>
					) : (
						items.map((item) => (
							<TableRow
								key={item.id}
								className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors font-sans text-sm text-slate-900"
							>
								{/* Datum */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.date}
								</TableCell>

								{/* Person nr */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.personNumber}
								</TableCell>

								{/* Namn */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm font-medium text-slate-900">
									{item.name}
								</TableCell>

								{/* Roll */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.role}
								</TableCell>

								{/* Egen personal */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap">
									<Badge
										variant="outline"
										className="bg-zinc-100 text-slate-800 border-zinc-200 font-sans text-xs font-medium px-2.5 py-0.5 rounded shadow-none"
									>
										{item.isOwnStaff ? (
											<Translate text={localizationConstants.staffBadgeYes} />
										) : (
											<Translate text={localizationConstants.staffBadgeNo} />
										)}
									</Badge>
								</TableCell>

								{/* UE */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.ue}
								</TableCell>

								{/* Inloggad */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.timeIn}
								</TableCell>

								{/* Utloggad */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap font-sans text-sm text-slate-900 font-normal">
									{item.timeOut}
								</TableCell>

								{/* Verktyg */}
								<TableCell className="px-4 py-3.5 whitespace-nowrap">
									<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-slate-800 border border-zinc-200">
										{item.tool || <Translate text={localizationConstants.staffAppTimeflowWork} />}
									</span>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default StaffLedgerTable;
