import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import type { OrganisationMember } from "../types";

/**
 * The parties on a project, keyed by project id.
 *
 * Follows `projectRecordInfo.mock.ts`: what the list row already knows is read
 * from the row, and only what it does not carry is seeded here — so the record
 * and the list cannot disagree about who the customer is.
 *
 * Each row's `roll` is its group's own role, which is what makes the toolbar's
 * Filter read as a group filter without a second mechanism.
 *
 * Only `5000`, `5001` and `5002` are seeded, as in the sibling mock. The rest
 * render the empty state rather than a fabricated organisation.
 */
const SEEDED: Record<string, Omit<OrganisationMember, "id" | "foretag">[]> = {
	"5000": [
		{
			roll: "Beställare",
			kategori: "Beställare",
			address: "Storgatan 12",
			postNr: "111 22",
			ort: "Stockholm",
			kontakt: "Stina Andersson",
			mail: "stina@fastighetsbolag.se",
			group: "bestallare",
		},
		{
			roll: "Arkitekt",
			kategori: "Konsult",
			address: "Ritargatan 4",
			postNr: "113 30",
			ort: "Stockholm",
			kontakt: "Sara Nilsson",
			mail: "sara.nilsson@ritbolaget.se",
			group: "arkitekt",
		},
		{
			roll: "Byggentreprenör",
			kategori: "Entreprenör",
			address: "Verkstadsgatan 9",
			postNr: "121 45",
			ort: "Johanneshov",
			kontakt: "Magnus Ek",
			mail: "magnus.ek@byggteam.se",
			group: "byggentreprenor",
		},
		{
			roll: "Elektriker",
			kategori: "Underentreprenör",
			address: "Elverksvägen 2",
			postNr: "172 65",
			ort: "Sundbyberg",
			kontakt: "Peter Lind",
			mail: "peter.lind@elbolaget.se",
			group: "elektriker",
		},
	],
	"5001": [
		{
			roll: "Beställare",
			kategori: "Beställare",
			address: "Hantverkargatan 8",
			postNr: "112 21",
			ort: "Stockholm",
			kontakt: "Anders Svensson",
			mail: "anders.svensson@locum.se",
			group: "bestallare",
		},
		{
			roll: "Arkitekt",
			kategori: "Konsult",
			address: "Ritargatan 4",
			postNr: "113 30",
			ort: "Stockholm",
			kontakt: "Sara Nilsson",
			mail: "sara.nilsson@ritbolaget.se",
			group: "arkitekt",
		},
		{
			roll: "Byggentreprenör",
			kategori: "Entreprenör",
			address: "Industrivägen 21",
			postNr: "171 48",
			ort: "Solna",
			kontakt: "Johan Berg",
			mail: "johan.berg@entreprenadsyd.se",
			group: "byggentreprenor",
		},
		{
			roll: "Byggentreprenör",
			kategori: "Entreprenör",
			address: "Verkstadsgatan 9",
			postNr: "121 45",
			ort: "Johanneshov",
			kontakt: "Magnus Ek",
			mail: "magnus.ek@byggteam.se",
			group: "byggentreprenor",
		},
		{
			roll: "Elektriker",
			kategori: "Underentreprenör",
			address: "Kraftgatan 17",
			postNr: "723 48",
			ort: "Västerås",
			kontakt: "Eva Lund",
			mail: "eva.lund@elmalardalen.se",
			group: "elektriker",
		},
		{
			roll: "Elektriker",
			kategori: "Underentreprenör",
			address: "Elverksvägen 2",
			postNr: "172 65",
			ort: "Sundbyberg",
			kontakt: "Peter Lind",
			mail: "peter.lind@elbolaget.se",
			group: "elektriker",
		},
	],
	"5002": [
		{
			roll: "Beställare",
			kategori: "Beställare",
			address: "Drottninggatan 21",
			postNr: "111 51",
			ort: "Stockholm",
			kontakt: "Karin Lund",
			mail: "karin.lund@sisab.se",
			group: "bestallare",
		},
		{
			roll: "Elektriker",
			kategori: "Underentreprenör",
			address: "Elverksvägen 2",
			postNr: "172 65",
			ort: "Sundbyberg",
			kontakt: "Peter Lind",
			mail: "peter.lind@elbolaget.se",
			group: "elektriker",
		},
	],
};

/** The company behind each seeded row, in the same order. */
const SEEDED_COMPANIES: Record<string, string[]> = {
	"5000": [
		"",
		"Ritbolaget AB",
		"ByggTeam Stockholm AB",
		"Elbolaget AB",
	],
	"5001": [
		"",
		"Ritbolaget AB",
		"Bygg & Entreprenad Syd AB",
		"ByggTeam Stockholm AB",
		"Elinstallationer Mälardalen AB",
		"Elbolaget AB",
	],
	"5002": ["", "Elbolaget AB"],
};

/**
 * Builds a project's organisation from its list row plus the seeded parties.
 *
 * Returns `null` for an id that matches no project, so the page can 404 rather
 * than render an empty shell — an empty array means "this project has no
 * organisation yet", which is a different screen.
 *
 * The Beställare's company is the project's own customer, read from the list
 * row; every other company is seeded.
 */
export function buildProjectOrganisation(
	projectId: string,
): OrganisationMember[] | null {
	const row = PROJECT_LIST_ROWS.find((project) => project.id === projectId);
	if (!row) return null;

	const parties = SEEDED[projectId];
	if (!parties) return [];

	const companies = SEEDED_COMPANIES[projectId] ?? [];

	return parties.map((party, index) => ({
		...party,
		/* Stable and derived from the project, so two rows cannot collide the
		   way a `Date.now()` fallback does. */
		id: `${projectId}-org-${index + 1}`,
		foretag: companies[index] || row.customer,
	}));
}
