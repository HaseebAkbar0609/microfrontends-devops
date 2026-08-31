"use client";

import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Search as SearchIcon,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	VehicleStatItem,
	VehicleSortField,
	SortOrder,
} from "../types/statistics.types";

interface VehicleStatisticsTableProps {
	data: VehicleStatItem[];
	searchQuery: string;
	onSearchChange: (val: string) => void;
	sortField: VehicleSortField;
	sortOrder: SortOrder;
	onSort: (field: VehicleSortField) => void;
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function VehicleStatisticsTable({
	data,
	searchQuery,
	onSearchChange,
	sortField,
	sortOrder,
	onSort,
	currentPage,
	totalPages,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: VehicleStatisticsTableProps) {
	const { t } = useTranslation();

	const renderSortIcon = (field: VehicleSortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-400 opacity-60" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900" />
		);
	};

	const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	const paginationText = t(
		localizationConstants.machineStatVehiclePaginationShowing
	)
		.replace("{start}", String(startItem))
		.replace("{end}", String(endItem))
		.replace("{total}", String(totalItems));

	const pageOfText = t(localizationConstants.machineStatPageOf)
		.replace("{current}", String(currentPage))
		.replace("{total}", String(totalPages));



	return (
		<div className="flex flex-col gap-4">
			{/* Top Bar: Section Title & Search/Filter toolbar placed on left under title */}
			<div className="flex flex-col gap-3">
				<h3 className="text-base font-bold text-slate-900">
					<Translate text={localizationConstants.machineStatTableInfoTitle} />
				</h3>
				<div className="flex items-center gap-4">
					<div className="relative flex w-56 items-center border-b border-slate-200 pb-1">
						<SearchIcon className="h-4 w-4 text-slate-400 shrink-0" />
						<input
							type="text"
							placeholder={t(
								localizationConstants.machineStatVehicleSearchPlaceholder
							)}
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-2 text-xs bg-transparent border-0 outline-none placeholder:text-slate-400 text-slate-900 focus:outline-none"
						/>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-2 border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md"
					>
						<span><Translate text={localizationConstants.machineStatFilterButton} /></span>
						<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
					</Button>
				</div>
			</div>

			{/* Responsive Data Table */}
			<div className="overflow-x-auto">
				<Table>
					<TableHeader className="border-b border-slate-200 bg-white">
						<TableRow className="border-b border-slate-200 hover:bg-transparent">
							{/* Fordon-ID */}
							<TableHead
								onClick={() => onSort("id")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleId} />
									{renderSortIcon("id")}
								</div>
							</TableHead>

							{/* Benämning */}
							<TableHead
								onClick={() => onSort("name")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleName} />
									{renderSortIcon("name")}
								</div>
							</TableHead>

							{/* Märke & modell */}
							<TableHead
								onClick={() => onSort("model")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleModel} />
									{renderSortIcon("model")}
								</div>
							</TableHead>

							{/* Tilldelad förare */}
							<TableHead
								onClick={() => onSort("driver")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleDriver} />
									{renderSortIcon("driver")}
								</div>
							</TableHead>

							{/* Miltal */}
							<TableHead
								onClick={() => onSort("mileage")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleMileage} />
									{renderSortIcon("mileage")}
								</div>
							</TableHead>

							{/* Drift per vecka */}
							<TableHead
								onClick={() => onSort("weeklyUsage")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColVehicleWeeklyDrift} />
									{renderSortIcon("weeklyUsage")}
								</div>
							</TableHead>

							{/* Ålder */}
							<TableHead
								onClick={() => onSort("age")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColAge} />
									{renderSortIcon("age")}
								</div>
							</TableHead>

							{/* Nästa besiktning */}
							<TableHead
								onClick={() => onSort("nextInspection")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate
										text={localizationConstants.machineStatColVehicleNextInspection}
									/>
									{renderSortIcon("nextInspection")}
								</div>
							</TableHead>

							{/* Användningsgrad */}
							<TableHead
								onClick={() => onSort("utilizationGrade")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate
										text={localizationConstants.machineStatColVehicleUtilization}
									/>
									{renderSortIcon("utilizationGrade")}
								</div>
							</TableHead>

							{/* Status */}
							<TableHead
								onClick={() => onSort("status")}
								className="cursor-pointer select-none text-xs font-medium text-slate-500 py-3"
							>
								<div className="flex items-center">
									<Translate text={localizationConstants.machineStatColStatus} />
									{renderSortIcon("status")}
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={10}
									className="h-32 text-center text-sm text-slate-400"
								>
									<Translate
										text={localizationConstants.machineStatVehicleEmptyState}
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((row, index) => (
								<TableRow
									key={`${row.id}-${index}`}
									className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
								>
									<TableCell className="text-xs text-slate-600 py-3.5">
										{row.id}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.name}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.model}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.driver}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.mileage.toLocaleString("sv-SE")} km
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.weeklyUsage.toLocaleString("sv-SE")} km
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.age}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.nextInspection}
									</TableCell>
									<TableCell className="text-xs font-bold text-slate-900 py-3.5">
										{row.utilizationGrade}
									</TableCell>
									<TableCell className="py-3.5">
										<span
											className={`inline-flex items-center justify-center rounded px-2.5 py-0.5 text-xs font-bold shadow-xs ${
												row.status === "Aktiv"
													? "bg-[#00B050] text-white"
													: row.status === "Reparation"
														? "bg-[#FF9500] text-white"
														: row.status === "Avslutad"
															? "bg-[#FF3B30] text-white"
															: "bg-slate-100 text-slate-700"
											}`}
										>
											{row.status === "Aktiv" ? (
												<Translate text={localizationConstants.machineStatusActive} />
											) : row.status === "Reparation" ? (
												<Translate text={localizationConstants.machineStatusRepair} />
											) : row.status === "Avslutad" ? (
												<Translate text={localizationConstants.machineStatusEnded} />
											) : (
												row.status
											)}
										</span>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
				<div className="flex items-center gap-3 text-xs text-slate-500">
					<span>{paginationText}</span>
					<div className="flex items-center gap-1.5 ml-4">
						<span>
							<Translate text={localizationConstants.machineStatRowsPerPage} />
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(val) => onPageSizeChange(Number(val))}
						>
							<SelectTrigger className="h-7 w-16 border-slate-200 text-xs bg-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5</SelectItem>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs text-slate-500 mr-2">{pageOfText}</span>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 border-slate-200"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(1)}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 border-slate-200"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 border-slate-200"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 border-slate-200"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(totalPages)}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
