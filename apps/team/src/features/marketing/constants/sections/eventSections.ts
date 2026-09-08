// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { CalendarDays, PartyPopper, Ticket } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const EVENT_SECTIONS: MarketingSection[] = [
	{
		slug: "eventkalender",
		titleKey: localizationConstants.marketingSectionEventCalendarTitle,
		descriptionKey: localizationConstants.marketingSectionEventCalendarDesc,
		icon: CalendarDays,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldEventName, type: "text" },
			{ name: "datum", labelKey: localizationConstants.marketingFieldDate, type: "date" },
			{ name: "plats", labelKey: localizationConstants.marketingFieldLocation, type: "text" },
			{ name: "tema", labelKey: localizationConstants.marketingFieldTheme, type: "text" },
			{ name: "malgrupp", labelKey: localizationConstants.marketingFieldAudience, type: "text" },
			{ name: "ansvarig", labelKey: localizationConstants.marketingFieldResponsible, type: "text" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.planned, O.ongoing, O.completed, O.cancelled] },
		],
	},
	{
		slug: "eventinbjudningar",
		titleKey: localizationConstants.marketingSectionEventInvitesTitle,
		descriptionKey: localizationConstants.marketingSectionEventInvitesDesc,
		icon: Ticket,
		fields: [
			{ name: "event", labelKey: localizationConstants.marketingFieldEvent, type: "text" },
			{ name: "mottagare", labelKey: localizationConstants.marketingFieldRecipients, type: "text" },
			{ name: "typ", labelKey: localizationConstants.marketingFieldType, type: "select", options: [O.email, O.mail, O.sms, O.phoneChannel] },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.sent, O.opened, O.registered, O.declined, O.noReply] },
			{ name: "skickat", labelKey: localizationConstants.marketingFieldSent, type: "date" },
			{ name: "svar", labelKey: localizationConstants.marketingFieldReplyComment, type: "text", width: "min-w-[220px]" },
		],
	},
	{
		slug: "eventprospekt",
		titleKey: localizationConstants.marketingSectionEventProspectsTitle,
		descriptionKey: localizationConstants.marketingSectionEventProspectsDesc,
		icon: PartyPopper,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldProspectName, type: "text" },
			{ name: "datum", labelKey: localizationConstants.marketingFieldDate, type: "date" },
			{ name: "budget", labelKey: localizationConstants.marketingFieldBudgetAmount, type: "number" },
			{ name: "plats", labelKey: localizationConstants.marketingFieldLocation, type: "text" },
			{ name: "tema", labelKey: localizationConstants.marketingFieldTheme, type: "text" },
			{ name: "samarbetspartner", labelKey: localizationConstants.marketingFieldPartner, type: "text" },
			{ name: "program", labelKey: localizationConstants.marketingFieldProgramme, type: "textarea", width: "min-w-[220px]" },
			{ name: "status", labelKey: localizationConstants.marketingFieldStatus, type: "select", options: [O.idea, O.planning, O.approved, O.paused, O.aborted] },
		],
	},
];
