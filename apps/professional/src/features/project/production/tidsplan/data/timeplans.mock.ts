import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import type { Timeplan, TimeplanTask } from "../types";

/**
 * Seeded timeplans for the projects that have them.
 *
 * Dated with `mockDate`, which is frozen to `MOCK_REFERENCE_DATE` and does UTC
 * arithmetic, so every date is identical on the server and the client. The
 * main plan opens on Monday 2026-07-06 and runs four ISO weeks to Sunday
 * 2026-08-02 — the frame's four-week window, crossing a month boundary so the
 * header's month row is exercised.
 *
 * Task names are the frame's own — seeded data, not UI copy.
 */

/** Monday 2026-07-06, as an offset from the reference date. */
const WINDOW_START = -18;

/** Day `n` of the four-week window. */
const d = (n: number) => mockDate(WINDOW_START + n);

const task = (
	id: string,
	name: string,
	from: number,
	to: number,
	children?: TimeplanTask[],
): TimeplanTask => ({ id, name, startDate: d(from), endDate: d(to), children });

/** The frame's Huvudtidsplan: four phases, three levels deep. */
const MAIN_TASKS: TimeplanTask[] = [
	task("t-koksrenov", "5000 - Köksrenov", 0, 27, [
		task("t-siteworks", "Siteworks", 0, 4, [
			task("t-clear-lot", "Clear lot", 0, 2),
			task("t-stakeout", "Stakeout", 3, 3),
			task("t-excavation", "Excavation", 4, 8),
		]),
	]),
	task("t-foundation", "Foundation", 8, 16, [
		task("t-foundation-form", "Form", 8, 11),
		task("t-foundation-rebar", "Mesh & Rebar", 12, 15),
		task("t-foundation-pour", "Pour concrete", 16, 16),
	]),
	task("t-framing", "Rough framing", 16, 27, [
		task("t-framing-sill", "Form", 17, 17),
		task("t-framing-rebar", "Mesh & Rebar", 18, 27),
		task("t-framing-pour-1", "Pour concrete", 22, 23),
		task("t-framing-pour-2", "Pour concrete", 24, 25),
	]),
	task("t-hvac", "HVAC", 23, 27, [
		task("t-hvac-pour", "Pour concrete", 23, 26, [
			task("t-hvac-excavation", "Excavation", 23, 24),
			task("t-hvac-pour-leaf", "Pour concrete", 25, 26),
		]),
	]),
];

const SUB_TASKS: TimeplanTask[] = [
	task("s-kok", "Kök", 7, 20, [
		task("s-rivning", "Rivning", 7, 9),
		task("s-el", "El", 10, 14),
		task("s-vvs", "VVS", 15, 20),
	]),
];

/**
 * Keyed by project id. A project without an entry has no plans yet and shows
 * the list's empty state.
 */
export const SEEDED_TIMEPLANS: Timeplan[] = [
	{
		id: "5001-plan-main",
		projectId: "5001",
		kind: "main",
		type: "standard",
		startDate: d(0),
		endDate: d(27),
		createdById: "author-kalle",
		createdDate: mockDate(-30),
		revisedDate: "",
		description: "Etablerings tidsplan över byggnation",
		tasks: MAIN_TASKS,
	},
	{
		id: "5001-plan-sub",
		projectId: "5001",
		kind: "sub",
		type: "standard",
		startDate: d(7),
		endDate: d(20),
		createdById: "author-stefan",
		createdDate: mockDate(-30),
		revisedDate: mockDate(-5),
		description: "Deltidsplan för köksrenoveringen",
		tasks: SUB_TASKS,
	},
	{
		id: "5000-plan-main",
		projectId: "5000",
		kind: "main",
		type: "standard",
		startDate: d(0),
		endDate: d(20),
		createdById: "author-kalle",
		createdDate: mockDate(-45),
		revisedDate: "",
		description: "Huvudtidsplan för projektet",
		tasks: [
			task("p0-etablering", "Etablering", 0, 4),
			task("p0-stomme", "Stomme", 5, 20, [
				task("p0-grund", "Grund", 5, 10),
				task("p0-vaggar", "Väggar", 11, 20),
			]),
		],
	},
	{
		id: "5002-plan-sub",
		projectId: "5002",
		kind: "sub",
		type: "standard",
		startDate: d(3),
		endDate: d(13),
		createdById: "author-stina",
		createdDate: mockDate(-20),
		revisedDate: "",
		description: "Deltidsplan för service",
		tasks: [task("p2-service", "Service", 3, 13)],
	},
];
