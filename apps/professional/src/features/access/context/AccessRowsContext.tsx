"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACCESS_POINTS_MOCK } from "../data/accessPoints.mock";
import type { AccessPoint } from "../types/access.types";

interface AccessRowsValue {
	rows: AccessPoint[];
	archive: (id: string) => void;
	remove: (id: string) => void;
}

const AccessRowsContext = createContext<AccessRowsValue | null>(null);

/**
 * Holds the access rows for everything under /module/production/access, so
 * archiving or deleting a row on the list survives opening a record and coming
 * back. The rows are mock and still reset on a full page reload.
 */
export function AccessRowsProvider({ children }: { children: ReactNode }) {
	const [rows, setRows] = useState<AccessPoint[]>(ACCESS_POINTS_MOCK);

	const archive = useCallback(
		(id: string) => setRows((current) => current.map((row) => (row.id === id ? { ...row, archived: true } : row))),
		[],
	);
	const remove = useCallback((id: string) => setRows((current) => current.filter((row) => row.id !== id)), []);
	const value = useMemo(() => ({ rows, archive, remove }), [rows, archive, remove]);

	return <AccessRowsContext.Provider value={value}>{children}</AccessRowsContext.Provider>;
}

export function useAccessRows(): AccessRowsValue {
	const value = useContext(AccessRowsContext);
	if (!value) throw new Error("useAccessRows must be used inside AccessRowsProvider");
	return value;
}
