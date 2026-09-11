import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import type { StaffLedgerEntry } from "../types";

/** How a check-in was made. The only one the frame draws. */
const TOOL_APP = "App Timeflow Work";

/**
 * One seeded entry, before its date and id are filled in.
 *
 * `day` is an offset handed to `mockDate`, which is frozen to
 * `MOCK_REFERENCE_DATE` and does UTC arithmetic — so every date is
 * deterministic and cannot differ between the server and the client. The
 * project list rows are dated the same way.
 */
interface SeededEntry extends Omit<StaffLedgerEntry, "id" | "date"> {
	day: number;
}

/**
 * Who was on site, per project.
 *
 * The subcontractors are the same companies the project's Organisation tab
 * lists, so the record's two people-shaped sections describe one project rather
 * than two unrelated casts.
 *
 * `ownStaff` and `supplier` are mutually exclusive: our own people carry no UE,
 * and the cell renders the missing-value mark. The frame shows "Ja" beside a
 * company on every row, which cannot both be true.
 *
 * Entries with an empty `loggedOut` are still on site — what "Inloggade NU"
 * filters to. Seeded on the most recent day so the checkbox has something to
 * find.
 */
const SEEDED: Record<string, SeededEntry[]> = {
	"5000": [
		{
			day: -2,
			personalNo: "1978-10-16-1010",
			name: "Kalle Svensson",
			role: "Snickare",
			ownStaff: true,
			supplier: "",
			loggedIn: "07:00",
			loggedOut: "16:36",
			tool: TOOL_APP,
		},
		{
			day: -2,
			personalNo: "1996-01-05-1010",
			name: "Stefan Eriksson",
			role: "Snickare",
			ownStaff: true,
			supplier: "",
			loggedIn: "07:36",
			loggedOut: "16:38",
			tool: TOOL_APP,
		},
		{
			day: -1,
			personalNo: "2002-02-14-1050",
			name: "Johan Karlsson",
			role: "Målare",
			ownStaff: false,
			supplier: "ByggTeam Stockholm AB",
			loggedIn: "07:38",
			loggedOut: "16:39",
			tool: TOOL_APP,
		},
		{
			day: 0,
			personalNo: "1998-04-05-4017",
			name: "Stina Larsson",
			role: "Elektriker",
			ownStaff: false,
			supplier: "Elbolaget AB",
			loggedIn: "06:21",
			loggedOut: "",
			tool: TOOL_APP,
		},
	],
	"5001": [
		{
			day: -3,
			personalNo: "1978-10-16-1010",
			name: "Kalle Svensson",
			role: "Snickare",
			ownStaff: true,
			supplier: "",
			loggedIn: "07:00",
			loggedOut: "16:36",
			tool: TOOL_APP,
		},
		{
			day: -3,
			personalNo: "1996-01-05-1010",
			name: "Stefan Eriksson",
			role: "Snickare",
			ownStaff: true,
			supplier: "",
			loggedIn: "07:36",
			loggedOut: "16:38",
			tool: TOOL_APP,
		},
		{
			day: -2,
			personalNo: "2002-02-14-1050",
			name: "Johan Karlsson",
			role: "Målare",
			ownStaff: false,
			supplier: "Bygg & Entreprenad Syd AB",
			loggedIn: "07:38",
			loggedOut: "16:39",
			tool: TOOL_APP,
		},
		{
			day: -2,
			personalNo: "1998-04-05-4017",
			name: "Stina Larsson",
			role: "Elektriker",
			ownStaff: false,
			supplier: "Elinstallationer Mälardalen AB",
			loggedIn: "06:21",
			loggedOut: "16:40",
			tool: TOOL_APP,
		},
		{
			day: -1,
			personalNo: "1963-09-09-2036",
			name: "Kent Nilsson",
			role: "Rörmokare",
			ownStaff: false,
			supplier: "ByggTeam Stockholm AB",
			loggedIn: "06:22",
			loggedOut: "17:01",
			tool: TOOL_APP,
		},
		{
			day: -1,
			personalNo: "1981-02-07-1880",
			name: "Johan Börjesson",
			role: "Städare",
			ownStaff: false,
			supplier: "Ritbolaget AB",
			loggedIn: "07:05",
			loggedOut: "17:01",
			tool: TOOL_APP,
		},
		{
			day: 0,
			personalNo: "1978-10-16-1010",
			name: "Kalle Svensson",
			role: "Snickare",
			ownStaff: true,
			supplier: "",
			loggedIn: "06:58",
			loggedOut: "",
			tool: TOOL_APP,
		},
		{
			day: 0,
			personalNo: "1998-04-05-4017",
			name: "Stina Larsson",
			role: "Elektriker",
			ownStaff: false,
			supplier: "Elbolaget AB",
			loggedIn: "07:12",
			loggedOut: "",
			tool: TOOL_APP,
		},
	],
	"5002": [
		{
			day: -1,
			personalNo: "1963-09-09-2036",
			name: "Kent Nilsson",
			role: "Rörmokare",
			ownStaff: true,
			supplier: "",
			loggedIn: "06:22",
			loggedOut: "17:01",
			tool: TOOL_APP,
		},
		{
			day: 0,
			personalNo: "1981-02-07-1880",
			name: "Johan Börjesson",
			role: "Städare",
			ownStaff: false,
			supplier: "Elbolaget AB",
			loggedIn: "07:05",
			loggedOut: "",
			tool: TOOL_APP,
		},
	],
};

/**
 * Builds a project's ledger.
 *
 * Returns `null` for an id that matches no project, so the page can 404 — an
 * empty array means "nobody has checked in on this project yet", which is a
 * different screen.
 */
export function buildProjectStaffLedger(
	projectId: string,
): StaffLedgerEntry[] | null {
	const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
	if (!row) return null;

	const entries = SEEDED[projectId];
	if (!entries) return [];

	return entries.map(({ day, ...entry }, index) => ({
		...entry,
		/* Derived from the project, so two rows cannot collide the way a
		   `Date.now()` fallback does. */
		id: `${projectId}-ledger-${index + 1}`,
		date: mockDate(day),
	}));
}
