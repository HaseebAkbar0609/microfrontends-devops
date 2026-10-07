"use client";

import { useEffect } from "react";

/**
 * Asks the browser to confirm a refresh, tab close or leaving the site while the form
 * has unsaved input. The offer is only saved on Save or Send (TFS-1208), so this is the
 * last guard against losing it. In-app links are not covered by the browser prompt.
 */
export function useUnsavedChangesWarning(isDirty: boolean) {
	useEffect(() => {
		if (!isDirty) return;
		const warn = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [isDirty]);
}
