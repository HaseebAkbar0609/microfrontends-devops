"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import type { DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { purchaseLinesFor } from "../data/purchaseLines.mock";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import type {
	PurchaseGanttRow,
	PurchaseLineRow,
	PurchaseLineStatus,
	PurchaseRow,
	PurchaseStatus,
} from "../types/purchase.types";
import { PurchaseGanttTab } from "./PurchaseGanttTab";
import { PurchaseLineStatusBadge } from "./PurchaseBadges";
import { ArchivableRowsTable } from "./shared/ArchivableRowsTable";

export interface PurchaseRecordPageProps {
	purchase: PurchaseRow;
}

/** The frame prints an em dash for a date a line does not have yet. */
function dateOrDash(value: string) {
	return value === "" ? "-" : value;
}

const LINE_COLUMNS: DataTableColumn<PurchaseLineRow>[] = [
	{
		key: "lineNo",
		label: localizationConstants.purchaseColNumber,
		sortable: true,
		cellClassName: "text-sm font-medium text-slate-900",
	},
	{
		key: "purchaseDate",
		label: localizationConstants.purchaseLineColPurchaseDate,
		sortable: true,
		render: (row) => dateOrDash(row.purchaseDate),
	},
	{
		key: "designation",
		label: localizationConstants.purchaseColName,
		sortable: true,
	},
	{
		key: "supplier",
		label: localizationConstants.purchaseSupplierColName,
		sortable: true,
		render: (row) => dateOrDash(row.supplier),
	},
	{
		key: "deliveryDate",
		label: localizationConstants.purchaseLineColDeliveryDate,
		sortable: true,
		render: (row) => dateOrDash(row.deliveryDate),
	},
	{
		key: "estimatedDelivery",
		label: localizationConstants.purchaseLineColEstimatedDelivery,
		sortable: true,
		render: (row) => dateOrDash(row.estimatedDelivery),
	},
	{
		key: "monitoringDate",
		label: localizationConstants.purchaseLineColMonitoringDate,
		sortable: true,
		render: (row) => dateOrDash(row.monitoringDate),
	},
	{
		key: "status",
		label: localizationConstants.statusLabel,
		sortable: true,
		render: (row) => <PurchaseLineStatusBadge status={row.status} />,
	},
];

const LINE_STATUS_FILTERS = [
	{ value: "all", label: localizationConstants.purchaseFilterAllStatuses },
	{ value: "ordered", label: localizationConstants.purchaseLineStatusOrdered },
	{
		value: "in_progress",
		label: localizationConstants.purchaseLineStatusInProgress,
	},
	{
		value: "delivered",
		label: localizationConstants.purchaseLineStatusDelivered,
	},
	{
		value: "monitoring",
		label: localizationConstants.purchaseLineStatusMonitoring,
	},
];

/**
 * The Gantt is typed against the module-wide schedule, whose status drives the
 * bar colour. Line statuses map onto the nearest schedule meaning.
 */
const LINE_TO_SCHEDULE_STATUS: Record<PurchaseLineStatus, PurchaseStatus> = {
	ordered: "not_started",
	in_progress: "ongoing",
	delivered: "completed",
	monitoring: "delayed",
};

/**
 * The schedule parses all four dates, so every one must be present. A line
 * carries them progressively — a date it has not reached yet falls back to the
 * last one it has, which draws a bar that stops at what is actually known.
 */
function toGanttRow(line: PurchaseLineRow, orderer: string): PurchaseGanttRow {
	const estimated = line.estimatedDelivery || line.purchaseDate;
	const delivery = line.deliveryDate || estimated;
	const monitoring = line.monitoringDate || delivery;

	return {
		id: line.id,
		purchaseNo: line.lineNo,
		objectName: line.designation,
		connection: line.supplier || "-",
		orderer,
		status: LINE_TO_SCHEDULE_STATUS[line.status],
		orderDate: line.purchaseDate,
		estimatedDelivery: estimated,
		delivery,
		monitoring,
	};
}

/**
 * A purchase record: its lines, and those lines on a schedule.
 *
 * This route is what "Se inköp" on the purchase list and the Arkiv tab have
 * been linking to; until now it did not exist and both 404'd.
 *
 * The frames draw a record-scoped left sidebar. The app has that pattern
 * (`CalculationDetailSubSidebar`), but every purchase screen navigates through
 * `ModulePageHeader` per the TFS-910 guideline, and four of the sidebar's five
 * items have no destination — so the header is used here too. Flagged.
 */
export function PurchaseRecordPage({ purchase }: PurchaseRecordPageProps) {
	const lines = useMemo(
		() => purchaseLinesFor(purchase.id),
		[purchase.id],
	);

	const ganttRows = useMemo(
		() => lines.map((line) => toGanttRow(line, purchase.orderer)),
		[lines, purchase.orderer],
	);

	const listHref = `${PURCHASE_MODULE_BASE_URL}/overview`;

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: `${purchase.purchaseNo} — ${purchase.name}`,
					description: purchase.object,
					backHref: listHref,
				}}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active section from the query string,
				    so it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "lines",
								labelKey:
									localizationConstants.purchaseLineTabList,
							},
							{
								id: "gantt",
								labelKey:
									localizationConstants.purchaseOverviewTabGantt,
							},
						]}
						ariaLabel={purchase.purchaseNo}
					>
						<TabsContent value="lines" className="mt-4">
							<ArchivableRowsTable<PurchaseLineRow>
								rows={lines}
								mode="archive"
								columns={LINE_COLUMNS}
								searchFields={(row) => [
									row.lineNo,
									row.designation,
									row.supplier,
								]}
								sortValue={(row, field) =>
									String(
										row[field as keyof PurchaseLineRow] ??
											"",
									)
								}
								defaultSortBy="lineNo"
								emptyMessageKey={
									localizationConstants.purchaseLineNoneFound
								}
								rowLabel={(row) => row.lineNo}
								filterOptions={LINE_STATUS_FILTERS}
								matchesFilter={(row, value) =>
									row.status === value
								}
								movedToast={
									localizationConstants.purchaseLineArchivedToast
								}
								deletedToast={
									localizationConstants.purchaseLineDeletedToast
								}
								toolbarAction={
									<PermissionGate permission="CREATE_PURCHASE">
										<Link
											href={`${PURCHASE_MODULE_BASE_URL}/create`}
										>
											<Button className="h-10 cursor-pointer gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800">
												<Plus
													className="h-4 w-4"
													aria-hidden
												/>
												<Translate
													text={
														localizationConstants.purchaseLineCreate
													}
												/>
											</Button>
										</Link>
									</PermissionGate>
								}
							/>
						</TabsContent>

						<TabsContent value="gantt" className="mt-4">
							{/* Reuses the module Gantt: same zoom bands, today
							    marker and column-fraction bar positioning,
							    driven by this purchase's lines. Opens at month
							    zoom — day zoom's six-week window around the
							    anchor would hide lines dated months apart. */}
							<PurchaseGanttTab
								rows={ganttRows}
								initialZoom="month"
							/>
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default PurchaseRecordPage;
