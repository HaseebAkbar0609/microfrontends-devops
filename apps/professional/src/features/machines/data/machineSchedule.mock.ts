import type { MachineScheduleRow } from "../types/machine.types";

/** The Figma frame shows four weeks of seven days each. */
export const GANTT_TOTAL_DAYS = 28;

/** Day numbers repeated per week, exactly as labelled in the design. */
export const GANTT_WEEK_DAYS = [8, 9, 10, 11, 12, 13, 14];

/**
 * Timeline colours lifted from the design tokens in the TFS-804 frame
 * ("Maskin - Gantschema").
 */
export const GANTT_COLORS = {
	/** slate/200 — an unbooked day. */
	emptyTrack: "#E2E8F0",
	/** yellow/200 and yellow/600 — planning window and its assignment bar. */
	planningWindow: "#FEF08A",
	planningBar: "#CA8A04",
	/** green/200, green/600 and green/700 — booked window and assignment bar. */
	bookedWindow: "#BBF7D0",
	bookedBarLead: "#16A34A",
	bookedBar: "#15803D",
	/** red/700 — maintenance or breakdown block. */
	maintenanceBar: "#B91C1C",
} as const;

/**
 * Mock schedule mirroring the rows in the TFS-804 Figma frame. Spans were read
 * off the frame cell by cell, including the portion that sits outside the
 * clipped preview area on the canvas.
 *
 * Bars whose `to` reaches the last day continue beyond the visible window and
 * are rendered without a closing cap, matching the design.
 */
export const MOCK_MACHINE_SCHEDULE: MachineScheduleRow[] = [
	{
		id: "sch-p2025-001",
		objectNo: "P2025-001",
		label: "Ombyggnad kök",
		start: "2024/01/01",
		machineCount: 50,
		window: { from: 3, to: 27, color: GANTT_COLORS.planningWindow },
		bar: { from: 0, to: 27, color: GANTT_COLORS.planningBar },
	},
	{
		id: "sch-order-501",
		objectNo: "Order 501",
		label: "Foundation",
		start: "2024/01/01",
		machineCount: 32,
		window: { from: 1, to: 27, color: GANTT_COLORS.bookedWindow },
		bar: {
			from: 8,
			to: 16,
			color: GANTT_COLORS.bookedBar,
			leadColor: GANTT_COLORS.bookedBarLead,
		},
	},
	{
		id: "sch-servicebil-1",
		objectNo: "Servicebil 1",
		label: "Servicebil",
		start: "2024/01/01",
		machineCount: 12,
		bar: { from: 16, to: 27, color: GANTT_COLORS.maintenanceBar },
	},
	{
		id: "sch-p2025-002",
		objectNo: "P2025-002",
		label: "Köksrenoving",
		start: "2024/01/01",
		machineCount: 20,
	},
];
