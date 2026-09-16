"use client";

import { useEffect, useMemo, useState } from "react";
import { getWidgetsAction, syncWidgetsAction } from "@/api-actions/widgets/widgets";
import { useAuthStatus } from "@/context/AuthContext";
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
	location: string,
) {
	const { company } = useAuthStatus();
	const [mode, setMode] = useState<"view" | "edit">("view");
	const [savedSlots, setSavedSlots] = useState<OwnSlot[]>([]);
	const [savedAtLabel, setSavedAtLabel] = useState<string | null>(null);
	const [draftSlots, setDraftSlots] = useState<OwnSlot[]>([]);
	const [dirty, setDirty] = useState(false);
	const [standardIds, setStandardIds] = useState<string[]>(initialStandardIds);
	const [hiddenIds, setHiddenIds] = useState<string[]>([]);
	const [isHydrating, setIsHydrating] = useState(true);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setIsHydrating(false);
			return;
		}
		setIsHydrating(true);
		getWidgetsAction(company.id, location)
			.then((result) => {
				if (cancelled || !result.success || !result.data) return;
				const persistedKeys = result.data
					.sort((a, b) => a.order - b.order)
					.map((widget) => widget.key)
					.filter((key) => allItems.some((item) => item.id === key));
				if (persistedKeys.length === 0) return;
				const persistedStandards = initialStandardIds.filter((key) => persistedKeys.includes(key));
				const ownKeys = persistedKeys.filter((key) => !persistedStandards.includes(key));
				setStandardIds(persistedStandards);
				setSavedSlots(ownKeys.map((key) => makeSlot(key)));
			})
			.finally(() => !cancelled && setIsHydrating(false));
		return () => {
			cancelled = true;
		};
	}, [allItems, company?.id, initialStandardIds, location]);

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

	const save = async () => {
		const trimmed = draftSlots.filter((slot) => slot.widgetId !== null);
		if (company?.id) {
			const keys = [
				...standardIds,
				...trimmed
					.map((slot) => slot.widgetId)
					.filter((key): key is string => key !== null),
			];
			const result = await syncWidgetsAction(
				company.id,
				location,
				keys.map((key, order) => ({ key, order })),
			);
			if (!result.success) return false;
		}
		setSavedSlots(trimmed);
		setSavedAtLabel(
			new Date().toLocaleTimeString("sv-SE", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		);
		exitToView();
		return true;
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

	const beginRemoveWidget = (uid: string) => {
		setDraftSlots(
			padDraft(
				savedSlots.map((slot) =>
					slot.uid === uid ? { ...slot, widgetId: null } : slot,
				),
			),
		);
		setDirty(true);
		setMode("edit");
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
		isHydrating,
		enterEdit,
		exitToView,
		save,
		addWidget,
		dropWidget,
		moveWidget,
		removeWidget,
		beginRemoveWidget,
		setAsStandard,
		removeStandard,
		hideForTeam,
	};
}
