// Generated for TFS-990 from the Marketing Hub Deluxe prototype. Edit by hand.

import { FolderOpen, Image, Mail, Palette, Video } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { MarketingSection } from "../../types";
import { MARKETING_OPTIONS as O } from "../marketingFieldOptions";

export const CONTENT_SECTIONS: MarketingSection[] = [
	{
		slug: "dokument",
		titleKey: localizationConstants.marketingSectionDocumentsTitle,
		descriptionKey: localizationConstants.marketingSectionDocumentsDesc,
		icon: FolderOpen,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldFileName, type: "text" },
			{ name: "typ", labelKey: localizationConstants.marketingFieldType, type: "select", options: [O.image, O.video, O.pdf, O.presentation, O.contract, O.template] },
			{ name: "kategori", labelKey: localizationConstants.marketingFieldCategory, type: "text" },
			{ name: "uppdaterad", labelKey: localizationConstants.marketingFieldUpdated, type: "date" },
			{ name: "agare", labelKey: localizationConstants.marketingFieldOwner, type: "text" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldLink, type: "url" },
		],
	},
	{
		slug: "bilder",
		titleKey: localizationConstants.marketingSectionImagesTitle,
		descriptionKey: localizationConstants.marketingSectionImagesDesc,
		icon: Image,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldImageName, type: "text" },
			{ name: "kategori", labelKey: localizationConstants.marketingFieldCategory, type: "select", options: [O.campaign, O.product, O.event, O.social, O.other] },
			{ name: "format", labelKey: localizationConstants.marketingFieldFormat, type: "select", options: [O.jpg, O.png, O.svg, O.webp, O.gif] },
			{ name: "uppdaterad", labelKey: localizationConstants.marketingFieldUpdated, type: "date" },
			{ name: "agare", labelKey: localizationConstants.marketingFieldOwner, type: "text" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldLink, type: "url" },
		],
	},
	{
		slug: "videor",
		titleKey: localizationConstants.marketingSectionVideosTitle,
		descriptionKey: localizationConstants.marketingSectionVideosDesc,
		icon: Video,
		fields: [
			{ name: "namn", labelKey: localizationConstants.marketingFieldVideoName, type: "text" },
			{ name: "kategori", labelKey: localizationConstants.marketingFieldCategory, type: "select", options: [O.commercial, O.productVideo, O.tutorial, O.event, O.social, O.other] },
			{ name: "langd", labelKey: localizationConstants.marketingFieldDurationSeconds, type: "number" },
			{ name: "uppdaterad", labelKey: localizationConstants.marketingFieldUpdated, type: "date" },
			{ name: "agare", labelKey: localizationConstants.marketingFieldOwner, type: "text" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldLink, type: "url" },
		],
	},
	{
		slug: "profil",
		titleKey: localizationConstants.marketingSectionBrandTitle,
		descriptionKey: localizationConstants.marketingSectionBrandDesc,
		icon: Palette,
		fields: [
			{ name: "element", labelKey: localizationConstants.marketingFieldElement, type: "text" },
			{ name: "typ", labelKey: localizationConstants.marketingFieldType, type: "select", options: [O.colour, O.typeface, O.logotype, O.imagery, O.icon] },
			{ name: "varde", labelKey: localizationConstants.marketingFieldValue, type: "text" },
			{ name: "anvandning", labelKey: localizationConstants.marketingFieldUsage, type: "text", width: "min-w-[220px]" },
			{ name: "lank", labelKey: localizationConstants.marketingFieldFiles, type: "url" },
		],
	},
	{
		slug: "maillistor",
		titleKey: localizationConstants.marketingSectionMailListsTitle,
		descriptionKey: localizationConstants.marketingSectionMailListsDesc,
		icon: Mail,
		fields: [
			{ name: "lista", labelKey: localizationConstants.marketingFieldListName, type: "text" },
			{ name: "segment", labelKey: localizationConstants.marketingFieldSegment, type: "text" },
			{ name: "antal", labelKey: localizationConstants.marketingFieldRecipients, type: "number" },
			{ name: "oppning", labelKey: localizationConstants.marketingFieldOpenRate, type: "number" },
			{ name: "klick", labelKey: localizationConstants.marketingFieldClickRate, type: "number" },
			{ name: "senast", labelKey: localizationConstants.marketingFieldLastSend, type: "date" },
		],
	},
];
