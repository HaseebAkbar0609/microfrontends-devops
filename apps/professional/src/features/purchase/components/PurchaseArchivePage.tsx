"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import type { DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MOCK_PURCHASE_COMPLAINTS } from "../data/purchaseComplaints.mock";
import { MOCK_PURCHASE_GOODS_RECEPTIONS } from "../data/purchaseGoodsReception.mock";
import { MOCK_PURCHASES } from "../data/purchases.mock";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "../data/purchaseNav.config";
import type {
	PurchaseComplaintRow,
	PurchaseGoodsReceptionRow,
	PurchaseRow,
} from "../types/purchase.types";
import {
	PurchaseCategoryBadge,
	PurchaseComplaintStatusBadge,
	PurchaseComplaintTypeLabel,
	PurchaseGoodsReceptionOrderTypeLabel,
	PurchaseStatusBadge,
	PurchaseTypeBadge,
} from "./PurchaseBadges";
import { PurchaseGoodsDetailDrawer } from "./PurchaseGoodsDetailDrawer";
import { ArchiveTab } from "./archive/ArchiveTab";

/** The grey pill the sibling lists use for the Objekt column. */
function ObjectPill({ value }: { value: string }) {
	return (
		<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
			{value}
		</span>
	);
}

function SeeDetailsLink({
	href,
	label,
}: {
	href: string;
	label: string;
}) {
	return (
		<Link href={href}>
			<Button
				variant="outline"
				size="sm"
				className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
			>
				<Translate text={label} />
			</Button>
		</Link>
	);
}

const PURCHASE_COLUMNS: DataTableColumn<PurchaseRow>[] = [
	{
		key: "purchaseNo",
		label: localizationConstants.purchaseColNumber,
		sortable: true,
		cellClassName: "text-sm font-medium text-slate-900",
	},
	{
		key: "name",
		label: localizationConstants.purchaseColName,
		sortable: true,
	},
	{
		key: "object",
		label: localizationConstants.purchaseColObject,
		sortable: true,
		render: (row) => <ObjectPill value={row.object} />,
	},
	{
		key: "orderer",
		label: localizationConstants.purchaseColOrderer,
		sortable: true,
	},
	{
		key: "type",
		label: localizationConstants.purchaseColType,
		sortable: true,
		render: (row) => <PurchaseTypeBadge type={row.type} />,
	},
	{
		key: "category",
		label: localizationConstants.purchaseColCategory,
		sortable: true,
		render: (row) => <PurchaseCategoryBadge category={row.category} />,
	},
	{
		key: "status",
		label: localizationConstants.statusLabel,
		sortable: true,
		render: (row) => <PurchaseStatusBadge status={row.status} />,
	},
];

const COMPLAINT_COLUMNS: DataTableColumn<PurchaseComplaintRow>[] = [
	{
		key: "complaintNo",
		label: localizationConstants.purchaseComplaintColNumber,
		sortable: true,
		cellClassName: "text-sm font-medium text-slate-900",
	},
	{
		key: "purchaseNo",
		label: localizationConstants.purchaseColNumber,
		sortable: true,
	},
	{
		key: "object",
		label: localizationConstants.purchaseColObject,
		sortable: true,
		render: (row) => <ObjectPill value={row.object} />,
	},
	{ key: "name", label: localizationConstants.purchaseColName, sortable: true },
	{
		key: "supplier",
		label: localizationConstants.purchaseSupplierColName,
		sortable: true,
	},
	{
		key: "type",
		label: localizationConstants.purchaseComplaintColType,
		sortable: true,
		render: (row) => <PurchaseComplaintTypeLabel type={row.type} />,
	},
	{
		key: "date",
		label: localizationConstants.purchaseComplaintColDate,
		sortable: true,
	},
	{
		key: "status",
		label: localizationConstants.statusLabel,
		sortable: true,
		render: (row) => <PurchaseComplaintStatusBadge status={row.status} />,
	},
];

