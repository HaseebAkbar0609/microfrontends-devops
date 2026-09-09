// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { Hammer, Send, UserRound } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const CONTACT_SECTIONS: MarketingSection[] = [
	{
		slug: "hantverkare",
		titleKey: localizationConstants.marketingSectionTradespeopleTitle,
		descriptionKey: localizationConstants.marketingSectionTradespeopleDesc,
		icon: Hammer,
		fields: [
			{ name: "foretag", labelKey: localizationConstants.marketingFieldCompany, type: "text" },
			{ name: "orgnr", labelKey: localizationConstants.marketingFieldOrgNumber, type: "text" },
			{ name: "bransch", labelKey: localizationConstants.marketingFieldIndustry, type: "text" },
			{ name: "ort", labelKey: localizationConstants.marketingFieldCity, type: "text" },
			{ name: "kontakt", labelKey: localizationConstants.marketingFieldContactPerson, type: "text" },
			{ name: "epost", labelKey: localizationConstants.marketingFieldEmail, type: "text" },
			{ name: "telefon", labelKey: localizationConstants.marketingFieldPhone, type: "text" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.prospect, O.lead, O.quoted, O.active, O.inactive] },
			{ name: "nyhetsbrev", labelKey: localizationConstants.marketingFieldNewsletterOptIn, type: "select", options: [O.yes, O.no] },
			{ name: "senast", labelKey: localizationConstants.marketingFieldLastContact, type: "date" },
		],
	},
	{
		slug: "privatpersoner",
		titleKey: localizationConstants.marketingSectionPrivateCustomersTitle,
		descriptionKey: localizationConstants.marketingSectionPrivateCustomersDesc,
		icon: UserRound,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldName, type: "text" },
			{ name: "epost", labelKey: localizationConstants.marketingFieldEmail, type: "text" },
			{ name: "telefon", labelKey: localizationConstants.marketingFieldPhone, type: "text" },
			{ name: "ort", labelKey: localizationConstants.marketingFieldCity, type: "text" },
			{ name: "intresse", labelKey: localizationConstants.marketingFieldInterestArea, type: "text" },
			{ name: "kalla", labelKey: localizationConstants.marketingFieldSource, type: "text" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.prospect, O.lead, O.quoted, O.active, O.inactive] },
			{ name: "nyhetsbrev", labelKey: localizationConstants.marketingFieldNewsletterOptIn, type: "select", options: [O.yes, O.no] },
			{ name: "senast", labelKey: localizationConstants.marketingFieldLastContact, type: "date" },
		],
	},
	{
		slug: "nyhetsbrevsutskick",
		titleKey: localizationConstants.marketingSectionSendoutsTitle,
		descriptionKey: localizationConstants.marketingSectionSendoutsDesc,
		icon: Send,
		fields: [
			{ name: "rubrik", labelKey: localizationConstants.marketingFieldHeading, type: "text" },
			{ name: "innehall", labelKey: localizationConstants.marketingFieldBody, type: "textarea", width: "min-w-[220px]" },
			{ name: "malgrupp", labelKey: localizationConstants.marketingFieldAudience, type: "select", options: [O.tradespeople, O.privateIndividuals, O.all] },
			{ name: "segment", labelKey: localizationConstants.marketingFieldSegment, type: "select", options: [O.all, O.several, O.prospect, O.lead, O.quoted, O.active, O.inactive] },
			{ name: "datum", labelKey: localizationConstants.marketingFieldSendDate, type: "date" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.draft, O.planned, O.sent] },
			{ name: "mottagare", labelKey: localizationConstants.marketingFieldRecipients, type: "number" },
			{ name: "oppning", labelKey: localizationConstants.marketingFieldOpenRate, type: "number" },
			{ name: "ansvarig", labelKey: localizationConstants.marketingFieldResponsible, type: "text" },
		],
	},
];
