import type { PurchaseGanttRow } from "../types/purchase.types";

/**
 * Fixed anchor for the Gantt sample data. Dates are hard-coded rather than
 * derived from `new Date()` so the server and client render the same grid, and
 * they straddle this date so the "today" marker lands inside the window.
 */
export const PURCHASE_GANTT_ANCHOR = "2026-08-25";

/**
 * Sample rows from the Figma frame. The design's own tooltip dates sit in 2025;
 * these keep the same shape (order -> estimated delivery -> delivery ->
 * monitoring) but are placed around the anchor so the today marker is visible.
 */
export const MOCK_PURCHASE_GANTT: PurchaseGanttRow[] = [
	{
		id: "I500",
		purchaseNo: "I500",
		objectName: "Köksrenovering",
		connection: "Order P001",
		orderer: "Fastighetsbolag",
		status: "ongoing",
		orderDate: "2026-06-01",
		estimatedDelivery: "2026-09-01",
		delivery: "2026-09-05",
		monitoring: "2026-11-15",
		children: [
			{
				id: "I500-1",
				purchaseNo: "I500-1",
				objectName: "Vitvaror",
				connection: "Order P001",
				orderer: "Fastighetsbolag",
				status: "ongoing",
				orderDate: "2026-06-15",
				estimatedDelivery: "2026-08-20",
				delivery: "2026-08-28",
				monitoring: "2026-10-01",
			},
		],
	},
	{
		id: "I501",
		purchaseNo: "I501",
		objectName: "Badrum",
		connection: "Projekt 2025-001",
		orderer: "Fastighetsbolag",
		status: "completed",
		orderDate: "2026-06-20",
		estimatedDelivery: "2026-08-10",
		delivery: "2026-08-12",
		monitoring: "2026-10-20",
	},
	{
		id: "I502",
		purchaseNo: "I502",
		objectName: "Ombyggnad",
		connection: "Order P002",
		orderer: "Fastighetsbolag",
		status: "not_started",
		orderDate: "2026-07-10",
		estimatedDelivery: "2026-10-01",
		delivery: "2026-10-05",
		monitoring: "2026-12-01",
	},
	{
		id: "I503",
		purchaseNo: "I503",
		objectName: "Tillbyggnad",
		connection: "Projekt 2025-002",
		orderer: "Fastighetsbolag",
		status: "delayed",
		orderDate: "2026-06-05",
		estimatedDelivery: "2026-08-15",
		delivery: "2026-09-20",
		monitoring: "2026-11-30",
	},
];
