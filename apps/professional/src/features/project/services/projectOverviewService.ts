import {
	PROJECT_LIST_ROWS,
	ProjectListItem,
} from "../data/projectsOverview.mock";

/**
 * The project rows, in memory.
 *
 * There is no projects endpoint, so this stands in for one: a module-level
 * array that every screen reads through. Each mutator reassigns it so callers
 * see a new identity and re-render.
 *
 * There is no subscription, so a change made on one screen does not reach
 * another screen that is already mounted. The list and Arkiv are separate
 * routes and navigating between them remounts, so that is adequate here;
 * `features/machines/purchase/data/purchase.mock.ts` has a pub/sub if this
 * ever needs one.
 */
let projects: ProjectListItem[] = [...PROJECT_LIST_ROWS];

/** Sets `archived` on one row, leaving the rest of the collection alone. */
function setArchived(id: string, archived: boolean): ProjectListItem[] {
	projects = projects.map((project) =>
		project.id === id ? { ...project, archived } : project,
	);
	return projects;
}

/** The active list — archived rows are not part of it. */
export function listProjects(): ProjectListItem[] {
	return projects.filter((project) => !project.archived);
}

/** The Arkiv list. */
export function listArchivedProjects(): ProjectListItem[] {
	return projects.filter((project) => project.archived);
}

/**
 * Moves a project into Arkiv.
 *
 * This used to be `removeProject` byte for byte — it filtered the row out of
 * the array — so archiving a project destroyed it while reporting success.
 * Archiving is reversible; `restoreProject` is the way back.
 */
export function archiveProject(id: string): ProjectListItem[] {
	return setArchived(id, true);
}

/** Moves a project back out of Arkiv and into the active list. */
export function restoreProject(id: string): ProjectListItem[] {
	return setArchived(id, false);
}

/** Permanent. The only call that actually drops a row — keep it behind a confirm. */
export function removeProject(id: string): ProjectListItem[] {
	projects = projects.filter((project) => project.id !== id);
	return projects;
}
