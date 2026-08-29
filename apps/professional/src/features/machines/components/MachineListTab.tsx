"use client";

import Link from "next/link";
import {
	Plus,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	Archive,
	Trash2,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { PermissionGate } from "@/components/common/PermissionGate";
import {
	MachineCategoryBadge,
	MachineStatusBadge,
	MachineUnitLabel,
} from "./MachineBadges";
import { useMachines, type MachineSortField } from "../hooks/useMachines";

/** Column order and sort field, matching the Figma table left-to-right. */
const COLUMNS: { field: MachineSortField; labelKey: TranslationKeys }[] = [
	{ field: "machineNo", labelKey: localizationConstants.machineColumnId },
	{ field: "name", labelKey: localizationConstants.machine },
	{ field: "factory", labelKey: localizationConstants.machineColumnFactory },
	{
		field: "designation",
		labelKey: localizationConstants.machineColumnDesignation,
	},
	{ field: "category", labelKey: localizationConstants.machineColumnCategory },
	{
		field: "internalRent",
		labelKey: localizationConstants.machineColumnInternalRent,
	},
	{ field: "unit", labelKey: localizationConstants.machineColumnUnit },
	{
		field: "purchaseDate",
		labelKey: localizationConstants.machineColumnPurchase,
	},
	{ field: "location", labelKey: localizationConstants.machineColumnLocation },
	{ field: "status", labelKey: localizationConstants.statusLabel },
];

export function MachineListTab() {
	const { t } = useTranslation();
	const {
		paginatedMachines,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		deleteMachine,
		archiveMachine,
	} = useMachines();

	const renderSortIcon = (field: MachineSortField) => {
		if (sortBy !== field) {
			// Neutral state, including the initial unsorted register order.
			return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Search + filter on the left, primary action on the right */}
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
					<Search
						value={searchQuery}
						onChange={(val) => {
							setSearchQuery(val);
							setCurrentPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<Select
						value={statusFilter}
						onValueChange={(val) => {
							setStatusFilter(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-full sm:w-[150px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.filter)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate text={localizationConstants.filterAllStatuses} />
							</SelectItem>
							<SelectItem value="active">
								<Translate text={localizationConstants.machineStatusActive} />
							</SelectItem>
							<SelectItem value="repair">
								<Translate text={localizationConstants.machineStatusRepair} />
							</SelectItem>
							<SelectItem value="ended">
								<Translate text={localizationConstants.machineStatusEnded} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<PermissionGate permission="CREATE_MACHINE">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
						<Link href="/module/production/machine/overview/create">
							<Button className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer">
								<Plus className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.machineNewButton} />
							</Button>
						</Link>
					</div>
				</PermissionGate>
			</div>

			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full min-w-250 table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{COLUMNS.map((column) => (
								<TableHead
									key={column.field}
									className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
									onClick={() => handleSort(column.field)}
								>
									<div className="flex items-center gap-1">
										<Translate text={column.labelKey} />
										{renderSortIcon(column.field)}
									</div>
								</TableHead>
							))}
							{/* Quick-view column: icon only, no header label in the design */}
							<TableHead className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-600" />
							{/* Sticky actions column; the design shows a column-chooser affordance here */}
							<TableHead className="w-[60px] min-w-[60px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2 text-xs font-semibold text-slate-600">
								<Plus
									className="mx-auto h-4 w-4 text-slate-500"
									aria-hidden
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedMachines.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={COLUMNS.length + 2}
									className="py-12 text-center text-sm text-slate-500"
								>
									<Translate text={localizationConstants.machineNoResults} />
								</TableCell>
							</TableRow>
						) : (
							paginatedMachines.map((machine) => (
								<TableRow
									key={machine.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-700 whitespace-nowrap">
										{machine.machineNo}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm font-semibold text-slate-900 whitespace-nowrap">
										{machine.name}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{machine.factory}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{machine.designation}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<MachineCategoryBadge category={machine.category} />
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm font-medium text-slate-900 whitespace-nowrap">
										{machine.internalRent}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										<MachineUnitLabel unit={machine.unit} />
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{machine.purchaseDate}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{machine.location}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<MachineStatusBadge status={machine.status} />
									</TableCell>
									<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
										<Button
											variant="ghost"
											size="icon"
											aria-label={t(localizationConstants.machineActionOpen)}
											className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
										>
											<Eye className="h-4 w-4" />
										</Button>
									</TableCell>
									<TableCell className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3.5 px-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													aria-label={t(localizationConstants.actionsHeader)}
													className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1"
											>
												<PermissionGate permission="VIEW_MACHINES">
													<DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-slate-700 focus:bg-slate-50">
														<Eye className="h-4 w-4 text-slate-500" />
														<span>
															<Translate
																text={localizationConstants.machineActionOpen}
															/>
														</span>
													</DropdownMenuItem>
												</PermissionGate>
												<PermissionGate permission="EDIT_MACHINE">
													<DropdownMenuItem
														onClick={() => archiveMachine(machine.id)}
														className="flex items-center gap-2 cursor-pointer text-slate-700 focus:bg-slate-50"
													>
														<Archive className="h-4 w-4 text-slate-500" />
														<span>
															<Translate text={localizationConstants.archive} />
														</span>
													</DropdownMenuItem>
												</PermissionGate>
												<PermissionGate permission="DELETE_MACHINE">
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => deleteMachine(machine.id)}
														className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span>
															<Translate
																text={localizationConstants.actionDelete}
															/>
														</span>
													</DropdownMenuItem>
												</PermissionGate>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Footer */}
			<div className="flex items-center justify-center sm:justify-end gap-6 py-2 px-1 text-sm text-slate-600 flex-wrap">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.rowsPerPage} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => {
							setPageSize(Number(val));
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{[5, 10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
					<span>
						<Translate text={localizationConstants.pageLabel} />
					</span>
					<span>{currentPage}</span>
					<span>
						<Translate text={localizationConstants.ofLabel} />
					</span>
					<span>{totalPages}</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => setCurrentPage(1)}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() =>
							setCurrentPage((prev) => Math.min(totalPages, prev + 1))
						}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() => setCurrentPage(totalPages)}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
