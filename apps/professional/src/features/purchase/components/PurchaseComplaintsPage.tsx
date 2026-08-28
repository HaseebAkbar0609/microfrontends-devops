"use client";

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
	usePurchaseComplaints,
	type PurchaseComplaintSortField,
	type PurchaseComplaintStatusFilter,
} from "../hooks/usePurchaseComplaints";
import type { PurchaseComplaintRow } from "../types/purchase.types";
import { PurchaseComplaintActions } from "./PurchaseComplaintActions";
import {
	PurchaseComplaintStatusBadge,
	PurchaseComplaintTypeLabel,
} from "./PurchaseBadges";

const TH_CLASS =
	"py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900";

const COLUMNS: {
	field: PurchaseComplaintSortField;
	label: TranslationKeys;
}[] = [
	{
		field: "complaintNo",
		label: localizationConstants.purchaseComplaintColNumber,
	},
	{ field: "purchaseNo", label: localizationConstants.purchaseColNumber },
	{ field: "object", label: localizationConstants.purchaseColObject },
	{ field: "name", label: localizationConstants.purchaseColName },
	{ field: "supplier", label: localizationConstants.purchaseSupplierColName },
	{ field: "type", label: localizationConstants.purchaseComplaintColType },
	{ field: "date", label: localizationConstants.purchaseComplaintColDate },
	{ field: "status", label: localizationConstants.statusLabel },
];

export function PurchaseComplaintsPage() {
	const { t } = useTranslation();
	const {
		paginatedComplaints,
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
		archiveComplaint,
		removeComplaint,
	} = usePurchaseComplaints();

	const renderSortIcon = (field: PurchaseComplaintSortField) => {
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

	const handleEdit = () =>
		showToast(
			"info",
			t(localizationConstants.purchaseComplaintEditToast),
		);

	const handleArchive = (complaint: PurchaseComplaintRow) => {
		archiveComplaint(complaint.id);
		showToast(
			"success",
			`${complaint.complaintNo} — ${t(localizationConstants.purchaseComplaintArchivedToast)}`,
		);
	};

	const handleDelete = (complaint: PurchaseComplaintRow) => {
		removeComplaint(complaint.id);
		showToast(
			"info",
			`${complaint.complaintNo} — ${t(localizationConstants.purchaseComplaintDeletedToast)}`,
		);
	};

	const detailHref = (id: string) =>
		`${PURCHASE_MODULE_BASE_URL}/complaints/${encodeURIComponent(id)}`;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabComplaints,
				)}
			/>

			<div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-8">
				<Card className="gap-0 rounded-lg border border-slate-200 bg-white p-5 shadow-none">
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
								wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
							/>

							<Select
								value={statusFilter}
								onValueChange={(value) => {
									setStatusFilter(
										value as PurchaseComplaintStatusFilter,
									);
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
									<SelectItem value="not_sent">
										<Translate
											text={
												localizationConstants.purchaseComplaintStatusNotSent
											}
										/>
									</SelectItem>
									<SelectItem value="sent">
										<Translate
											text={
												localizationConstants.purchaseComplaintStatusSent
											}
										/>
									</SelectItem>
									<SelectItem value="approved">
										<Translate
											text={
												localizationConstants.purchaseComplaintStatusApproved
											}
										/>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<PermissionGate permission="CREATE_PURCHASE">
							<div className="flex w-full justify-start xl:w-auto xl:justify-end">
								<Button
									type="button"
									onClick={() =>
										showToast(
											"info",
											t(
												localizationConstants.purchaseComplaintCreateToast,
											),
										)
									}
									className="h-10 w-full cursor-pointer justify-center gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 sm:w-auto"
								>
									<Plus className="h-4 w-4" aria-hidden />
									<Translate
										text={
											localizationConstants.purchaseComplaintCreate
										}
									/>
								</Button>
							</div>
						</PermissionGate>
					</div>

					<div className="relative mt-5 w-full bg-white">
						<Table className="w-full min-w-300 table-auto border-collapse">
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
										<Translate
											text={
												localizationConstants.actionsHeader
											}
										/>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paginatedComplaints.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={COLUMNS.length + 2}
											className="py-12 text-center text-sm text-slate-500"
										>
											<Translate
												text={
													localizationConstants.purchaseComplaintNoneFound
												}
											/>
										</TableCell>
									</TableRow>
								) : (
									paginatedComplaints.map((complaint) => (
										<TableRow
											key={complaint.id}
											className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
										>
											<TableCell className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-slate-900">
												<Link
													href={detailHref(
														complaint.id,
													)}
													className="hover:underline"
												>
													{complaint.complaintNo}
												</Link>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{complaint.purchaseNo}
											</TableCell>
											<TableCell className="px-4 py-3.5 whitespace-nowrap">
												<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
													{complaint.object}
												</span>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{complaint.name}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{complaint.supplier}
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												<PurchaseComplaintTypeLabel
													type={complaint.type}
												/>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
												{complaint.date}
											</TableCell>
											<TableCell className="px-4 py-3.5 whitespace-nowrap">
												<PurchaseComplaintStatusBadge
													status={complaint.status}
												/>
											</TableCell>
											<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
												<Link
													href={detailHref(
														complaint.id,
													)}
												>
													<Button
														variant="outline"
														size="sm"
														className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
													>
														<Translate
															text={
																localizationConstants.purchaseSupplierSeeDetails
															}
														/>
													</Button>
												</Link>
											</TableCell>
											<TableCell className="sticky right-0 z-10 w-[50px] min-w-[50px] bg-white px-2 py-3.5 text-center shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50">
												<PurchaseComplaintActions
													complaint={complaint}
													onEdit={handleEdit}
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
		</div>
	);
}

export default PurchaseComplaintsPage;
