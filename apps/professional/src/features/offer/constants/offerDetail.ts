export const OFFER_STATUSES = ["request", "quoted", "accepted", "agreed", "archived"] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];
