"use client";

import { useMemo } from "react";

import { purchaseLinesFor } from "../data/purchaseLines.mock";
import type {
	PurchaseGanttRow,
	PurchaseLineRow,
	PurchaseLineStatus,
	PurchaseRow,
	PurchaseStatus,
} from "../types/purchase.types";

/**
 * The schedule is typed against the module-wide Gantt, whose status drives the
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
 * A purchase's lines, in the two shapes its record page renders them: the list
 * rows themselves, and the same rows projected onto the Gantt.
 *
 * Kept out of the page so the component stays layout and wiring, matching the
 * other purchase hooks.
 */
export function usePurchaseLines(purchase: PurchaseRow) {
	const lines = useMemo(
		() => purchaseLinesFor(purchase.id),
		[purchase.id],
	);

	const ganttRows = useMemo(
		() => lines.map((line) => toGanttRow(line, purchase.orderer)),
		[lines, purchase.orderer],
	);

	return { lines, ganttRows };
}
