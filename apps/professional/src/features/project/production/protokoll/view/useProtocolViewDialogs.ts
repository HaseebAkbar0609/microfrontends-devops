"use client";

import { useCallback, useState } from "react";

import type { MeetingPoint } from "../types";

/** Where Avbryt and Ändra lead once unsaved points are dealt with. */
export type ProtocolLeaveTarget = "list" | "edit";

/**
 * Which of the protocol's dialogs is open, and for which point. Only one can be
 * open at a time, so a single value holds it — two confirms never stack.
 */
export type ProtocolViewDialog =
	| { kind: "addPoint" }
	| { kind: "editPoint"; point: MeetingPoint }
	| { kind: "deletePoint"; point: MeetingPoint }
	| { kind: "send" }
	| { kind: "discard"; then: ProtocolLeaveTarget };

export function useProtocolViewDialogs() {
	const [dialog, setDialog] = useState<ProtocolViewDialog | null>(null);

	/* Opened from a row menu, a dialog has to wait for the menu to finish
	   closing: in the same tick Radix leaves `pointer-events: none` on <body>.
	   A timeout, not rAF, which never fires in an occluded page. */
	const open = useCallback((next: ProtocolViewDialog) => {
		setTimeout(() => setDialog(next), 0);
	}, []);

	const close = useCallback(() => setDialog(null), []);

	return { dialog, open, close };
}

export type ProtocolViewDialogState = ReturnType<typeof useProtocolViewDialogs>;
