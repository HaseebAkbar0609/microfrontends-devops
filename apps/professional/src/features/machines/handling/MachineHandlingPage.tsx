"use client";

import Link from "next/link";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Archive,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Eye,
	MoreVertical,
	Plus,
	Trash2,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
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
import { PermissionGate } from "@/components/common/PermissionGate";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { machineBreadcrumbs } from "@/features/machines/data/machineNav.config";
import { MachineStatusBadge } from "@/features/machines/components/MachineBadges";
import { MACHINE_HANDLING_BASE_URL } from "./data/handlingNav.config";
import {
	useMachineLists,
	type MachineListSortField,
} from "./hooks/useMachineLists";

const COLUMNS: { field: MachineListSortField; labelKey: TranslationKeys }[] = [
	{ field: "object", labelKey: localizationConstants.machineHandlingObject },
	{ field: "label", labelKey: localizationConstants.machineGanttLabel },
	{ field: "customer", labelKey: localizationConstants.machineHandlingCustomer },
	{ field: "startDate", labelKey: localizationConstants.machineHandlingStart },
	{ field: "endDate", labelKey: localizationConstants.machineHandlingEnd },
	{ field: "status", labelKey: localizationConstants.statusLabel },
];

/**
 * Maskinhantering (TFS-806) — the register of machine lists, one per project,
 * order or service vehicle. Opening a row leads to that list's detail page.
 */
export function MachineHandlingPage() {
	const { t } = useTranslation();
	const {
		paginated,
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
		confirmDeleteId,
		setConfirmDeleteId,
		deleteList,
		archiveList,
	} = useMachineLists();

	const renderSortIcon = (field: MachineListSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		);
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<PageHeader
				title={localizationConstants.machineHandlingTitle}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineHandlingTitle,
				)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col overflow-y-auto px-6 pt-2 pb-8">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
						<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:w-auto">
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
								<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[150px]">
									<SelectValue placeholder={t(localizationConstants.filter)} />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="all">
										<Translate text={localizationConstants.filterAllStatuses} />
									</SelectItem>
									<SelectItem value="active">
										<Translate text={localizationConstants.machineStatusActive} />
									</SelectItem>
									<SelectItem value="ended">
										<Translate text={localizationConstants.machineStatusEnded} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<PermissionGate permission="CREATE_MACHINE">
							<div className="flex w-full flex-col items-stretch justify-start gap-3 sm:flex-row sm:items-center xl:w-auto xl:justify-end">
								{/* asChild so this renders a single <a>; a <button> inside an
								    anchor is invalid HTML. */}
								<Button
									asChild
									className="h-10 w-full cursor-pointer justify-center gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 sm:w-auto"
								>
									<Link href={`${MACHINE_HANDLING_BASE_URL}/create`}>
										<Plus className="h-4 w-4" aria-hidden />
										<Translate
											text={localizationConstants.machineHandlingNewList}
										/>
									</Link>
								</Button>
							</div>
						</PermissionGate>
					</div>

					<div className="relative w-full overflow-x-auto bg-white">
						<Table className="w-full min-w-200 table-auto border-collapse">
							<TableHeader>
								<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
									{COLUMNS.map((column) => (
										<TableHead
											key={column.field}
											onClick={() => handleSort(column.field)}
											className="cursor-pointer px-4 py-3.5 text-xs font-semibold whitespace-nowrap text-slate-600 transition-colors select-none hover:text-slate-900"
										>
											<div className="flex items-center gap-1">
												<Translate text={column.labelKey} />
												{renderSortIcon(column.field)}
											</div>
										</TableHead>
									))}
									<TableHead className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-white px-2 py-3.5 text-center shadow-[inset_1px_0_0_0_#e2e8f0]">
										<Plus className="mx-auto h-4 w-4 text-slate-500" aria-hidden />
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginated.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={COLUMNS.length + 1}
											className="py-12 text-center text-sm text-slate-500"
										>
											<Translate
												text={localizationConstants.machineHandlingNoResults}
											/>
										</TableCell>
									</TableRow>
								) : (
									paginated.map((row) => (
										<TableRow
											key={row.id}
											className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
										>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{row.object}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-slate-900">
												{row.label}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{row.customer}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-slate-900">
												{row.startDate}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-slate-900">
												{row.endDate}
											</TableCell>
											<TableCell className="px-4 py-3.5 whitespace-nowrap">
												<MachineStatusBadge status={row.status} />
											</TableCell>
											<TableCell className="sticky right-0 z-10 w-[50px] min-w-[50px] bg-white px-2 py-3.5 text-center shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															aria-label={t(localizationConstants.actionsHeader)}
															className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
													>
														<PermissionGate permission="VIEW_MACHINES">
															<DropdownMenuItem asChild>
																<Link
																	href={`${MACHINE_HANDLING_BASE_URL}/${encodeURIComponent(row.id)}`}
																	className="flex w-full cursor-pointer items-center gap-2 text-slate-700 hover:bg-slate-50"
																>
																	<Eye className="h-4 w-4 text-slate-500" />
																	<span>
																		<Translate
																			text={
																				localizationConstants.machineActionOpen
																			}
																		/>
																	</span>
																</Link>
															</DropdownMenuItem>
														</PermissionGate>
														<PermissionGate permission="EDIT_MACHINE">
															<DropdownMenuItem
																onClick={() => archiveList(row.id)}
																className="flex cursor-pointer items-center gap-2 text-slate-700 focus:bg-slate-50"
															>
																<Archive className="h-4 w-4 text-slate-500" />
																<span>
																	<Translate
																		text={localizationConstants.archive}
																	/>
																</span>
															</DropdownMenuItem>
														</PermissionGate>
														<PermissionGate permission="DELETE_MACHINE">
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => setConfirmDeleteId(row.id)}
																className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
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

					<AlertDialog
						open={!!confirmDeleteId}
						onOpenChange={(open) => {
							if (!open) setConfirmDeleteId(null);
						}}
					>
						<AlertDialogContent className="bg-white">
							<AlertDialogHeader>
								<AlertDialogTitle>
									<Translate text={localizationConstants.deleteConfirmationTitle} />
								</AlertDialogTitle>
								<AlertDialogDescription>
									<Translate
										text={localizationConstants.deleteConfirmationDescription}
									/>
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="cursor-pointer">
									<Translate text={localizationConstants.cancelButton} />
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										if (confirmDeleteId) deleteList(confirmDeleteId);
									}}
									className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
								>
									<Translate text={localizationConstants.actionDelete} />
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<div className="flex flex-wrap items-center justify-center gap-6 px-1 py-2 text-sm text-slate-600 sm:justify-end">
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

						<div className="flex items-center gap-1 text-sm font-medium text-slate-700 select-none">
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
								className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage(1)}
							>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
								className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage(totalPages)}
							>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MachineHandlingPage;
