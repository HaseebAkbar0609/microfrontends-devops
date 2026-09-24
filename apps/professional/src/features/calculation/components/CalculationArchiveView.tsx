"use client";

import {
	ChevronDown,
	Check,
	Eye,
	Archive,
	Trash2,
	MoreVertical,
} from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "@/components/search/Search";
import { DynamicBreadcrumb } from "@/components/common";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useCalculationArchive } from "../hooks/useCalculationArchive";
import type { ArchiveStatus } from "../types/archive";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900";

const STATUS_PILL_CLASS: Record<ArchiveStatus, string> = {
	inProgress: "bg-emerald-600 text-white hover:bg-emerald-600 border-none",
	notStarted: "bg-amber-500 text-white hover:bg-amber-500 border-none",
	completed: "bg-slate-700 text-white hover:bg-slate-700 border-none",
};

export function CalculationArchiveView() {
	const {
		rows,
		isLoading,
		search,
		setSearch,
		filterStatus,
		setFilterStatus,
		activeFilterLabel,
		statusLabels,
		page,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		deleteTargetId,
		setDeleteTargetId,
		isDeleting,
		handleOpen,
		handleRestore,
		handleDeleteConfirm,
	} = useCalculationArchive();

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-white">
			{/* 1. Heading & Breadcrumb Header */}
			<div className="border-b border-slate-200 px-6 pt-5 pb-4">
				<h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.archive} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/home",
						},
						{
							translationKey: localizationConstants.moduleItem,
							href: "/module/business",
						},
						{
							translationKey: localizationConstants.calculation,
							href: "/module/business/calculation/dashboard",
						},
						{
							translationKey: localizationConstants.archive,
						},
					]}
				/>
			</div>

			{/* 2. Content Container */}
			<div className="flex flex-col gap-5 px-6 pt-5 pb-10">
				{/* Toolbar (Search + Status Filter) */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
					<Search
						value={search}
						onChange={setSearch}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-72"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-10 w-full sm:w-auto shrink-0 cursor-pointer justify-between gap-2 rounded-md border-slate-200 bg-white text-sm font-normal text-slate-700 hover:bg-slate-50 shadow-none"
							>
								<span>{activeFilterLabel}</span>
								<ChevronDown size={14} className="text-slate-500" aria-hidden />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 bg-white shadow-md border-slate-200">
							<DropdownMenuItem
								className="cursor-pointer text-sm flex items-center justify-between"
								onClick={() => setFilterStatus(null)}
							>
								<Translate text={localizationConstants.adminUsersFilterAll} />
								{!filterStatus && <Check size={14} className="text-slate-900" />}
							</DropdownMenuItem>
							{(Object.keys(statusLabels) as ArchiveStatus[]).map((status) => (
								<DropdownMenuItem
									key={status}
									className="cursor-pointer text-sm flex items-center justify-between"
									onClick={() => setFilterStatus(status)}
								>
									<span>{statusLabels[status]}</span>
									{filterStatus === status && <Check size={14} className="text-slate-900" />}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Data Table */}
				<div className="overflow-x-auto">
					<Table className="w-full min-w-[800px] text-sm">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("kalkylNr")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.calcNo} />
										{renderSortIcon("kalkylNr", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("projektNamn")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.projectName} />
										{renderSortIcon("projektNamn", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("koppling")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.calcOverviewConnection} />
										{renderSortIcon("koppling", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("bestellare")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.calcStatBestellare} />
										{renderSortIcon("bestellare", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("offertDatum")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.calcOverviewOffertDatum} />
										{renderSortIcon("offertDatum", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("typ")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.calcProType} />
										{renderSortIcon("typ", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead
									scope="col"
									className={TH_SORTABLE}
									onClick={() => toggleSort("status")}
								>
									<span className="flex items-center gap-1">
										<Translate text={localizationConstants.statusHeader} />
										{renderSortIcon("status", sortField, sortDir)}
									</span>
								</TableHead>

								<TableHead scope="col" className="whitespace-nowrap px-4 py-3.5 text-right w-44" />
							</TableRow>
						</TableHeader>
						<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
							{isLoading ? (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
										<Translate text={localizationConstants.genericLoading} />
									</TableCell>
								</TableRow>
							) : rows.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
										<Translate text={localizationConstants.calcArchiveEmpty} />
									</TableCell>
								</TableRow>
							) : (
								rows.map((row) => (
									<TableRow
										key={row.id}
										className="group cursor-pointer border-b border-slate-200 hover:bg-slate-50/80 transition-colors"
										onClick={() => handleOpen(row)}
									>
										{/* 1. Kalkyl nr */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-normal text-slate-950">
											{row.kalkylNr}
										</TableCell>

										{/* 2. Projekt namn */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-normal text-slate-950">
											<span className="block max-w-48 truncate">{row.projektNamn}</span>
										</TableCell>

										{/* 3. Koppling */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm">
											<span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-950">
												{row.koppling}
											</span>
										</TableCell>

										{/* 4. Beställare */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-normal text-slate-950">
											{row.bestellare}
										</TableCell>

										{/* 5. Offert datum */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-normal text-slate-950 tabular-nums">
											{row.offertDatum}
										</TableCell>

										{/* 6. Typ */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm">
											<span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-950">
												{row.typ}
											</span>
										</TableCell>

										{/* 7. Status */}
										<TableCell className="whitespace-nowrap px-4 py-3.5 text-sm">
											<Badge
												className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium shadow-none ${STATUS_PILL_CLASS[row.status] ?? STATUS_PILL_CLASS.inProgress}`}
											>
												<Translate
													text={
														row.status === "inProgress"
															? localizationConstants.calcOverviewStatusInProgress
															: row.status === "completed"
																? localizationConstants.calcOverviewStatusCompleted
																: localizationConstants.calcOverviewStatusNotStarted
													}
												/>
											</Badge>
										</TableCell>

										{/* 8. Action Buttons */}
										<TableCell
											className="whitespace-nowrap px-4 py-3.5 text-right"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex items-center justify-end gap-2">
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => handleOpen(row)}
													className="h-8 cursor-pointer border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-950 hover:bg-slate-100 shadow-none"
												>
													<Translate
														text={
															row.viewType === "project"
																? localizationConstants.calcArchiveSeProject
																: localizationConstants.calcOverviewSeKalkyl
														}
													/>
												</Button>

												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-8 w-8 cursor-pointer rounded-md text-slate-950 hover:bg-slate-100"
															aria-label="Actions"
														>
															<MoreVertical size={16} className="text-slate-950" aria-hidden />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-40 bg-white shadow-md border-slate-200">
														<DropdownMenuItem
															className="cursor-pointer gap-2 text-xs font-medium text-slate-950 focus:text-slate-950 focus:bg-slate-100"
															onClick={() => handleOpen(row)}
														>
															<Eye size={14} className="text-slate-950" aria-hidden />
															<Translate text={localizationConstants.calcArchiveOpen} />
														</DropdownMenuItem>
														<DropdownMenuItem
															className="cursor-pointer gap-2 text-xs font-medium text-slate-950 focus:text-slate-950 focus:bg-slate-100"
															onClick={() => handleRestore(row.id)}
														>
															<Archive size={14} className="text-slate-950" aria-hidden />
															<Translate text={localizationConstants.calcArchiveUnarchive} />
														</DropdownMenuItem>
														<DropdownMenuItem
															className="cursor-pointer gap-2 text-xs font-medium text-slate-950 focus:text-slate-950 focus:bg-slate-100"
															onClick={() => setDeleteTargetId(row.id)}
														>
															<Trash2 size={14} className="text-slate-950" aria-hidden />
															<Translate text={localizationConstants.calcArchiveDelete} />
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="pt-2">
					<TablePagination
						currentPage={page}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(1);
						}}
					/>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteTargetId !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTargetId(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-slate-950">
							<Translate text={localizationConstants.calcArchiveDeleteConfirmTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-600">
							<Translate text={localizationConstants.calcArchiveDeleteConfirmDescription} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer border-slate-200 text-slate-950 hover:bg-slate-50" disabled={isDeleting}>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className="bg-neutral-950 text-white hover:bg-neutral-900 cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.calcArchiveDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
