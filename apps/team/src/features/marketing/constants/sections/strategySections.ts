// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { CalendarRange, Wallet } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const STRATEGY_SECTIONS: MarketingSection[] = [
	{
		slug: "marknadsplan",
		titleKey: localizationConstants.marketingSectionPlanTitle,
		descriptionKey: localizationConstants.marketingSectionPlanDesc,
		icon: CalendarRange,
		fields: [
			{ name: "id", labelKey: localizationConstants.marketingFieldIdNumber, type: "text" },
			{ name: "namn", labelKey: localizationConstants.marketingFieldDesignation, type: "text" },
			{ name: "kategori", labelKey: localizationConstants.marketingFieldCategory, type: "select", options: [O.campaign, O.crm, O.event, O.tools, O.content] },
			{ name: "kanal", labelKey: localizationConstants.marketingFieldSourceChannel, type: "text" },
			{ name: "ansvarig", labelKey: localizationConstants.marketingFieldResponsible, type: "text" },
			{ name: "start", labelKey: localizationConstants.marketingFieldStartDate, type: "date" },
			{ name: "slut", labelKey: localizationConstants.marketingFieldEndDate, type: "date" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.planned, O.ongoing, O.sent, O.done, O.paused] },
		],
	},
	{
		slug: "budget",
		titleKey: localizationConstants.marketingSectionBudgetTitle,
		descriptionKey: localizationConstants.marketingSectionBudgetDesc,
		icon: Wallet,
		fields: [
			{ name: "post", labelKey: localizationConstants.marketingFieldBudgetLine, type: "text" },
			{ name: "kanal", labelKey: localizationConstants.marketingFieldChannel, type: "text" },
			{ name: "period", labelKey: localizationConstants.marketingFieldPeriod, type: "text" },
			{ name: "budget", labelKey: localizationConstants.marketingFieldBudgetAmount, type: "number" },
			{ name: "utfall", labelKey: localizationConstants.marketingFieldActualAmount, type: "number" },
			{ name: "ansvarig", labelKey: localizationConstants.marketingFieldResponsible, type: "text" },
		],
	},
];
