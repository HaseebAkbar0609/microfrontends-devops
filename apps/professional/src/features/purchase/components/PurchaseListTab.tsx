"use client";

import Link from "next/link";
import {
	Archive,
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import { usePurchases, type PurchaseSortField } from "../hooks/usePurchases";
import type { PurchaseRow } from "../types/purchase.types";
import { ConfirmActionDialog } from "./archive/ConfirmActionDialog";
import {
	PurchaseCategoryBadge,
	PurchaseStatusBadge,
	PurchaseTypeBadge,
} from "./PurchaseBadges";

const TH_CLASS =
	"py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900";

const SORTABLE_COLUMNS: { field: PurchaseSortField; label: TranslationKeys }[] =
	[
		{ field: "purchaseNo", label: localizationConstants.purchaseColNumber },
		{ field: "name", label: localizationConstants.purchaseColName },
		{ field: "object", label: localizationConstants.purchaseColObject },
		{ field: "orderer", label: localizationConstants.purchaseColOrderer },
		{ field: "type", label: localizationConstants.purchaseColType },
		{ field: "category", label: localizationConstants.purchaseColCategory },
		{ field: "status", label: localizationConstants.statusLabel },
	];

export function PurchaseListTab() {
	const { t } = useTranslation();
	const {
		paginatedPurchases,
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
		archivePurchase,
		removePurchase,
	} = usePurchases();

	const [pendingArchive, setPendingArchive] = useState<PurchaseRow | null>(
		null,
	);

	/** Archiving moves the row to the Arkiv tab, so it confirms first. */
	const handleConfirmArchive = () => {
		if (!pendingArchive) return;
		archivePurchase(pendingArchive.id);
		showToast(
			"success",
			`${pendingArchive.purchaseNo} — ${t(localizationConstants.purchaseArchivedToast)}`,
		);
		setPendingArchive(null);
	};

	const renderSortIcon = (field: PurchaseSortField) => {
		if (sortBy !== field) {
			return (
				<ArrowUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
			);
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:w-auto">
					<Search
						value={searchQuery}
						onChange={(value) => {
							setSearchQuery(value);
							setCurrentPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<Select
						value={statusFilter}
						onValueChange={(value) => {
							setStatusFilter(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[150px]">
							<SelectValue
								placeholder={t(
									localizationConstants.purchaseFilterLabel,
								)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate
									text={
										localizationConstants.purchaseFilterAllStatuses
									}
								/>
							</SelectItem>
							<SelectItem value="not_started">
								<Translate
									text={
										localizationConstants.purchaseStatusNotStarted
									}
								/>
							</SelectItem>
							<SelectItem value="ongoing">
								<Translate
									text={
										localizationConstants.purchaseStatusOngoing
									}
								/>
							</SelectItem>
							<SelectItem value="completed">
								<Translate
									text={
										localizationConstants.purchaseStatusCompleted
									}
								/>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<PermissionGate permission="CREATE_PURCHASE">
					<div className="flex w-full justify-start xl:w-auto xl:justify-end">
						<Link href={`${PURCHASE_MODULE_BASE_URL}/create`}>
							<Button className="h-10 w-full cursor-pointer justify-center gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 sm:w-auto">
								<Plus className="h-4 w-4" aria-hidden />
								<Translate
									text={
										localizationConstants.purchaseCreateButton
									}
								/>
							</Button>
						</Link>
					</div>
				</PermissionGate>
			</div>

			<div className="relative w-full overflow-x-auto bg-white">
				<Table className="w-full min-w-250 table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{SORTABLE_COLUMNS.map((column) => (
								<TableHead
									key={column.field}
									className={TH_CLASS}
									onClick={() => handleSort(column.field)}
								>
									<div className="flex items-center gap-1">
										<Translate text={column.label} />
										{renderSortIcon(column.field)}
									</div>
								</TableHead>
							))}
							<TableHead className="px-4 py-3.5 text-right font-medium whitespace-nowrap text-slate-600" />
							<TableHead className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-white px-2 py-3.5 text-center text-xs font-semibold text-slate-600 shadow-[inset_1px_0_0_0_#e2e8f0]">
								<Translate
									text={localizationConstants.actionsHeader}
								/>
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedPurchases.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={SORTABLE_COLUMNS.length + 2}
									className="py-12 text-center text-sm text-slate-500"
								>
									<Translate
										text={
											localizationConstants.purchaseNoneFound
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							paginatedPurchases.map((purchase) => (
								<TableRow
									key={purchase.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm font-normal whitespace-nowrap text-slate-700">
										{purchase.purchaseNo}
									</TableCell>
									<TableCell className="max-w-[200px] truncate px-4 py-3.5 text-sm font-semibold text-slate-900">
										{purchase.name}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
											{purchase.object}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{purchase.orderer}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<PurchaseTypeBadge
											type={purchase.type}
										/>
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<PurchaseCategoryBadge
											category={purchase.category}
										/>
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										<PurchaseStatusBadge
											status={purchase.status}
										/>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
										<Link
											href={`${PURCHASE_MODULE_BASE_URL}/${encodeURIComponent(purchase.id)}`}
										>
											<Button
												variant="outline"
												size="sm"
												className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
											>
												<Translate
													text={
														localizationConstants.purchaseSeeButton
													}
												/>
											</Button>
										</Link>
									</TableCell>
									<TableCell className="sticky right-0 z-10 w-[50px] min-w-[50px] bg-white px-2 py-3.5 text-center transition-colors shadow-[inset_1px_0_0_0_#e2e8f0] group-hover:bg-slate-50">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
													aria-label={t(
														localizationConstants.actionsHeader,
													)}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
											>
												<PermissionGate permission="EDIT_PURCHASE">
													<DropdownMenuItem
														onClick={() =>
															setPendingArchive(purchase)
														}
														className="flex w-full cursor-pointer items-center gap-2 text-slate-700 hover:bg-slate-50"
													>
														<Archive className="h-4 w-4 text-slate-500" />
														<span>
															<Translate
																text={
																	localizationConstants.archive
																}
															/>
														</span>
													</DropdownMenuItem>
												</PermissionGate>
												<PermissionGate permission="DELETE_PURCHASE">
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() =>
															removePurchase(
																purchase.id,
															)
														}
														className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span>
															<Translate
																text={
																	localizationConstants.actionDelete
																}
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

			<div className="flex flex-wrap items-center justify-center gap-6 px-1 py-2 text-sm text-slate-600 sm:justify-end">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.rowsPerPage} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(value) => {
							setPageSize(Number(value));
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
						onClick={() =>
							setCurrentPage((previous) =>
								Math.max(1, previous - 1),
							)
						}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
						disabled={currentPage >= totalPages}
						onClick={() =>
							setCurrentPage((previous) =>
								Math.min(totalPages, previous + 1),
							)
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

			{/* Confirms before archiving; `archive` is the noun "Arkiv", so the
			    action button uses the generic confirm verb. */}
			<ConfirmActionDialog
				open={pendingArchive !== null}
				onOpenChange={(next) => {
					if (!next) setPendingArchive(null);
				}}
				title={localizationConstants.purchaseArchiveConfirmTitle}
				description={localizationConstants.purchaseArchiveConfirmBody}
				confirmLabel={localizationConstants.confirmButton}
				subject={pendingArchive?.purchaseNo}
				onConfirm={handleConfirmArchive}
			/>
		</div>
	);
}

export default PurchaseListTab;
