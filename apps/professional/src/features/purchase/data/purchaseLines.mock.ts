import type { PurchaseLineRow } from "../types/purchase.types";

/**
 * Lines belonging to a purchase, taken from the record-page frames.
 *
 * Four corrections to the frames, all flagged on the ticket:
 *
 * - The list frame numbers I501's lines `I500-001`…`I500-004`, from the wrong
 *   purchase. The Gantt frame numbers the same lines `I501-00x`, which is
 *   self-consistent, so lines are numbered from their parent.
 * - `I500-.003` carries a stray dot.
 * - `I500-004` is printed twice, on two different lines; the second is
 *   renumbered rather than duplicated.
 * - Two rows are dated `2029-09-25` with deliveries in 2026 — a delivery cannot
 *   precede its purchase, so these read as a typo for 2025.
 *
 * The two frames also disagree on what the lines are: the Gantt frame lists
 * "Badruminredning" and "Ståltrappa" where the list frame has stairs and
 * building material. The list frame wins, and both tabs render the same lines,
 * because a record showing itself two different ways is worse than either.
 */
export const MOCK_PURCHASE_LINES: PurchaseLineRow[] = [
	{
		id: "i501-001",
		purchaseId: "I501",
		lineNo: "I501-001",
		designation: "Köp kök",
		supplier: "Beijer",
		purchaseDate: "2025-09-01",
		deliveryDate: "2025-10-15",
		estimatedDelivery: "2025-10-09",
		monitoringDate: "",
		status: "delivered",
		archived: false,
	},
	{
		id: "i501-002",
		purchaseId: "I501",
		lineNo: "I501-002",
		designation: "Golv",
		supplier: "ByggMax",
		purchaseDate: "2025-09-15",
		deliveryDate: "",
		estimatedDelivery: "2026-01-01",
		monitoringDate: "",
		status: "ordered",
		archived: false,
	},
	{
		id: "i501-003",
		purchaseId: "I501",
		lineNo: "I501-003",
		designation: "Trappa",
		supplier: "Fredells",
		purchaseDate: "2025-09-15",
		deliveryDate: "",
		estimatedDelivery: "2025-12-15",
		monitoringDate: "",
		status: "in_progress",
		archived: false,
	},
	{
		id: "i501-004",
		purchaseId: "I501",
		lineNo: "I501-004",
		designation: "Byggmaterial",
		supplier: "Marbodal",
		purchaseDate: "2025-09-25",
		deliveryDate: "2026-11-16",
		estimatedDelivery: "2026-11-15",
		monitoringDate: "",
		status: "delivered",
		archived: false,
	},
	{
		id: "i501-005",
		purchaseId: "I501",
		lineNo: "I501-005",
		designation: "Fönster",
		supplier: "",
		purchaseDate: "2025-09-25",
		deliveryDate: "",
		estimatedDelivery: "",
		monitoringDate: "2026-05-01",
		status: "monitoring",
		archived: false,
	},
	{
		id: "i500-001",
		purchaseId: "I500",
		lineNo: "I500-001",
		designation: "Köksstomme",
		supplier: "Beijer",
		purchaseDate: "2025-08-04",
		deliveryDate: "2025-09-20",
		estimatedDelivery: "2025-09-18",
		monitoringDate: "",
		status: "delivered",
		archived: false,
	},
	{
		id: "i500-002",
		purchaseId: "I500",
		lineNo: "I500-002",
		designation: "Bänkskiva",
		supplier: "Marbodal",
		purchaseDate: "2025-08-04",
		deliveryDate: "",
		estimatedDelivery: "2025-11-02",
		monitoringDate: "2025-10-20",
		status: "monitoring",
		archived: false,
	},
	{
		id: "i502-001",
		purchaseId: "I502",
		lineNo: "I502-001",
		designation: "Stomkomplettering",
		supplier: "Fredells",
		purchaseDate: "2025-10-01",
		deliveryDate: "",
		estimatedDelivery: "2026-02-10",
		monitoringDate: "",
		status: "ordered",
		archived: false,
	},
];

/** Lines belonging to one purchase, newest line last as the frame prints them. */
export function purchaseLinesFor(purchaseId: string): PurchaseLineRow[] {
	return MOCK_PURCHASE_LINES.filter((line) => line.purchaseId === purchaseId);
}
