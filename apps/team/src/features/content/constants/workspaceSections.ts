import { LifeBuoy, Megaphone, MessageCircleQuestion } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { ContentSection } from "../types";
import {
	DOWNTIME_OPTIONS,
	WORKSPACE_FAQ_CATEGORY_OPTIONS,
} from "./contentFieldOptions";

/** Content shown to tradespeople in their workspace. */
export const WORKSPACE_SECTIONS: ContentSection[] = [
	{
		slug: "fragor-svar",
		titleKey: localizationConstants.contentSectionFaqTitle,
		summaryKey: localizationConstants.contentSectionWorkspaceFaqSummary,
		icon: MessageCircleQuestion,
		itemLabelKey: localizationConstants.contentItemQuestion,
		itemLabelPluralKey: localizationConstants.contentItemQuestionPlural,
		fields: [
			{
				name: "question",
				labelKey: localizationConstants.contentFieldQuestion,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderWorkspaceQuestion,
			},
			{
				name: "category",
				labelKey: localizationConstants.contentFieldCategory,
				type: "select",
				options: WORKSPACE_FAQ_CATEGORY_OPTIONS,
			},
			{
				name: "answer",
				labelKey: localizationConstants.contentFieldAnswer,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderAnswer,
			},
		],
	},
	{
		slug: "support",
		titleKey: localizationConstants.contentSectionSupportTitle,
		summaryKey: localizationConstants.contentSectionWorkspaceSupportSummary,
		icon: LifeBuoy,
		itemLabelKey: localizationConstants.contentItemGuideSection,
		itemLabelPluralKey: localizationConstants.contentItemGuideSectionPlural,
		variant: "support",
		guideMedia: true,
		fields: [],
	},
	{
		slug: "uppdateringar",
		titleKey: localizationConstants.contentSectionUpdatesTitle,
		summaryKey: localizationConstants.contentSectionUpdatesSummary,
		icon: Megaphone,
		itemLabelKey: localizationConstants.contentItemAnnouncement,
		itemLabelPluralKey: localizationConstants.contentItemAnnouncementPlural,
		fields: [
			{
				name: "title",
				labelKey: localizationConstants.contentFieldHeading,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderUpdateTitle,
			},
			{
				name: "release",
				labelKey: localizationConstants.contentFieldPlannedRelease,
				type: "date",
			},
			{
				name: "downtime",
				labelKey: localizationConstants.contentFieldDowntime,
				type: "select",
				options: DOWNTIME_OPTIONS,
			},
			{
				name: "window",
				labelKey: localizationConstants.contentFieldDowntimeWindow,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderDowntimeWindow,
			},
			{
				name: "body",
				labelKey: localizationConstants.contentFieldDescription,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderUpdateBody,
			},
		],
	},
];
