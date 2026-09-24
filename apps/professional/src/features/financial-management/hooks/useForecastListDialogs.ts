"use client";

import { useCallback, useState } from "react";

import type { ForecastListRow } from "../types/forecastList.types";

export type ForecastListDialogKind = "details" | "delete";

interface ForecastListDialogState {
	kind: ForecastListDialogKind;
	row: ForecastListRow;
	open: boolean;
}

/**
 * Which row's details or delete confirmation is open. Closing keeps the row,
 * so the dialog still has its content while it animates out.
 */
export function useForecastListDialogs() {
	const [dialog, setDialog] = useState<ForecastListDialogState | null>(null);

	/* Opened on the next tick: from the ⋮, Radix would otherwise return focus to
	   the closing menu and can leave `pointer-events: none` on the body. */
	const open = useCallback((kind: ForecastListDialogKind, row: ForecastListRow) => {
		setTimeout(() => setDialog({ kind, row, open: true }), 0);
	}, []);

	const close = useCallback(() => {
		setDialog((prev) => (prev ? { ...prev, open: false } : prev));
	}, []);

	const isOpen = (kind: ForecastListDialogKind) => dialog?.kind === kind && dialog.open;

	return { row: dialog?.row ?? null, kind: dialog?.kind ?? null, isOpen, open, close };
}

export type ForecastListDialogsState = ReturnType<typeof useForecastListDialogs>;
