import type { CustomerDetails } from "@/lib/validation/contactSchema";

/** A purchase hangs off either an order or a project. */
export type PurchaseObjectLinkType = "order" | "project";

/**
 * The "Objekt" card. `reference*` is the order or the project depending on the
 * link type, which only changes the labels — the shape is the same either way.
 */
export interface PurchaseObjectDetails {
	referenceNo: string;
	referenceName: string;
	blockName: string;
	address: string;
	postalCode: string;
	city: string;
	/** Mirror the object address into the delivery block. */
	deliverySameAsObject: boolean;
	deliveryAddress: string;
	deliveryPostalCode: string;
	deliveryCity: string;
}

export interface CreatePurchaseObjectFormData {
	linkType: PurchaseObjectLinkType;
	/** Selected value of the "Koppla inköp" dropdown. */
	linkedTo: string;
	customer: CustomerDetails;
	object: PurchaseObjectDetails;
}

/** Read-only reference numbers shown in the right-hand Information card. */
export interface PurchaseInfoPanelData {
	purchaseNo: string;
	referenceNo: string;
	offerNo: string;
	calculationNo: string;
}
