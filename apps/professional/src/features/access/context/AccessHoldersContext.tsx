"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACCESS_HOLDERS_MOCK } from "../data/accessItems.mock";
import type { AccessHolder, AccessHoldersByRecord } from "../types/accessItems.types";
import { removeAccessHolder, removeAccessItem } from "../utils/accessItems";

interface AccessHoldersValue {
	holdersFor: (recordId: string) => AccessHolder[];
	deleteItem: (recordId: string, itemId: string) => void;
	deleteHolder: (recordId: string, holderId: string) => void;
}

const AccessHoldersContext = createContext<AccessHoldersValue | null>(null);

/**
 * Holds the people and items of every access record, so deleting on the Access
 * tab survives opening an item and coming back. Mock, and reset on a full page reload.
 */
export function AccessHoldersProvider({ children }: { children: ReactNode }) {
	const [byRecord, setByRecord] = useState<AccessHoldersByRecord>(ACCESS_HOLDERS_MOCK);

	const holdersFor = useCallback((recordId: string) => byRecord[recordId] ?? [], [byRecord]);
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
	const value = useMemo(() => ({ holdersFor, deleteItem, deleteHolder }), [holdersFor, deleteItem, deleteHolder]);

	return <AccessHoldersContext.Provider value={value}>{children}</AccessHoldersContext.Provider>;
}

export function useAccessHolders(): AccessHoldersValue {
	const value = useContext(AccessHoldersContext);
	if (!value) throw new Error("useAccessHolders must be used inside AccessHoldersProvider");
	return value;
}
