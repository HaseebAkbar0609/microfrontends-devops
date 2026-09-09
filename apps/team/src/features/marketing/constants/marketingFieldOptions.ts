// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import localizationConstants from "@/utils/translation/constants";
import type { MarketingSelectOption } from "../types";

/**
 * Every select value in the module.
 *
 * Rows store the `id`; the UI renders `labelKey`. The prototype stored the
 * Swedish label itself, so switching language would have rewritten saved rows.
 * `tone` is set only where the value is genuinely a status - the prototype
 * tinted every select, so `Ja`, `PNG` and `Marknadschef` looked like statuses.
 */
export const MARKETING_OPTIONS = {
	campaign: { id: "campaign", labelKey: localizationConstants.marketingOptCampaign },
	crm: { id: "crm", labelKey: localizationConstants.marketingOptCrm },
	event: { id: "event", labelKey: localizationConstants.marketingOptEvent },
	tools: { id: "tools", labelKey: localizationConstants.marketingOptTools },
	content: { id: "content", labelKey: localizationConstants.marketingOptContent },
	image: { id: "image", labelKey: localizationConstants.marketingOptImage },
	video: { id: "video", labelKey: localizationConstants.marketingOptVideo },
	pdf: { id: "pdf", labelKey: localizationConstants.marketingOptPdf },
	presentation: { id: "presentation", labelKey: localizationConstants.marketingOptPresentation },
	contract: { id: "contract", labelKey: localizationConstants.marketingOptContract },
	template: { id: "template", labelKey: localizationConstants.marketingOptTemplate },
	product: { id: "product", labelKey: localizationConstants.marketingOptProduct },
	social: { id: "social", labelKey: localizationConstants.marketingOptSocial },
	other: { id: "other", labelKey: localizationConstants.marketingOptOther },
	jpg: { id: "jpg", labelKey: localizationConstants.marketingOptJpg },
	png: { id: "png", labelKey: localizationConstants.marketingOptPng },
	svg: { id: "svg", labelKey: localizationConstants.marketingOptSvg },
	webp: { id: "webp", labelKey: localizationConstants.marketingOptWebp },
	gif: { id: "gif", labelKey: localizationConstants.marketingOptGif },
	commercial: { id: "commercial", labelKey: localizationConstants.marketingOptCommercial },
	productVideo: { id: "productVideo", labelKey: localizationConstants.marketingOptProductVideo },
	tutorial: { id: "tutorial", labelKey: localizationConstants.marketingOptTutorial },
	colour: { id: "colour", labelKey: localizationConstants.marketingOptColour },
	typeface: { id: "typeface", labelKey: localizationConstants.marketingOptTypeface },
	logotype: { id: "logotype", labelKey: localizationConstants.marketingOptLogotype },
	imagery: { id: "imagery", labelKey: localizationConstants.marketingOptImagery },
	icon: { id: "icon", labelKey: localizationConstants.marketingOptIcon },
	googleAnalytics: { id: "googleAnalytics", labelKey: localizationConstants.marketingOptGoogleAnalytics },
	googleSearchConsole: { id: "googleSearchConsole", labelKey: localizationConstants.marketingOptGoogleSearchConsole },
	meta: { id: "meta", labelKey: localizationConstants.marketingOptMeta },
	linkedin: { id: "linkedin", labelKey: localizationConstants.marketingOptLinkedin },
	email: { id: "email", labelKey: localizationConstants.marketingOptEmail },
	otherSource: { id: "otherSource", labelKey: localizationConstants.marketingOptOtherSource },
	tradespeople: { id: "tradespeople", labelKey: localizationConstants.marketingOptTradespeople },
	privateIndividual: { id: "privateIndividual", labelKey: localizationConstants.marketingOptPrivateIndividual },
	high: { id: "high", labelKey: localizationConstants.marketingOptHigh, tone: "danger" },
	medium: { id: "medium", labelKey: localizationConstants.marketingOptMedium, tone: "warning" },
	low: { id: "low", labelKey: localizationConstants.marketingOptLow, tone: "neutral" },
	cmo: { id: "cmo", labelKey: localizationConstants.marketingOptCmo },
	marketingManager: { id: "marketingManager", labelKey: localizationConstants.marketingOptMarketingManager },
	marketingCoordinator: { id: "marketingCoordinator", labelKey: localizationConstants.marketingOptMarketingCoordinator },
	contentLead: { id: "contentLead", labelKey: localizationConstants.marketingOptContentLead },
	performanceManager: { id: "performanceManager", labelKey: localizationConstants.marketingOptPerformanceManager },
	seoSpecialist: { id: "seoSpecialist", labelKey: localizationConstants.marketingOptSeoSpecialist },
	designer: { id: "designer", labelKey: localizationConstants.marketingOptDesigner },
	prCommunication: { id: "prCommunication", labelKey: localizationConstants.marketingOptPrCommunication },
	intern: { id: "intern", labelKey: localizationConstants.marketingOptIntern },
	management: { id: "management", labelKey: localizationConstants.marketingOptManagement },
	digital: { id: "digital", labelKey: localizationConstants.marketingOptDigital },
	design: { id: "design", labelKey: localizationConstants.marketingOptDesign },
	communication: { id: "communication", labelKey: localizationConstants.marketingOptCommunication },
	yes: { id: "yes", labelKey: localizationConstants.marketingOptYes, tone: "positive" },
	no: { id: "no", labelKey: localizationConstants.marketingOptNo, tone: "neutral" },
	privateIndividuals: { id: "privateIndividuals", labelKey: localizationConstants.marketingOptPrivateIndividuals },
	all: { id: "all", labelKey: localizationConstants.marketingOptAll },
	// Added during the port: the prototype recorded any multi-status selection
	// as "Alla", so targeting Lead + Aktiv looked like targeting everyone.
	several: { id: "several", labelKey: localizationConstants.marketingOptSeveral },
	draft: { id: "draft", labelKey: localizationConstants.marketingOptDraft, tone: "neutral" },
	planned: { id: "planned", labelKey: localizationConstants.marketingOptPlanned, tone: "neutral" },
	sent: { id: "sent", labelKey: localizationConstants.marketingOptSent, tone: "info" },
	analytics: { id: "analytics", labelKey: localizationConstants.marketingOptAnalytics },
	advertising: { id: "advertising", labelKey: localizationConstants.marketingOptAdvertising },
	socialTools: { id: "socialTools", labelKey: localizationConstants.marketingOptSocialTools },
	cms: { id: "cms", labelKey: localizationConstants.marketingOptCms },
	ongoing: { id: "ongoing", labelKey: localizationConstants.marketingOptOngoing, tone: "info" },
	completed: { id: "completed", labelKey: localizationConstants.marketingOptCompleted, tone: "positive" },
	cancelled: { id: "cancelled", labelKey: localizationConstants.marketingOptCancelled, tone: "danger" },
	mail: { id: "mail", labelKey: localizationConstants.marketingOptMail },
	sms: { id: "sms", labelKey: localizationConstants.marketingOptSms },
	phoneChannel: { id: "phoneChannel", labelKey: localizationConstants.marketingOptPhoneChannel },
	opened: { id: "opened", labelKey: localizationConstants.marketingOptOpened, tone: "info" },
	registered: { id: "registered", labelKey: localizationConstants.marketingOptRegistered, tone: "positive" },
	declined: { id: "declined", labelKey: localizationConstants.marketingOptDeclined, tone: "danger" },
	noReply: { id: "noReply", labelKey: localizationConstants.marketingOptNoReply, tone: "neutral" },
	idea: { id: "idea", labelKey: localizationConstants.marketingOptIdea, tone: "neutral" },
	planning: { id: "planning", labelKey: localizationConstants.marketingOptPlanning, tone: "info" },
	approved: { id: "approved", labelKey: localizationConstants.marketingOptApproved, tone: "positive" },
	paused: { id: "paused", labelKey: localizationConstants.marketingOptPaused, tone: "warning" },
	aborted: { id: "aborted", labelKey: localizationConstants.marketingOptAborted, tone: "danger" },
	done: { id: "done", labelKey: localizationConstants.marketingOptDone, tone: "positive" },
	prospect: { id: "prospect", labelKey: localizationConstants.marketingOptProspect, tone: "neutral" },
	lead: { id: "lead", labelKey: localizationConstants.marketingOptLead, tone: "info" },
	quoted: { id: "quoted", labelKey: localizationConstants.marketingOptQuoted, tone: "warning" },
	active: { id: "active", labelKey: localizationConstants.marketingOptActive, tone: "positive" },
	inactive: { id: "inactive", labelKey: localizationConstants.marketingOptInactive, tone: "neutral" },
} as const satisfies Record<string, MarketingSelectOption>;

export type MarketingOptionId = keyof typeof MARKETING_OPTIONS;

/** Reads a stored id back to its option, without throwing on unknown values. */
export function findMarketingOption(
	options: readonly MarketingSelectOption[] | undefined,
	id: string,
): MarketingSelectOption | null {
	return options?.find((option) => option.id === id) ?? null;
}
