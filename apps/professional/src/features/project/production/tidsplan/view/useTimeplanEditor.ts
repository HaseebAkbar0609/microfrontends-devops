"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { generateTempId } from "@/lib/tempId";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { getPlan, saveTasks } from "../services/timeplanService";
import { findTask, flattenTree, insertChild, spanOf, treeSpan } from "../taskTree";
import { buildTimeline } from "../timeline";
import { timeplanUrls } from "../timeplanNav";
import type { TimeplanTask } from "../types";
import type { NewTaskValues } from "./AddTaskDialog";

/** Where the add dialog will put the new task: under a task, or at the top. */
export interface AddTarget {
	parentId: string | null;
	defaultStart: string;
	defaultEnd: string;
}

/**
 * The Gantt's editing state: a draft task tree, what is collapsed, and whether
 * anything is unsaved.
 *
 * "Unsaved" is a reference check — `draft !== saved` — which is sound because
 * the tree is only ever replaced, never mutated, and there is no delete to undo.
 * Collapse state lives apart from the tree, so folding a branch is not a change.
 *
 * The two Gantt frames are this one screen in two states: the Avbryt/Spara
 * footer shows once the draft differs from what was saved.
 */
export function useTimeplanEditor(projectId: string, planId: string) {
	const t = useTranslate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const queryKey = useMemo(
		() => ["professional-project-timeplan", projectId, planId],
		[projectId, planId],
	);
	const query = useQuery({ queryKey, queryFn: () => getPlan(projectId, planId), retry: false });
	const plan = query.data;
	const [saved, setSaved] = useState<TimeplanTask[]>([]);
	const [draft, setDraft] = useState<TimeplanTask[]>([]);
	const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
	const [addTarget, setAddTarget] = useState<AddTarget | null>(null);
	const [confirmingDiscard, setConfirmingDiscard] = useState(false);
	const ganttRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!plan) return;
		setSaved(plan.tasks);
		setDraft(plan.tasks);
	}, [plan]);

	const dirty = draft !== saved;

	/* A reload or closing the tab while dirty asks first. In-app links are not
	   covered: the App Router offers no way to block a route change. */
	useEffect(() => {
		if (!dirty) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

	/* The axis covers the plan's own range and every task in the draft, so a
	   task dated outside the plan still gets a column to sit in. ISO strings
	   compare correctly as text. */
	const span = treeSpan(draft);
	const starts = [plan?.startDate, span?.startDate].filter((d): d is string => Boolean(d));
	const ends = [plan?.endDate, span?.endDate].filter((d): d is string => Boolean(d));
	const rangeStart = starts.reduce((a, b) => (b < a ? b : a), starts[0] ?? "");
	const rangeEnd = ends.reduce((a, b) => (b > a ? b : a), ends[0] ?? "");

	const timeline = useMemo(() => buildTimeline(rangeStart, rangeEnd), [rangeStart, rangeEnd]);
	const rows = useMemo(() => flattenTree(draft, collapsed), [draft, collapsed]);

	const toggle = useCallback((id: string) => {
		setCollapsed((previous) => {
			const next = new Set(previous);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const requestAdd = useCallback(
		(parentId: string | null) => {
			const parent = parentId ? findTask(draft, parentId) : undefined;
			const range = parent ? spanOf(parent) : { startDate: rangeStart, endDate: rangeEnd };
			setAddTarget({ parentId, defaultStart: range.startDate, defaultEnd: range.endDate });
		},
		[draft, rangeStart, rangeEnd],
	);

	const addTask = useCallback(
		(values: NewTaskValues) => {
			if (!addTarget) return;
			/* The id is made here, in the handler — never inside a state updater,
			   which Strict Mode runs twice. */
			const task: TimeplanTask = { id: generateTempId(), name: values.name, startDate: values.startDate, endDate: values.endDate };
			const { parentId } = addTarget;
			setDraft((previous) => insertChild(previous, parentId, task));
			/* A child added under a folded parent would otherwise be invisible. */
			if (parentId) {
				setCollapsed((previous) => {
					if (!previous.has(parentId)) return previous;
					const next = new Set(previous);
					next.delete(parentId);
					return next;
				});
			}
			setAddTarget(null);
		},
		[addTarget],
	);

	const save = useCallback(async () => {
		if (!plan) return;
		try {
			const updated = await saveTasks(plan, draft);
			queryClient.setQueryData(queryKey, updated);
			setSaved(draft);
			showToast("success", t(localizationConstants.projectTimeplanSavedToast));
			ganttRef.current?.focus();
		} catch {
			showToast("error", t(localizationConstants.genericError));
		}
	}, [draft, plan, queryClient, queryKey, t]);

	const confirmDiscard = useCallback(() => {
		setDraft(saved);
		setConfirmingDiscard(false);
		router.push(timeplanUrls.list(projectId));
	}, [projectId, router, saved]);

	return {
		plan,
		isLoading: query.isLoading,
		isError: query.isError,
		rows,
		timeline,
		collapsed,
		dirty,
		ganttRef,
		toggle,
		addTarget,
		requestAdd,
		cancelAdd: () => setAddTarget(null),
		addTask,
		save,
		confirmingDiscard,
		requestDiscard: () => setConfirmingDiscard(true),
		cancelDiscard: () => setConfirmingDiscard(false),
		confirmDiscard,
	};
}
