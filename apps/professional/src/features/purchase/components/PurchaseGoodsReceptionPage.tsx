"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { ModulePageHeader } from "@/components/layout/navigation";
import { Search } from "@/components/search/Search";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "../data/purchaseNav.config";
import {
	usePurchaseGoodsReception,
	type PurchaseGoodsReceptionSortField,
	type PurchaseGoodsReceptionTypeFilter,
} from "../hooks/usePurchaseGoodsReception";
import type { PurchaseGoodsReceptionRow } from "../types/purchase.types";
import { PurchaseGoodsReceptionOrderTypeLabel } from "./PurchaseBadges";
import { PurchaseGoodsReceptionActions } from "./PurchaseGoodsReceptionActions";
import { PurchaseGoodsDetailDrawer } from "./PurchaseGoodsDetailDrawer";

const TH_CLASS =
	"py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900";

/**
 * The frame prints "Benämning" twice — header and data both duplicated — so the
 * column is rendered once here. See the mock for the other frame correction.
 */
const COLUMNS: {
	field: PurchaseGoodsReceptionSortField;
	label: TranslationKeys;
}[] = [
	{ field: "object", label: localizationConstants.purchaseColObject },
	{ field: "purchaseNo", label: localizationConstants.purchaseColNumber },
	{ field: "name", label: localizationConstants.purchaseColName },
	{ field: "supplier", label: localizationConstants.purchaseSupplierColName },
	{
		field: "expectedDelivery",
		label: localizationConstants.purchaseGoodsReceptionColExpectedDelivery,
	},
	{
		field: "orderType",
		label: localizationConstants.purchaseGoodsReceptionColOrderType,
	},
];

export function PurchaseGoodsReceptionPage() {
	const { t } = useTranslation();
	const {
		paginatedReceptions,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
		sortBy,
		sortOrder,
		handleSort,
		archiveReception,
		removeReception,
	} = usePurchaseGoodsReception();

	const [detailReception, setDetailReception] =
		useState<PurchaseGoodsReceptionRow | null>(null);

	const renderSortIcon = (field: PurchaseGoodsReceptionSortField) => {
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

	const handleArchive = (reception: PurchaseGoodsReceptionRow) => {
		archiveReception(reception.id);
		showToast(
			"success",
			`${reception.purchaseNo} — ${t(localizationConstants.purchaseGoodsReceptionArchivedToast)}`,
		);
	};

	const handleDelete = (reception: PurchaseGoodsReceptionRow) => {
		removeReception(reception.id);
		showToast(
			"info",
			`${reception.purchaseNo} — ${t(localizationConstants.purchaseGoodsReceptionDeletedToast)}`,
		);
	};

	const createHref = `${PURCHASE_MODULE_BASE_URL}/goods-reception/create`;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabGoodsReception,
				)}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-8">
				<Card className="gap-0 rounded-lg border border-slate-200 bg-white p-5 shadow-none">
					<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<Search
							value={searchQuery}
							onChange={(value) => {
								setSearchQuery(value);
								setCurrentPage(1);
							}}
							placeholder={localizationConstants.search}
							className="h-10 w-full"
							wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
						/>

						<Select
							value={typeFilter}
							onValueChange={(value) => {
								setTypeFilter(
									value as PurchaseGoodsReceptionTypeFilter,
								);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[170px]">
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
											localizationConstants.purchaseGoodsReceptionFilterAllTypes
										}
									/>
								</SelectItem>
								<SelectItem value="normal">
									<Translate
										text={
											localizationConstants.purchaseGoodsReceptionOrderTypeNormal
										}
									/>
								</SelectItem>
								<SelectItem value="partial">
									<Translate
										text={
											localizationConstants.purchaseGoodsReceptionOrderTypePartial
										}
									/>
								</SelectItem>
								<SelectItem value="backorder">
									<Translate
										text={
											localizationConstants.purchaseGoodsReceptionOrderTypeBackorder
										}
									/>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="relative mt-5 w-full bg-white">
						<Table className="w-full min-w-250 table-auto border-collapse">
							<TableHeader>
								<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
									{COLUMNS.map((column) => (
										<TableHead
											key={column.field}
											className={TH_CLASS}
											aria-sort={
												sortBy === column.field
													? sortOrder === "asc"
														? "ascending"
														: "descending"
													: "none"
											}
											tabIndex={0}
											onClick={() =>
												handleSort(column.field)
											}
											onKeyDown={(event) => {
												if (
													event.key === "Enter" ||
													event.key === " "
												) {
													event.preventDefault();
													handleSort(column.field);
												}
											}}
										>
											<div className="flex items-center gap-1">
												<Translate
													text={column.label}
												/>
												{renderSortIcon(column.field)}
											</div>
										</TableHead>
									))}
									<TableHead className="px-4 py-3.5 text-right font-medium whitespace-nowrap text-slate-600" />
									<TableHead className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-white px-2 py-3.5 text-center text-xs font-semibold text-slate-600 shadow-[inset_1px_0_0_0_#e2e8f0]">
										<span className="sr-only">
											<Translate
												text={
													localizationConstants.actionsHeader
												}
											/>
										</span>
										{/* The frame draws a bare "+" here; it opens
										    the create screen. */}
										<PermissionGate permission="CREATE_PURCHASE">
											<Button
												asChild
												variant="ghost"
												size="icon"
												className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
											>
												<Link
													href={createHref}
													title={t(
														localizationConstants.purchaseGoodsReceptionCreate,
													)}
													aria-label={t(
														localizationConstants.purchaseGoodsReceptionCreate,
													)}
												>
													<Plus
														className="h-4 w-4"
														aria-hidden
													/>
												</Link>
											</Button>
										</PermissionGate>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paginatedReceptions.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={COLUMNS.length + 2}
											className="py-12 text-center text-sm text-slate-500"
										>
											<Translate
												text={
													localizationConstants.purchaseGoodsReceptionNoneFound
												}
											/>
										</TableCell>
									</TableRow>
								) : (
									paginatedReceptions.map((reception) => (
										<TableRow
											key={reception.id}
											className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
										>
											<TableCell className="px-4 py-3.5 whitespace-nowrap">
												<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
													{reception.object}
												</span>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-slate-900">
												{/* The description opens the goods
												    detail from the item, not a route. */}
												<button
													type="button"
													onClick={() =>
														setDetailReception(reception)
													}
													className="cursor-pointer text-slate-900 hover:underline"
												>
													{reception.purchaseNo}
												</button>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{reception.name}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{reception.supplier}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{reception.expectedDelivery}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												<PurchaseGoodsReceptionOrderTypeLabel
													orderType={
														reception.orderType
													}
												/>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() =>
														setDetailReception(reception)
													}
													className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
												>
													<Translate
														text={
															localizationConstants.purchaseSupplierSeeDetails
														}
													/>
												</Button>
											</TableCell>
											<TableCell className="sticky right-0 z-10 w-[50px] min-w-[50px] bg-white px-2 py-3.5 text-center shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50">
												<PurchaseGoodsReceptionActions
													reception={reception}
													onArchive={handleArchive}
													onDelete={handleDelete}
												/>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</Card>

				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setCurrentPage(1);
					}}
				/>
			</div>

			<PurchaseGoodsDetailDrawer
				reception={detailReception}
				open={detailReception !== null}
				onOpenChange={(next) => {
					if (!next) setDetailReception(null);
				}}
			/>
		</div>
	);
}

export default PurchaseGoodsReceptionPage;
