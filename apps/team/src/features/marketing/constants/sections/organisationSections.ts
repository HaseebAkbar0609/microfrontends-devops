// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { Building2, Plug, Users } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const ORGANISATION_SECTIONS: MarketingSection[] = [
	{
		slug: "organisation",
		titleKey: localizationConstants.marketingSectionTeamTitle,
		descriptionKey: localizationConstants.marketingSectionTeamDesc,
		icon: Users,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldName, type: "text" },
			{ name: "roll", labelKey: localizationConstants.marketingFieldRole, type: "select", options: [O.cmo, O.marketingManager, O.marketingCoordinator, O.contentLead, O.performanceManager, O.seoSpecialist, O.designer, O.prCommunication, O.intern] },
			{ name: "team", labelKey: localizationConstants.marketingFieldTeamName, type: "select", options: [O.management, O.campaign, O.content, O.digital, O.design, O.communication] },
			{ name: "ansvarsomrade", labelKey: localizationConstants.marketingFieldAreaOfResponsibility, type: "text", width: "min-w-[220px]" },
			{ name: "epost", labelKey: localizationConstants.marketingFieldEmail, type: "text" },
			{ name: "telefon", labelKey: localizationConstants.marketingFieldPhone, type: "text" },
			{ name: "anstalld", labelKey: localizationConstants.marketingFieldEmployedSince, type: "date" },
			{ name: "sysselsattning", labelKey: localizationConstants.marketingFieldEmploymentRate, type: "number" },
		],
	},
	{
		slug: "byraer",
		titleKey: localizationConstants.marketingSectionAgenciesTitle,
		descriptionKey: localizationConstants.marketingSectionAgenciesDesc,
		icon: Building2,
		fields: [
			{ name: "bolag", labelKey: localizationConstants.marketingFieldFirm, type: "text" },
			{ name: "omrade", labelKey: localizationConstants.marketingFieldAreaOfResponsibility, type: "text" },
			{ name: "kontakt", labelKey: localizationConstants.marketingFieldContactPerson, type: "text" },
			{ name: "epost", labelKey: localizationConstants.marketingFieldEmail, type: "text" },
			{ name: "telefon", labelKey: localizationConstants.marketingFieldPhone, type: "text" },
			{ name: "avtal", labelKey: localizationConstants.marketingFieldContractUntil, type: "date" },
			{ name: "arskostnad", labelKey: localizationConstants.marketingFieldAnnualCost, type: "number" },
		],
	},
	{
		slug: "system",
		titleKey: localizationConstants.marketingSectionSystemsTitle,
		descriptionKey: localizationConstants.marketingSectionSystemsDesc,
		icon: Plug,
		fields: [
			{ name: "system", labelKey: localizationConstants.marketingFieldSystemName, type: "text" },
			{ name: "typ", labelKey: localizationConstants.marketingFieldType, type: "select", options: [O.analytics, O.advertising, O.crm, O.email, O.socialTools, O.design, O.cms] },
			{ name: "konto", labelKey: localizationConstants.marketingFieldAccountLogin, type: "text" },
			{ name: "kostnad", labelKey: localizationConstants.marketingFieldMonthlyCost, type: "number" },
			{ name: "ansvarig", labelKey: localizationConstants.marketingFieldResponsible, type: "text" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldLink, type: "url" },
		],
	},
];
