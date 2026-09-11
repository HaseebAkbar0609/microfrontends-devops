import type { CustomerDetails } from "@/lib/validation/contactSchema";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { ProjectInfoField } from "../shared/projectInfoFields";
import type {
	ProjectCompanyDetails,
	ProjectDescriptionDetails,
	ProjectOfferDetails,
} from "./types";

/**
 * The Offert tab's four field blocks.
 *
 * Same shape as `shared/projectInfoFields` — one list per card, so a label
 * cannot drift from the value beside it. `kind` is unused while these cards are
 * read-only; it is carried so an edit dialog could be added without respelling
 * the fields, which is exactly how the Order module's four modals drifted from
 * their cards.
 *
 * Label keys are chosen around three traps in `sv.ts`, where a later spread
 * silently wins: `phoneLabel` resolves to "Telefonnummer" and `typeLabel` to
 * "Type", so `orderTelefonLabel` is used instead; and both `offerNoLabel` and
 * `offerNrLabel` read "Offer nr" — English in the Swedish file — so
 * `orderOffertNrLabel` ("Offert nr") is used.
 */

/** Kunduppgifter, as the offer shows it — four fields, not the record's seven. */
export const OFFER_CUSTOMER_FIELDS: ProjectInfoField<CustomerDetails>[] = [
	{ name: "customer", labelKey: localizationConstants.nameLabel, kind: "text" },
	{ name: "email", labelKey: localizationConstants.orderMailLabel, kind: "text" },
	{
		name: "phone",
		labelKey: localizationConstants.orderTelefonLabel,
		kind: "phone",
	},
	{
		name: "address",
		labelKey: localizationConstants.agreementAddress,
		kind: "text",
	},
];

/**
 * Företagsuppgifter.
 *
 * The frame lists Mail twice; the Order module resolved the same slip by
 * putting the organisation number in that slot, which is what an offer needs.
 */
export const OFFER_COMPANY_FIELDS: ProjectInfoField<ProjectCompanyDetails>[] = [
	{ name: "name", labelKey: localizationConstants.nameLabel, kind: "text" },
	{ name: "email", labelKey: localizationConstants.orderMailLabel, kind: "text" },
	{
		name: "phone",
		labelKey: localizationConstants.orderTelefonLabel,
		kind: "phone",
	},
	{
		name: "address",
		labelKey: localizationConstants.agreementAddress,
		kind: "text",
	},
	{
		name: "orgNo",
		labelKey: localizationConstants.orderOrgPersonNrLabel,
		kind: "text",
	},
];

export const OFFER_DESCRIPTION_FIELDS: ProjectInfoField<ProjectDescriptionDetails>[] =
	[
		{
			name: "projectName",
			labelKey: localizationConstants.projectNameLabel,
			kind: "text",
		},
		{
			name: "workLocation",
			labelKey: localizationConstants.workPlaceLabel,
			kind: "text",
		},
		{
			name: "specifications",
			labelKey: localizationConstants.specificationsLabel,
			kind: "text",
		},
	];

/**
 * The Offert card's seven fields, in the frame's column order: the left column
 * runs number, material, ROT, ROT-settled; the right runs work, total, terms.
 * `rotDeductionSettled` is rendered separately, being a boolean.
 */
export const OFFER_TERM_FIELDS: ProjectInfoField<
	Omit<ProjectOfferDetails, "rotDeductionSettled">
>[] = [
	{
		name: "offerNo",
		labelKey: localizationConstants.orderOffertNrLabel,
		kind: "text",
	},
	{ name: "work", labelKey: localizationConstants.workLabel, kind: "text" },
	{
		name: "material",
		labelKey: localizationConstants.materialLabel,
		kind: "text",
	},
	{
		name: "totalOffer",
		labelKey: localizationConstants.totalOfferLabel,
		kind: "text",
	},
	{
		name: "rotDeductionLabor",
		labelKey: localizationConstants.rotDeductionLabel,
		kind: "text",
	},
	{
		name: "paymentTerms",
		labelKey: localizationConstants.paymentTermsLabel,
		kind: "text",
	},
];

/** The boolean's label, rendered beside the six above. */
export const OFFER_ROT_SETTLED_LABEL: TranslationKeys =
	localizationConstants.rotDeductionSettled;
