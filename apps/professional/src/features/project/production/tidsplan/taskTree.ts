import type { TimeplanTask } from "./types";

/** A task as the Gantt draws it: its place in the tree and its drawn span. */
export interface TaskRow {
	task: TimeplanTask;
	depth: number;
	/** Index of the top-level phase it belongs to — picks its colour. */
	phaseIndex: number;
	hasChildren: boolean;
	/** Drawn span: its own dates widened to cover every descendant. */
	startDate: string;
	endDate: string;
}

/**
 * A task's drawn span: the union of its own dates and all its descendants'.
 *
 * So a child can never stick out of its parent's bar, and the add dialog needs
 * no date constraint. ISO `yyyy-MM-dd` strings compare correctly as text.
 */
export function spanOf(task: TimeplanTask): { startDate: string; endDate: string } {
	let startDate = task.startDate;
	let endDate = task.endDate;

	for (const child of task.children ?? []) {
		const span = spanOf(child);
		if (span.startDate < startDate) startDate = span.startDate;
		if (span.endDate > endDate) endDate = span.endDate;
	}
	return { startDate, endDate };
}

/** The earliest start and latest end across a whole tree, or `null` if empty. */
export function treeSpan(
	tasks: TimeplanTask[],
): { startDate: string; endDate: string } | null {
	if (tasks.length === 0) return null;

	return tasks.map(spanOf).reduce((acc, span) => ({
		startDate: span.startDate < acc.startDate ? span.startDate : acc.startDate,
		endDate: span.endDate > acc.endDate ? span.endDate : acc.endDate,
	}));
}

/** Depth-first rows, skipping the children of any collapsed task. */
export function flattenTree(
	tasks: TimeplanTask[],
	collapsed: ReadonlySet<string>,
): TaskRow[] {
	const rows: TaskRow[] = [];

	const walk = (nodes: TimeplanTask[], depth: number, phaseIndex: number) => {
		nodes.forEach((task, index) => {
			const phase = depth === 0 ? index : phaseIndex;
			const hasChildren = Boolean(task.children?.length);
			rows.push({ task, depth, phaseIndex: phase, hasChildren, ...spanOf(task) });

			if (hasChildren && !collapsed.has(task.id)) {
				walk(task.children ?? [], depth + 1, phase);
			}
		});
	};

	walk(tasks, 0, 0);
	return rows;
}

/**
 * Appends `child` to the children of `parentId`, at any depth, or to the top
 * level when `parentId` is `null`.
 *
 * Returns a new tree. Appending to the parent's own `children` array is what
 * keeps a new task out of the gap between a parent and its grandchildren, which
 * is where the order module's flat-list splice puts it.
 */
export function insertChild(
	tasks: TimeplanTask[],
	parentId: string | null,
	child: TimeplanTask,
): TimeplanTask[] {
	if (parentId === null) return [...tasks, child];

	return tasks.map((task) => {
		if (task.id === parentId) {
			return { ...task, children: [...(task.children ?? []), child] };
		}
		if (task.children?.length) {
			return { ...task, children: insertChild(task.children, parentId, child) };
		}
		return task;
	});
}

/** Finds a task anywhere in the tree. */
export function findTask(
	tasks: TimeplanTask[],
	id: string,
): TimeplanTask | undefined {
	for (const task of tasks) {
		if (task.id === id) return task;
		const found = task.children ? findTask(task.children, id) : undefined;
		if (found) return found;
	}
	return undefined;
}