/**
 * The frame duplicates "Benämning" here, header and data both — the same
 * copy-paste defect corrected in TFS-925. Rendered once.
 */
const RECEPTION_COLUMNS: DataTableColumn<PurchaseGoodsReceptionRow>[] = [
	{
		key: "object",
		label: localizationConstants.purchaseColObject,
		sortable: true,
		render: (row) => <ObjectPill value={row.object} />,
	},
	{
		key: "purchaseNo",
		label: localizationConstants.purchaseColNumber,
		sortable: true,
		cellClassName: "text-sm font-medium text-slate-900",
	},
	{ key: "name", label: localizationConstants.purchaseColName, sortable: true },
	{
		key: "supplier",
		label: localizationConstants.purchaseSupplierColName,
		sortable: true,
	},
	{
		key: "expectedDelivery",
		label: localizationConstants.purchaseGoodsReceptionColExpectedDelivery,
		sortable: true,
	},
	{
		key: "orderType",
		label: localizationConstants.purchaseGoodsReceptionColOrderType,
		sortable: true,
		render: (row) => (
			<PurchaseGoodsReceptionOrderTypeLabel orderType={row.orderType} />
		),
	},
];

/** Filter options per tab, matching the "Filter" control in the frames. */
const PURCHASE_STATUS_FILTERS = [
	{ value: "all", label: localizationConstants.purchaseFilterAllStatuses },
	{ value: "not_started", label: localizationConstants.purchaseStatusNotStarted },
	{ value: "ongoing", label: localizationConstants.purchaseStatusOngoing },
	{ value: "delayed", label: localizationConstants.purchaseStatusDelayed },
	{ value: "completed", label: localizationConstants.purchaseStatusCompleted },
];

const COMPLAINT_STATUS_FILTERS = [
	{ value: "all", label: localizationConstants.purchaseFilterAllStatuses },
	{
		value: "not_sent",
		label: localizationConstants.purchaseComplaintStatusNotSent,
	},
	{ value: "sent", label: localizationConstants.purchaseComplaintStatusSent },
	{
		value: "approved",
		label: localizationConstants.purchaseComplaintStatusApproved,
	},
];

const RECEPTION_TYPE_FILTERS = [
	{
		value: "all",
		label: localizationConstants.purchaseGoodsReceptionFilterAllTypes,
	},
	{
		value: "normal",
		label: localizationConstants.purchaseGoodsReceptionOrderTypeNormal,
	},
	{
		value: "partial",
		label: localizationConstants.purchaseGoodsReceptionOrderTypePartial,
	},
	{
		value: "backorder",
		label: localizationConstants.purchaseGoodsReceptionOrderTypeBackorder,
	},
];

/** Order type ranks by delivery completeness, as on the live list. */
const ORDER_TYPE_RANK: Record<
	PurchaseGoodsReceptionRow["orderType"],
	number
> = { normal: 0, partial: 1, backorder: 2 };

/**
 * The module's Arkiv tab: archived purchase orders, complaints and goods
 * receptions, each restorable or permanently deletable.
 *
 * The three tabs differ only in configuration — `ArchiveTab` holds the table,
 * toolbar, row menu and confirm step.
 */
