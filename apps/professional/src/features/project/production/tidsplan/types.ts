/** Huvudtidsplan or Deltidsplan. Stored as an id, rendered through a key. */
export type TimeplanKind = "main" | "sub";

/** The plan's template. Only one is defined today. */
export type TimeplanType = "standard";

/**
 * One activity in a plan, with its own dates and any activities beneath it.
 *
 * Nested rather than flat-with-`parentId`: the order module's
 * `PlanningOverviewTab` keeps a flat list and inserts a child by splicing after
 * the parent's direct children, which lands it between a parent and its
 * grandchildren. A tree cannot put a child anywhere but under its parent.
 */
export interface TimeplanTask {
	id: string;
	name: string;
	/** ISO `yyyy-MM-dd`. */
	startDate: string;
	/** ISO `yyyy-MM-dd`, on or after `startDate`. */
	endDate: string;
	children?: TimeplanTask[];
}

export interface Timeplan {
	id: string;
	projectId: string;
	version: number;
	kind: TimeplanKind;
	type: TimeplanType;
	/** ISO `yyyy-MM-dd`. */
	startDate: string;
	/** ISO `yyyy-MM-dd`. */
	endDate: string;
	/** Stored creator name from the authenticated account. */
	createdById: string;
	/** ISO `yyyy-MM-dd` — the list's "Datum". */
	createdDate: string;
	/** ISO `yyyy-MM-dd`, or empty until the plan is revised. */
	revisedDate: string;
	description: string;
	tasks: TimeplanTask[];
}

/** What the create and edit form collects — everything but the tasks. */
export type TimeplanDetails = Omit<Timeplan, "id" | "projectId" | "version" | "tasks">;
