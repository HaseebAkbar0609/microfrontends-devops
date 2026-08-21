"use client";

import { useMemo, useState } from "react";
import { generateTempId } from "@/lib/tempId";
import { WidgetItem } from "../components/DraggableSidebarItem";

export type OwnSlot = { uid: string; widgetId: string | null };

const makeSlot = (widgetId: string | null): OwnSlot => ({
	uid: generateTempId(),
	widgetId,
});

const padDraft = (slots: OwnSlot[]): OwnSlot[] => {
	const next = [...slots];
	const trailingEmpty = () => {
		let count = 0;
		for (let i = next.length - 1; i >= 0; i--) {
			if (next[i].widgetId !== null) break;
			count++;
		}
		return count;
	};
	while (trailingEmpty() < 1 || next.length % 3 !== 0) {
		next.push(makeSlot(null));
	}
	return next;
};

export function useWidgetBoard(
	allItems: WidgetItem[],
	initialStandardIds: string[],
) {
	const [mode, setMode] = useState<"view" | "edit">("view");
	const [savedSlots, setSavedSlots] = useState<OwnSlot[]>([]);
	const [savedAtLabel, setSavedAtLabel] = useState<string | null>(null);
	const [draftSlots, setDraftSlots] = useState<OwnSlot[]>([]);
	const [dirty, setDirty] = useState(false);
	const [standardIds, setStandardIds] = useState<string[]>(initialStandardIds);
	const [hiddenIds, setHiddenIds] = useState<string[]>([]);

	const slots = mode === "edit" ? draftSlots : savedSlots;
	const placedIds = useMemo(
		() =>
			slots
				.map((slot) => slot.widgetId)
				.filter((id): id is string => id !== null),
		[slots],
	);

	const libraryItems = useMemo(
		() =>
			allItems.filter(
				(item) =>
					!hiddenIds.includes(item.id) &&
					!standardIds.includes(item.id),
			),
		[allItems, hiddenIds, standardIds],
	);

	const standardItems = useMemo(
		() =>
			allItems.filter((item) =>
				standardIds.includes(item.id),
			),
		[allItems, standardIds],
	);

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

	const save = () => {
		const trimmed = draftSlots.filter((slot) => slot.widgetId !== null);
		setSavedSlots(trimmed);
		setSavedAtLabel(
			new Date().toLocaleTimeString("sv-SE", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
		exitToView();
	};

	const addWidget = (widgetId: string) => {
		setDraftSlots((prev) => {
			const next = [...prev];
			const empty = next.findIndex((slot) => slot.widgetId === null);
			if (empty >= 0) next[empty] = { ...next[empty], widgetId };
			else next.push(makeSlot(widgetId));
			return padDraft(next);
		});
		setDirty(true);
	};

	const dropWidget = (widgetId: string, targetUid: string) => {
		setDraftSlots((prev) => {
			const target = prev.find((slot) => slot.uid === targetUid);
			if (!target || target.widgetId !== null) return prev;
			return padDraft(
				prev.map((slot) =>
					slot.uid === targetUid ? { ...slot, widgetId } : slot,
				),
			);
		});
		setDirty(true);
	};

	const moveWidget = (fromUid: string, targetUid: string) => {
		if (fromUid === targetUid) return;
		setDraftSlots((prev) => {
			const from = prev.find((slot) => slot.uid === fromUid);
			const target = prev.find((slot) => slot.uid === targetUid);
			if (!from || !target || from.widgetId === null) return prev;
			return padDraft(
				prev.map((slot) => {
					if (slot.uid === fromUid)
						return { ...slot, widgetId: target.widgetId };
					if (slot.uid === targetUid)
						return { ...slot, widgetId: from.widgetId };
					return slot;
				}),
			);
		});
		setDirty(true);
	};

	const removeWidget = (uid: string) => {
		setDraftSlots((prev) =>
			padDraft(
				prev.map((slot) =>
					slot.uid === uid ? { ...slot, widgetId: null } : slot,
				),
			),
		);
		setDirty(true);
	};

	const setAsStandard = (widgetId: string) => {
		setStandardIds((prev) =>
			prev.includes(widgetId) ? prev : [...prev, widgetId],
		);
		setDraftSlots((prev) =>
			prev.map((slot) =>
				slot.widgetId === widgetId ? { ...slot, widgetId: null } : slot,
			),
		);
		setSavedSlots((prev) =>
			prev.filter((slot) => slot.widgetId !== widgetId),
		);
	};

	const removeStandard = (widgetId: string) => {
		setStandardIds((prev) => prev.filter((id) => id !== widgetId));
	};

	const hideForTeam = (widgetId: string) => {
		setHiddenIds((prev) =>
			prev.includes(widgetId) ? prev : [...prev, widgetId],
		);
	};

	return {
		mode,
		slots,
		savedAtLabel,
		dirty,
		placedIds,
		libraryItems,
		standardItems,
		standardIds,
		enterEdit,
		exitToView,
		save,
		addWidget,
		dropWidget,
		moveWidget,
		removeWidget,
		setAsStandard,
		removeStandard,
		hideForTeam,
	};
}
