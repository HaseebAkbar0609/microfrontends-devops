import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import type { AdviceCard } from "../types";

export const INSPIRATION_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools },
	{ label: localizationConstants.inspiration },
];

export const ADVICE_CARDS: AdviceCard[] = [
  {
    id: "1",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/155278913/photo/emerald-lake-resort-entrance.jpg?s=612x612&w=0&k=20&c=_-elu-0BUBaa_jrSZdhtU8yq_PMywW0KXG7wsUBcwFA=",
  },
  {
    id: "2",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/153728492/photo/snowbound-cottage.jpg?s=612x612&w=0&k=20&c=lF8TAILIdt-5JXBCWXfvDE8YsLvxi9G5or9quXJIl8Q=",
  },
  {
    id: "3",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/1336614770/photo/idyllic-winter-conditions.jpg?s=612x612&w=0&k=20&c=iSOS4l4y0-m5sTwoRNFAM_mgTmv6XREZfU3_sdkf1Gg=",
  },
  {
    id: "4",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/155278913/photo/emerald-lake-resort-entrance.jpg?s=612x612&w=0&k=20&c=_-elu-0BUBaa_jrSZdhtU8yq_PMywW0KXG7wsUBcwFA=",
  },
  {
    id: "5",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/153728492/photo/snowbound-cottage.jpg?s=612x612&w=0&k=20&c=lF8TAILIdt-5JXBCWXfvDE8YsLvxi9G5or9quXJIl8Q=",
  },
  {
    id: "6",
    title: localizationConstants.inspirationCardTitle,
    excerpt: localizationConstants.inspirationCardExcerpt,
    imageUrl:
      "https://media.istockphoto.com/id/1336614770/photo/idyllic-winter-conditions.jpg?s=612x612&w=0&k=20&c=iSOS4l4y0-m5sTwoRNFAM_mgTmv6XREZfU3_sdkf1Gg=",
  },
];
