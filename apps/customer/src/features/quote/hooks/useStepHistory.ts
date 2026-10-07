"use client";

import { useEffect } from "react";

const STEP_HISTORY_KEY = "offerStep";

/**
 * Mirrors the wizard step in browser history, so the browser Back button moves between
 * steps instead of leaving the form; the form stays mounted, so what was typed is kept.
 * Next.js copies its router state into these entries, so popstate does not remount the page.
 */
export function useStepHistory(
	currentStep: number,
	setStep: (step: number) => void,
) {
	useEffect(() => {
		const onPopState = (event: PopStateEvent) => {
			const step: unknown = event.state?.[STEP_HISTORY_KEY];
			if (typeof step === "number") setStep(step);
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [setStep]);

	/** Show a step as a new history entry */
	return function pushStep(step: number) {
		// Tag the entry being left here, since Next.js may have rewritten its state meanwhile
		window.history.replaceState({ [STEP_HISTORY_KEY]: currentStep }, "");
		window.history.pushState({ [STEP_HISTORY_KEY]: step }, "");
		setStep(step);
	};
}
