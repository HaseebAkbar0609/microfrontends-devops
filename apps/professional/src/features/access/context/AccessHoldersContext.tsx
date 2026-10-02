"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACCESS_HOLDERS_MOCK } from "../data/accessItems.mock";
import { ACCESS_ITEM_EXTRAS_MOCK } from "../data/accessItemExtras.mock";
import type { AccessItemExtra, AccessItemExtrasById } from "../types/accessItemDetails.types";
import type { AccessHolder, AccessHoldersByRecord, AccessItemStatusId } from "../types/accessItems.types";
import { EMPTY_ACCESS_ITEM_EXTRA, removeAccessImage } from "../utils/accessItemExtras";
import { removeAccessHolder, removeAccessItem, setAccessItemStatus } from "../utils/accessItems";

interface AccessHoldersValue {
	holdersFor: (recordId: string) => AccessHolder[];
	extraFor: (itemId: string) => AccessItemExtra;
	deleteItem: (recordId: string, itemId: string) => void;
	deleteHolder: (recordId: string, holderId: string) => void;
	setItemStatus: (recordId: string, itemId: string, status: AccessItemStatusId) => void;
	deleteImage: (itemId: string, imageId: string) => void;
}

const AccessHoldersContext = createContext<AccessHoldersValue | null>(null);

/**
 * Holds the people, items and item extras of every access record, so changes on
 * the Access tab and the item page survive moving between them. Mock, and reset
 * on a full page reload.
 */
export function AccessHoldersProvider({ children }: { children: ReactNode }) {
	const [byRecord, setByRecord] = useState<AccessHoldersByRecord>(ACCESS_HOLDERS_MOCK);
	const [extras, setExtras] = useState<AccessItemExtrasById>(ACCESS_ITEM_EXTRAS_MOCK);

	const holdersFor = useCallback((recordId: string) => byRecord[recordId] ?? [], [byRecord]);
	const extraFor = useCallback((itemId: string) => extras[itemId] ?? EMPTY_ACCESS_ITEM_EXTRA, [extras]);
	const deleteItem = useCallback(
		(recordId: string, itemId: string) =>
			setByRecord((current) => ({ ...current, [recordId]: removeAccessItem(current[recordId] ?? [], itemId) })),
		[],
	);
	const deleteHolder = useCallback(
		(recordId: string, holderId: string) =>
			setByRecord((current) => ({ ...current, [recordId]: removeAccessHolder(current[recordId] ?? [], holderId) })),
		[],
	);
	const setItemStatus = useCallback(
		(recordId: string, itemId: string, status: AccessItemStatusId) =>
			setByRecord((current) => ({ ...current, [recordId]: setAccessItemStatus(current[recordId] ?? [], itemId, status) })),
		[],
	);
	const deleteImage = useCallback(
		(itemId: string, imageId: string) => setExtras((current) => removeAccessImage(current, itemId, imageId)),
		[],
	);
	const value = useMemo(
		() => ({ holdersFor, extraFor, deleteItem, deleteHolder, setItemStatus, deleteImage }),
		[holdersFor, extraFor, deleteItem, deleteHolder, setItemStatus, deleteImage],
	);

	return <AccessHoldersContext.Provider value={value}>{children}</AccessHoldersContext.Provider>;
}

export function useAccessHolders(): AccessHoldersValue {
	const value = useContext(AccessHoldersContext);
	if (!value) throw new Error("useAccessHolders must be used inside AccessHoldersProvider");
	return value;
}
