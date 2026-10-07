import {
	FolderTree,
	Lightbulb,
	LifeBuoy,
	MessageCircleQuestion,
	Newspaper,
	Tags,
	Users,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { ContentSection } from "../types";
import {
	CATEGORY_PARENT_OPTIONS,
	INSPIRATION_TYPE_OPTIONS,
	KUND_FAQ_CATEGORY_OPTIONS,
	PRICE_KIND_OPTIONS,
	PRICE_UNIT_OPTIONS,
} from "./contentFieldOptions";

/** Everything the customer dashboard shows is authored here. */
export const KUND_SECTIONS: ContentSection[] = [
	{
		slug: "inspiration",
		titleKey: localizationConstants.contentSectionInspirationTitle,
		summaryKey: localizationConstants.contentSectionInspirationSummary,
		icon: Lightbulb,
		itemLabelKey: localizationConstants.contentItemPost,
		itemLabelPluralKey: localizationConstants.contentItemPostPlural,
		fields: [
			{
				name: "title",
				labelKey: localizationConstants.contentFieldHeading,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderInspirationTitle,
			},
			{
				name: "type",
				labelKey: localizationConstants.contentFieldType,
				type: "select",
				options: INSPIRATION_TYPE_OPTIONS,
			},
			{ name: "images", labelKey: localizationConstants.contentFieldImages, type: "images" },
			{
				name: "body",
				labelKey: localizationConstants.contentFieldContent,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderArticleBody,
			},
		],
	},
	{
		slug: "fragor-svar",
		titleKey: localizationConstants.contentSectionFaqTitle,
		summaryKey: localizationConstants.contentSectionKundFaqSummary,
		icon: MessageCircleQuestion,
		itemLabelKey: localizationConstants.contentItemQuestion,
		itemLabelPluralKey: localizationConstants.contentItemQuestionPlural,
		fields: [
			{
				name: "question",
				labelKey: localizationConstants.contentFieldQuestion,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderKundQuestion,
			},
			{
				name: "category",
				labelKey: localizationConstants.contentFieldCategory,
				type: "select",
				options: KUND_FAQ_CATEGORY_OPTIONS,
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
		slug: "nyheter",
		titleKey: localizationConstants.contentSectionNewsTitle,
		summaryKey: localizationConstants.contentSectionNewsSummary,
		icon: Newspaper,
		itemLabelKey: localizationConstants.contentItemNews,
		itemLabelPluralKey: localizationConstants.contentItemNewsPlural,
		fields: [
			{
				name: "title",
				labelKey: localizationConstants.contentFieldHeading,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderNewsTitle,
			},
			{ name: "date", labelKey: localizationConstants.contentFieldPublishDate, type: "date" },
			{ name: "images", labelKey: localizationConstants.contentFieldImages, type: "images" },
			{
				name: "body",
				labelKey: localizationConstants.contentFieldText,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderNewsBody,
			},
		],
	},
	{
		slug: "priser",
		titleKey: localizationConstants.contentSectionPricesTitle,
		summaryKey: localizationConstants.contentSectionPricesSummary,
		icon: Tags,
		itemLabelKey: localizationConstants.contentItemPrice,
		itemLabelPluralKey: localizationConstants.contentItemPricePlural,
		fields: [
			{
				name: "name",
				labelKey: localizationConstants.contentFieldDesignation,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderPriceName,
			},
			{
				name: "kind",
				labelKey: localizationConstants.contentFieldType,
				type: "select",
				options: PRICE_KIND_OPTIONS,
			},
			{
				name: "unit",
				labelKey: localizationConstants.contentFieldUnit,
				type: "select",
				options: PRICE_UNIT_OPTIONS,
			},
			{
				name: "price",
				labelKey: localizationConstants.contentFieldPrice,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderPriceValue,
			},
			{
				name: "note",
				labelKey: localizationConstants.contentFieldNote,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderPriceNote,
			},
		],
	},
	{
		slug: "konsulter",
		titleKey: localizationConstants.contentSectionConsultantsTitle,
		summaryKey: localizationConstants.contentSectionConsultantsSummary,
		icon: Users,
		itemLabelKey: localizationConstants.contentItemConsultantType,
		itemLabelPluralKey: localizationConstants.contentItemConsultantTypePlural,
		// Consultant types live on the server; the screen has its own form.
		variant: "consultantTypes",
		fields: [],
	},
	{
		slug: "kategorier",
		titleKey: localizationConstants.contentSectionCategoriesTitle,
		summaryKey: localizationConstants.contentSectionCategoriesSummary,
		icon: FolderTree,
		itemLabelKey: localizationConstants.contentItemCategory,
		itemLabelPluralKey: localizationConstants.contentItemCategoryPlural,
		fields: [
			{
				name: "name",
				labelKey: localizationConstants.contentFieldCategory,
				type: "text",
				placeholderKey: localizationConstants.contentPlaceholderCategoryName,
			},
			{
				name: "parent",
				labelKey: localizationConstants.contentFieldParentCategory,
				type: "select",
				options: CATEGORY_PARENT_OPTIONS,
			},
			{
				name: "desc",
				labelKey: localizationConstants.contentFieldDescription,
				type: "textarea",
				placeholderKey: localizationConstants.contentPlaceholderCategoryDescription,
			},
		],
	},
	{
		slug: "support",
		titleKey: localizationConstants.contentSectionSupportTitle,
		summaryKey: localizationConstants.contentSectionKundSupportSummary,
		icon: LifeBuoy,
		itemLabelKey: localizationConstants.contentItemGuideSection,
		itemLabelPluralKey: localizationConstants.contentItemGuideSectionPlural,
		variant: "support",
		fields: [],
	},
];