export function PurchaseArchivePage() {
	const { t } = useTranslation();
	const [detailReception, setDetailReception] =
		useState<PurchaseGoodsReceptionRow | null>(null);

	const seeDetailsLabel = localizationConstants.purchaseSupplierSeeDetails;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabArchive,
				)}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active section from the query string,
				    so it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "purchases",
								labelKey:
									localizationConstants.purchaseArchiveTabPurchases,
							},
							{
								id: "complaints",
								labelKey:
									localizationConstants.purchaseArchiveTabComplaints,
							},
							{
								id: "receptions",
								labelKey:
									localizationConstants.purchaseArchiveTabReceptions,
							},
						]}
						ariaLabel={t(localizationConstants.purchaseTabArchive)}
					>
						<TabsContent value="purchases" className="mt-4">
							<ArchiveTab<PurchaseRow>
								rows={MOCK_PURCHASES}
								columns={PURCHASE_COLUMNS}
								searchFields={(row) => [
									row.purchaseNo,
									row.name,
									row.object,
									row.orderer,
								]}
								sortValue={(row, field) =>
									String(
										row[field as keyof PurchaseRow] ?? "",
									)
								}
								defaultSortBy="purchaseNo"
								emptyMessageKey={
									localizationConstants.purchaseArchiveNoPurchases
								}
								rowLabel={(row) => row.purchaseNo}
								renderPrimaryAction={(row) => (
									<SeeDetailsLink
										href={`${PURCHASE_MODULE_BASE_URL}/${encodeURIComponent(row.id)}`}
										label={
											localizationConstants.purchaseSeeButton
										}
									/>
								)}
								filterOptions={PURCHASE_STATUS_FILTERS}
								matchesFilter={(row, value) =>
									row.status === value
								}
								restoredToast={
									localizationConstants.purchaseRestoredToast
								}
								deletedToast={
									localizationConstants.purchaseDeletedToast
								}
							/>
						</TabsContent>

						<TabsContent value="complaints" className="mt-4">
							<ArchiveTab<PurchaseComplaintRow>
								rows={MOCK_PURCHASE_COMPLAINTS}
								columns={COMPLAINT_COLUMNS}
								searchFields={(row) => [
									row.complaintNo,
									row.purchaseNo,
									row.name,
									row.supplier,
								]}
								sortValue={(row, field) =>
									String(
										row[
											field as keyof PurchaseComplaintRow
										] ?? "",
									)
								}
								defaultSortBy="complaintNo"
								emptyMessageKey={
									localizationConstants.purchaseArchiveNoComplaints
								}
								rowLabel={(row) => row.complaintNo}
								renderPrimaryAction={(row) => (
									<SeeDetailsLink
										href={`${PURCHASE_MODULE_BASE_URL}/complaints/${encodeURIComponent(row.id)}`}
										label={seeDetailsLabel}
									/>
								)}
								filterOptions={COMPLAINT_STATUS_FILTERS}
								matchesFilter={(row, value) =>
									row.status === value
								}
								restoredToast={
									localizationConstants.purchaseComplaintRestoredToast
								}
								deletedToast={
									localizationConstants.purchaseComplaintDeletedToast
								}
							/>
						</TabsContent>

						<TabsContent value="receptions" className="mt-4">
							<ArchiveTab<PurchaseGoodsReceptionRow>
								rows={MOCK_PURCHASE_GOODS_RECEPTIONS}
								columns={RECEPTION_COLUMNS}
								searchFields={(row) => [
									row.purchaseNo,
									row.name,
									row.supplier,
									row.object,
								]}
								sortValue={(row, field) =>
									field === "orderType"
										? ORDER_TYPE_RANK[row.orderType]
										: String(
												row[
													field as keyof PurchaseGoodsReceptionRow
												] ?? "",
											)
								}
								defaultSortBy="purchaseNo"
								emptyMessageKey={
									localizationConstants.purchaseArchiveNoReceptions
								}
								rowLabel={(row) => row.purchaseNo}
								renderPrimaryAction={(row) => (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setDetailReception(row)}
										className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
									>
										<Translate text={seeDetailsLabel} />
									</Button>
								)}
								filterOptions={RECEPTION_TYPE_FILTERS}
								matchesFilter={(row, value) =>
									row.orderType === value
								}
								restoredToast={
									localizationConstants.purchaseGoodsReceptionRestoredToast
								}
								deletedToast={
									localizationConstants.purchaseGoodsReceptionDeletedToast
								}
							/>
						</TabsContent>
					</SectionTabs>
				</Suspense>
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

export default PurchaseArchivePage;
