export type OfferPartyStatus = "approved" | "pending" | "cancelled" | "n/a";
export type OfferActionStatus = "active" | "closed";

export interface PartnerOfferRow {
	id: string;
	startDate: string;
	endDate: string;
	offerName: string;
	b2c: OfferPartyStatus;
	b2b: OfferPartyStatus;
	discount: string;
	status: OfferActionStatus;
}

export const DUMMY_PARTNER_OFFERS: PartnerOfferRow[] = [
	{
		id: "offer-1",
		startDate: "2026-01-01",
		endDate: "2026-08-01",
		offerName: "Köksdagar",
		b2c: "approved",
		b2b: "n/a",
		discount: "25 %",
		status: "active",
	},
	{
		id: "offer-2",
		startDate: "2026-01-01",
		endDate: "N/A",
		offerName: "Badrum",
		b2c: "approved",
		b2b: "cancelled",
		discount: "15 %",
		status: "closed",
	},
	{
		id: "offer-3",
		startDate: "2026-01-01",
		endDate: "2026-09-01",
		offerName: "Golv",
		b2c: "pending",
		b2b: "approved",
		discount: "",
		status: "active",
	},
	{
		id: "offer-4",
		startDate: "2026-01-01",
		endDate: "2026-10-31",
		offerName: "Kakeldags",
		b2c: "approved",
		b2b: "approved",
		discount: "20-40 %",
		status: "active",
	},
	{
		id: "offer-5",
		startDate: "2026-01-01",
		endDate: "2026-12-31",
		offerName: "Vitvaror",
		b2c: "approved",
		b2b: "n/a",
		discount: "35 %",
		status: "active",
	},
	{
		id: "offer-6",
		startDate: "2026-01-01",
		endDate: "2026-11-01",
		offerName: "Målning",
		b2c: "approved",
		b2b: "approved",
		discount: "20 %",
		status: "active",
	},
];
