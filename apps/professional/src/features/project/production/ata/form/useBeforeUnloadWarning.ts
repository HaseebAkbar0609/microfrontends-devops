"use client";

import { useEffect } from "react";

/**
 * Asks before a reload or closed tab drops unsaved changes. In-app links cannot
 * be intercepted this way — the App Router has no navigation guard.
 */
export function useBeforeUnloadWarning(active: boolean): void {
	useEffect(() => {
		if (!active) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [active]);
}
