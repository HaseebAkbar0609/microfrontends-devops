import type { WithdrawalLinkType } from "../types/materialTransaction.types";

// Only type imports here: tests/material-withdrawal.test.cjs runs this file on its own.

interface WithdrawalLinkRules {
	/** Välj order / projekt / faktura is shown and, to withdraw, required. */
	hasTarget: boolean;
	hasWorkStep: boolean;
	/** Utpris is shown and the material is valued at it; otherwise at its purchase price. */
	hasSalesPrice: boolean;
	/** The "Lägg till materialet som fakturarad" checkbox decides whether the customer is charged. */
	invoiceLineOptional: boolean;
	/** Whether the customer is charged when there is no checkbox. */
	charged: boolean;
}

/** What each "Koppla till" choice shows and means. */
export const WITHDRAWAL_LINK_RULES: Record<WithdrawalLinkType, WithdrawalLinkRules> = {
	order: { hasTarget: true, hasWorkStep: false, hasSalesPrice: true, invoiceLineOptional: true, charged: true },
	project: { hasTarget: true, hasWorkStep: true, hasSalesPrice: true, invoiceLineOptional: true, charged: true },
	invoice: { hasTarget: true, hasWorkStep: false, hasSalesPrice: true, invoiceLineOptional: false, charged: true },
	internal: { hasTarget: false, hasWorkStep: false, hasSalesPrice: false, invoiceLineOptional: false, charged: false },
};

/** "Debiteras kund": an invoice always charges, internal use never, an order or project if the checkbox is ticked. */
export function isChargedToCustomer(linkType: WithdrawalLinkType, addInvoiceLine: boolean): boolean {
	const rules = WITHDRAWAL_LINK_RULES[linkType];
	return rules.invoiceLineOptional ? addInvoiceLine : rules.charged;
}

/** "Materialvärde": at Utpris when the link has one, at purchase price for internal use. Null until it can be worked out. */
export function withdrawalValue(
	linkType: WithdrawalLinkType,
	quantity: number | null,
	salesPrice: number | null,
	purchasePrice: number | null,
): number | null {
	const price = WITHDRAWAL_LINK_RULES[linkType].hasSalesPrice ? salesPrice : purchasePrice;
	if (quantity === null || price === null) return null;
	return Math.round(quantity * price * 100) / 100;
}
