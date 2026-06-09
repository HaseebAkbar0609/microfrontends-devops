import { BreadcrumbItem } from "@/types/user";
import { GuideFolder } from "../types";
import localizationConstants from "@/utils/translation/constants";

export const GUIDE_FOLDERS: GuideFolder[] = [
	 {
    title: localizationConstants.guideQuoteAndConsultants,
    count: 5,
    defaultOpen: true,
    items: [
      {
        id: "offert",
        label: localizationConstants.guideQuote,
        count: 2,
        active: true,
      },
      {
        id: "konsult",
        label: localizationConstants.guideConsultant,
        count: 3,
      },
    ],
  },
  {
    title: localizationConstants.guideMyProjects,
    count: 8,
    defaultOpen: false,
    items: [
      {
        id: "projekthantering",
        label: localizationConstants.guideProjectManagement,
        count: 3,
      },
      {
        id: "arkiverade-projekt",
        label: localizationConstants.guideArchivedProjects,
        count: 3,
      },
    ],
  },
  {
    title: localizationConstants.guideServicesAndOffers,
  },
  {
    title: localizationConstants.guideSupportAndTools,
  },
  {
    title: localizationConstants.guideSettings,
  },
];

export const SUPPORT_BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools },
  { label: localizationConstants.support },
];