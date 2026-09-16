import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { hasLineItems } from "./ataMath";
import type { AtaLineItems, AtaStatus } from "./types";

/**
 * What may happen to an ÄTA in each status. The store enforces these and the
 * UI reads the same reasons, so a disabled control and a refused call always
 * say the same thing.
 */

/** Approved or invoiced: the customer has settled on it, so nothing changes. */
export function isLocked(status: AtaStatus): boolean {
	return status === "ok" || status === "redovisad";
}

/** Redigera, Ändra, documents and Spara. */
export function editBlockReason(status: AtaStatus): TranslationKeys | null {
	return isLocked(status) ? localizationConstants.projectAtaLocked : null;
}

export function deleteBlockReason(status: AtaStatus): TranslationKeys | null {
	return isLocked(status) ? localizationConstants.projectAtaLocked : null;
}

/** Skicka: only a draft that has something to price. A new, unsaved ÄTA counts as a draft. */
export function sendBlockReason(status: AtaStatus, lineItems: AtaLineItems): TranslationKeys | null {
	if (isLocked(status)) return localizationConstants.projectAtaLocked;
	if (status === "forhandling") return localizationConstants.projectAtaAlreadySent;
	if (!hasLineItems(lineItems)) return localizationConstants.projectAtaSendNeedsRows;
	return null;
}
