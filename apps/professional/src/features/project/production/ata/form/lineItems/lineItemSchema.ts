import { z } from "zod";

import { generateTempId } from "@/lib/tempId";
import localizationConstants from "@/utils/translation/constants";
import { parseQuantity, parseWholeKronor } from "../../ataMath";
import { ATA_LINE_LIMITS, ATA_PARTY_REQUIRED, type AtaSectionKind } from "../../projectAta.config";
import type { AtaLineItem } from "../../types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const PERCENT = /^\d{1,3}$/;

const isPercent = (value: string) => PERCENT.test(value.trim()) && Number(value) <= ATA_LINE_LIMITS.percent;

const bounded = (max: number) => z.string().trim().max(max, localizationConstants.projectAtaTooLong);

/**
 * A row as the Ändra dialog edits it: every field a string, so a half-typed
 * "7," is still a value the reader can finish. Messages are translation keys.
 * The party is required and named for the section — Person or Leverantör.
 */
export function lineItemDraftSchema(kind: AtaSectionKind) {
	return z.object({
		id: z.string().min(1),
		date: z.string().regex(ISO_DATE, localizationConstants.projectAtaDateRequired),
		party: bounded(ATA_LINE_LIMITS.shortText).min(1, ATA_PARTY_REQUIRED[kind]),
		resourceNo: bounded(ATA_LINE_LIMITS.resourceNo),
		description: bounded(ATA_LINE_LIMITS.description),
		quantity: z.string().refine((value) => {
			const quantity = parseQuantity(value);
			return quantity !== null && quantity <= ATA_LINE_LIMITS.quantity;
		}, localizationConstants.projectAtaQuantityInvalid),
		invoiceNo: bounded(ATA_LINE_LIMITS.invoiceNo),
		unit: bounded(ATA_LINE_LIMITS.unit),
		netPrice: z.string().refine((value) => {
			const price = parseWholeKronor(value);
			return price !== null && price <= ATA_LINE_LIMITS.netPrice;
		}, localizationConstants.projectAtaAmountInvalid),
		markupPercent: z.string().refine(isPercent, localizationConstants.projectAtaPercentInvalid),
		secondaryPercent: z
			.string()
			.refine((value) => value.trim() === "" || isPercent(value), localizationConstants.projectAtaPercentInvalid),
		activity: bounded(ATA_LINE_LIMITS.shortText),
		location: bounded(ATA_LINE_LIMITS.shortText),
	});
}

export type LineItemDraft = z.infer<ReturnType<typeof lineItemDraftSchema>>;

export function toDraft(item: AtaLineItem): LineItemDraft {
	return {
		...item,
		quantity: String(item.quantity),
		netPrice: String(item.netPrice),
		markupPercent: String(item.markupPercent),
		secondaryPercent: item.secondaryPercent === null ? "" : String(item.secondaryPercent),
	};
}

/** A new row: dated today, one unit, no påslag yet. */
export function blankDraft(today: string): LineItemDraft {
	return {
		id: generateTempId(),
		date: today,
		party: "",
		resourceNo: "",
		description: "",
		quantity: "1",
		invoiceNo: "",
		unit: "",
		netPrice: "",
		markupPercent: "0",
		secondaryPercent: "",
		activity: "",
		location: "",
	};
}

/** Call on a validated draft only; the fallbacks never apply to one. */
export function toLineItem(draft: LineItemDraft, kind: AtaSectionKind): AtaLineItem {
	return {
		...draft,
		quantity: parseQuantity(draft.quantity) ?? 0,
		netPrice: parseWholeKronor(draft.netPrice) ?? 0,
		markupPercent: Number(draft.markupPercent),
		secondaryPercent: draft.secondaryPercent.trim() === "" ? null : Number(draft.secondaryPercent),
		invoiceNo: kind === "staff" ? "" : draft.invoiceNo,
	};
}
