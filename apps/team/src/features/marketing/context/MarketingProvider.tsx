"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { MARKETING_ROWS_SEED } from "../constants/marketingRows.mock";
import type {
	MarketingContextValue,
	MarketingRow,
	MarketingRowValues,
	MarketingRowsBySection,
} from "../types";
import { createRowId } from "../utils/rowFactories";

export const MarketingContext = createContext<MarketingContextValue | null>(
	null,
);

const EMPTY_ROWS: MarketingRow[] = [];

/**
 * Holds the marketing registers for the length of the session.
 *
 * The prototype persisted everything — including contact names, e-mail
 * addresses and phone numbers — to `localStorage` under an unnamespaced key.
 * AGENTS.md §6 rules that out, and a session store also matches
 * `SalesCrmProvider`, `SupportProvider` and `ContentProvider`.
 */
export function MarketingProvider({ children }: { children: ReactNode }) {
	const [rows, setRows] = useState<MarketingRowsBySection>(MARKETING_ROWS_SEED);

	const getRows = useCallback(
		(sectionKey: string) => rows[sectionKey] ?? EMPTY_ROWS,
		[rows],
	);

	const addRow = useCallback(
		(sectionKey: string, values: MarketingRowValues) => {
			setRows((previous) => ({
				...previous,
				[sectionKey]: [
					{ id: createRowId(), values },
					...(previous[sectionKey] ?? []),
				],
			}));
		},
		[],
	);

	const updateRow = useCallback(
		(sectionKey: string, rowId: string, values: MarketingRowValues) => {
			setRows((previous) => ({
				...previous,
				[sectionKey]: (previous[sectionKey] ?? []).map((row) =>
					row.id === rowId ? { ...row, values } : row,
				),
			}));
		},
		[],
	);

	const removeRow = useCallback((sectionKey: string, rowId: string) => {
		setRows((previous) => ({
			...previous,
			[sectionKey]: (previous[sectionKey] ?? []).filter(
				(row) => row.id !== rowId,
			),
		}));
	}, []);

	const value = useMemo<MarketingContextValue>(
		() => ({ getRows, addRow, updateRow, removeRow }),
		[getRows, addRow, updateRow, removeRow],
	);

	return (
		<MarketingContext.Provider value={value}>
			{children}
		</MarketingContext.Provider>
	);
}
