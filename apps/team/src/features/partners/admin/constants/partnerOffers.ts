import type { OfferPartyStatus, PartnerOfferRow } from "@/features/partners/dashboard/constants/offers";

/** Sales channels an offer is approved for separately. */
export type OfferChannel = Extract<keyof PartnerOfferRow, "b2c" | "b2b">;
/** Decisions a reviewer can make on one channel of an offer. */
export type OfferDecision = Extract<OfferPartyStatus, "approved" | "cancelled">;

/** Mock offers keyed by partner id from DUMMY_PARTNER_REGISTER; a partner without an entry has no offers. */
export const DUMMY_OFFERS_BY_PARTNER: Record<string, PartnerOfferRow[]> = {
	"partner-1": [
		{
			id: "partner-1-offer-1",
			startDate: "2026-03-01",
			endDate: "2026-05-31",
			offerName: "Vårkampanj",
			b2c: "approved",
			b2b: "approved",
			discount: "20 %",
			status: "active",
		},
		{
			id: "partner-1-offer-2",
			startDate: "2026-06-01",
			endDate: "2026-06-30",
			offerName: "Verktygsveckan",
			b2c: "pending",
			b2b: "approved",
			discount: "15 %",
			status: "active",
		},
	],
	"partner-2": [
		{
			id: "partner-2-offer-1",
			startDate: "2026-01-01",
			endDate: "2026-08-01",
			offerName: "Köksdagar",
			b2c: "n/a",
			b2b: "cancelled",
			discount: "25 %",
			status: "closed",
		},
	],
	"partner-3": [
		{
			id: "partner-3-offer-1",
			startDate: "2026-01-01",
			endDate: "2026-09-01",
			offerName: "Golv",
			b2c: "pending",
			b2b: "pending",
			discount: "",
			status: "active",
		},
		{
			id: "partner-3-offer-2",
			startDate: "2026-04-01",
			endDate: "2026-04-30",
			offerName: "Parkettveckan",
			b2c: "pending",
			b2b: "n/a",
			discount: "10 %",
			status: "active",
		},
	],
	"partner-4": [
		{
			id: "partner-4-offer-1",
			startDate: "2026-02-01",
			endDate: "2026-12-31",
			offerName: "Hemförsäkring",
			b2c: "n/a",
			b2b: "pending",
			discount: "5 %",
			status: "active",
		},
	],
	"partner-5": [
		{
			id: "partner-5-offer-1",
			startDate: "2026-01-01",
			endDate: "2026-11-01",
			offerName: "Målning",
			b2c: "approved",
			b2b: "n/a",
			discount: "20 %",
			status: "closed",
		},
	],
};
