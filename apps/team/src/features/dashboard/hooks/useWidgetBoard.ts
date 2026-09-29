"use client";

import { useEffect, useMemo, useState } from "react";
import {
	DEFAULT_HOME_WIDGET_IDS,
	HOME_BOARD_COLUMNS,
	HOME_WIDGET_IDS,
	HOME_WIDGET_LAYOUT_STORAGE_KEY,
} from "../constants/dashboard.constants";
import type { HomeWidgetId } from "../types";

export type BoardSlot = { uid: string; widgetId: HomeWidgetId | null };

let slotSequence = 0;
export const makeSlot = (widgetId: HomeWidgetId | null): BoardSlot => ({
	uid: `slot-${slotSequence++}`,
	widgetId,
});

const isHomeWidgetId = (value: unknown): value is HomeWidgetId =>
	typeof value === "string" &&
	(HOME_WIDGET_IDS as readonly string[]).includes(value);

/** The stored layout, or the default when nothing usable was stored. */
export const parseLayout = (raw: string | null): HomeWidgetId[] => {
	if (raw === null) return [...DEFAULT_HOME_WIDGET_IDS];
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [...DEFAULT_HOME_WIDGET_IDS];
		return [...new Set(parsed.filter(isHomeWidgetId))];
	} catch {
		return [...DEFAULT_HOME_WIDGET_IDS];
	}
};

const readLayout = (): HomeWidgetId[] => {
	try {
		return parseLayout(window.localStorage.getItem(HOME_WIDGET_LAYOUT_STORAGE_KEY));
	} catch {
		return [...DEFAULT_HOME_WIDGET_IDS];
	}
};

const writeLayout = (ids: HomeWidgetId[]) => {
	try {
		window.localStorage.setItem(
			HOME_WIDGET_LAYOUT_STORAGE_KEY,
			JSON.stringify(ids)
		);
		return true;
	} catch {
		return false;
	}
};

/** Keeps at least one empty slot at the end and fills the last grid row. */
export const padDraft = (slots: BoardSlot[]): BoardSlot[] => {
	const next = [...slots];
	while (
		next[next.length - 1]?.widgetId !== null ||
		next.length % HOME_BOARD_COLUMNS !== 0
	) {
		next.push(makeSlot(null));
	}
	return next;
};

export const placeInSlot = (
	slots: BoardSlot[],
	widgetId: HomeWidgetId,
	targetUid?: string
) => {
	if (slots.some((slot) => slot.widgetId === widgetId)) return slots;
	const target = targetUid
		? slots.find((slot) => slot.uid === targetUid && slot.widgetId === null)
		: slots.find((slot) => slot.widgetId === null);
	if (!target) return slots;
	return padDraft(
		slots.map((slot) =>
			slot.uid === target.uid ? { ...slot, widgetId } : slot
		)
	);
};

export const clearSlot = (slots: BoardSlot[], uid: string) =>
	padDraft(
		slots.map((slot) =>
			slot.uid === uid ? { ...slot, widgetId: null } : slot
		)
	);

/** Swaps two slots' widgets; moving onto an empty slot leaves the old one empty. */
export const swapSlots = (
	slots: BoardSlot[],
	fromUid: string,
	targetUid: string
) => {
	const from = slots.find((slot) => slot.uid === fromUid);
	const target = slots.find((slot) => slot.uid === targetUid);
	if (!from || !target || from.widgetId === null) return slots;
	return padDraft(
		slots.map((slot) => {
			if (slot.uid === fromUid) return { ...slot, widgetId: target.widgetId };
			if (slot.uid === targetUid) return { ...slot, widgetId: from.widgetId };
			return slot;
		})
	);
};

export function useWidgetBoard() {
	const [mode, setMode] = useState<"view" | "edit">("view");
	const [savedSlots, setSavedSlots] = useState<BoardSlot[]>([]);
	const [draftSlots, setDraftSlots] = useState<BoardSlot[]>([]);
	const [dirty, setDirty] = useState(false);
	const [isHydrating, setIsHydrating] = useState(true);

	useEffect(() => {
		setSavedSlots(readLayout().map(makeSlot));
		setIsHydrating(false);
	}, []);

	const editing = mode === "edit";
	const slots = editing ? draftSlots : savedSlots;
	const placedIds = useMemo(
		() =>
			slots
				.map((slot) => slot.widgetId)
				.filter((id): id is HomeWidgetId => id !== null),
		[slots]
	);

	const updateDraft = (update: (prev: BoardSlot[]) => BoardSlot[]) => {
		setDraftSlots(update);
		setDirty(true);
	};

	const enterEdit = () => {
		setDraftSlots(padDraft(savedSlots));
		setDirty(false);
		setMode("edit");
	};

	const exitToView = () => {
		setMode("view");
		setDraftSlots([]);
		setDirty(false);
	};

	/** Applies the draft; returns false when the browser refused to store it. */
	const save = () => {
		const kept = draftSlots.filter((slot) => slot.widgetId !== null);
		const stored = writeLayout(
			kept
				.map((slot) => slot.widgetId)
				.filter((id): id is HomeWidgetId => id !== null)
		);
		setSavedSlots(kept);
		exitToView();
		return stored;
	};

	const moveWidget = (fromUid: string, targetUid: string) => {
		if (fromUid === targetUid) return;
		updateDraft((prev) => swapSlots(prev, fromUid, targetUid));
	};

	return {
		editing,
		slots,
		dirty,
		placedIds,
		isHydrating,
		enterEdit,
		exitToView,
		save,
		moveWidget,
		addWidget: (widgetId: HomeWidgetId) =>
			updateDraft((prev) => placeInSlot(prev, widgetId)),
		dropWidget: (widgetId: HomeWidgetId, targetUid: string) =>
			updateDraft((prev) => placeInSlot(prev, widgetId, targetUid)),
		removeWidget: (uid: string) => updateDraft((prev) => clearSlot(prev, uid)),
		/** Removing from the view opens edit mode so the change can be undone. */
		beginRemoveWidget: (uid: string) => {
			setDraftSlots(clearSlot(savedSlots, uid));
			setDirty(true);
			setMode("edit");
		},
	};
}
