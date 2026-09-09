// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { Crosshair, FileBarChart, Search } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const INSIGHT_SECTIONS: MarketingSection[] = [
	{
		slug: "rapporter",
		titleKey: localizationConstants.marketingSectionReportsTitle,
		descriptionKey: localizationConstants.marketingSectionReportsDesc,
		icon: FileBarChart,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldReport, type: "text" },
			{ name: "kalla", labelKey: localizationConstants.marketingFieldSource, type: "select", options: [O.googleAnalytics, O.googleSearchConsole, O.meta, O.linkedin, O.email, O.otherSource] },
			{ name: "period", labelKey: localizationConstants.marketingFieldPeriod, type: "text" },
			{ name: "besokare", labelKey: localizationConstants.marketingFieldVisitors, type: "number" },
			{ name: "konverteringar", labelKey: localizationConstants.marketingFieldConversions, type: "number" },
			{ name: "konvgrad", labelKey: localizationConstants.marketingFieldConversionRate, type: "number" },
			{ name: "resultat", labelKey: localizationConstants.marketingFieldCommentResult, type: "text", width: "min-w-[220px]" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldReportLink, type: "url" },
			{ name: "sparad", labelKey: localizationConstants.marketingFieldSavedDate, type: "date" },
		],
	},
	{
		slug: "seo",
		titleKey: localizationConstants.marketingSectionSeoTitle,
		descriptionKey: localizationConstants.marketingSectionSeoDesc,
		icon: Search,
		fields: [
			{ name: "sokord", labelKey: localizationConstants.marketingFieldKeyword, type: "text" },
			{ name: "kategori", labelKey: localizationConstants.marketingFieldCategory, type: "select", options: [O.tradespeople, O.privateIndividual] },
			{ name: "volym", labelKey: localizationConstants.marketingFieldSearchVolume, type: "number" },
			{ name: "position", labelKey: localizationConstants.marketingFieldPosition, type: "number" },
			{ name: "svarighet", labelKey: localizationConstants.marketingFieldDifficulty, type: "number" },
			{ name: "sida", labelKey: localizationConstants.marketingFieldLandingPage, type: "text" },
			{ name: "prioritet", labelKey: localizationConstants.marketingFieldPriority, type: "select", options: [O.high, O.medium, O.low] },
		],
	},
	{
		slug: "konkurrenter",
		titleKey: localizationConstants.marketingSectionCompetitorsTitle,
		descriptionKey: localizationConstants.marketingSectionCompetitorsDesc,
		icon: Crosshair,
		fields: [
			{ name: "bolag", labelKey: localizationConstants.marketingFieldFirm, type: "text" },
			{ name: "webb", labelKey: localizationConstants.marketingFieldWebsite, type: "url" },
			{ name: "segment", labelKey: localizationConstants.marketingFieldSegment, type: "text" },
			{ name: "styrka", labelKey: localizationConstants.marketingFieldStrength, type: "text", width: "min-w-[220px]" },
			{ name: "svaghet", labelKey: localizationConstants.marketingFieldWeakness, type: "text", width: "min-w-[220px]" },
			{ name: "bevakning", labelKey: localizationConstants.marketingFieldLastReviewed, type: "date" },
		],
	},
];
