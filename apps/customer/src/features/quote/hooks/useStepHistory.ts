"use client";

import { useEffect, useRef } from "react";

const STEP_HISTORY_KEY = "offerStep";
const INDEX_HISTORY_KEY = "offerIndex";

/**
 * Mirrors the wizard step in browser history, so the browser Back button moves between
 * steps instead of leaving the form; the form stays mounted, so what was typed is kept.
 * Next.js copies its router state into these entries, so popstate does not remount the page.
 *
 * Each entry also carries its position in the wizard, so the wizard's own Back arrow can
 * go back through history instead of pushing a new entry (TFS-1208).
 */
export function useStepHistory(
	currentStep: number,
	setStep: (step: number) => void,
	furthestStep: number,
) {
	const indexRef = useRef(0);
	const furthestRef = useRef(furthestStep);
	useEffect(() => {
		furthestRef.current = furthestStep;
	}, [furthestStep]);

	useEffect(() => {
		const onPopState = (event: PopStateEvent) => {
			const step: unknown = event.state?.[STEP_HISTORY_KEY];
			// Ignore entries from an earlier visit (after Send, Cancel or a refresh the form is new)
			if (typeof step !== "number" || step > furthestRef.current) return;
			const index: unknown = event.state?.[INDEX_HISTORY_KEY];
			indexRef.current = typeof index === "number" ? index : 0;
			setStep(step);
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [setStep]);

	/** Show a step as a new history entry */
	function pushStep(step: number) {
		// Tag the entry being left here, since Next.js may have rewritten its state meanwhile
		window.history.replaceState(
			{ [STEP_HISTORY_KEY]: currentStep, [INDEX_HISTORY_KEY]: indexRef.current },
			"",
		);
		indexRef.current += 1;
		window.history.pushState(
			{ [STEP_HISTORY_KEY]: step, [INDEX_HISTORY_KEY]: indexRef.current },
			"",
		);
		setStep(step);
	}

	/** Go to the previous step the way the browser Back button would */
	function stepBack() {
		if (indexRef.current > 0) {
			window.history.back();
		} else {
			// First wizard entry (e.g. a resumed draft opened on a later step)
			pushStep(currentStep - 1);
		}
	}

	return { pushStep, stepBack };
}
