import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

export const KMA_MODULE_BASE_URL = "/module/production/kma";

/** Module title shown as the H1 on every page of the KMA module (rule 1). */
export const KMA_MODULE_TITLE = localizationConstants.kma;

/** `Home > KMA > Section` breadcrumb for KMA list/overview pages. */
export function kmaBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
  return [
    { label: localizationConstants.home, href: "/dashboard" },
    { label: localizationConstants.kma, href: KMA_MODULE_BASE_URL },
    { label: section },
  ];
}

/** Primary tab row for the KMA module. */
export const KMA_MODULE_TABS: ModuleTabItem[] = [
  {
    id: "dashboard",
    labelKey: localizationConstants.kmaDashboardTitle,
    href: KMA_MODULE_BASE_URL,
    exact: true,
  },
  {
    id: "overview",
    labelKey: localizationConstants.kmaListSidebarOverview,
    href: "/module/production/kma/overview",
  },
  {
    id: "quality",
    labelKey: localizationConstants.kmaListSidebarKvalite,
    href: "/module/production/kma/quality",
  },
  {
    id: "environment",
    labelKey: localizationConstants.kmaListSidebarMiljo,
    href: "/module/production/kma/environment",
  },
  {
    id: "work-environment",
    labelKey: localizationConstants.kmaListSidebarArbetsmiljo,
    href: "/module/production/kma/work-environment",
  },
  {
    id: "personnel",
    labelKey: localizationConstants.kmaListSidebarPersonal,
    href: "/module/production/kma/personnel",
  },
  {
    id: "policy",
    labelKey: localizationConstants.kmaListSidebarPolicy,
    href: "/module/production/kma/policy",
  },
  {
    id: "revisions",
    labelKey: localizationConstants.kmaListSidebarRevisioner,
    href: "/module/production/kma/revisions",
  },
  {
    id: "documents",
    labelKey: localizationConstants.kmaListSidebarDocCenter,
    href: "/module/production/kma/documents",
  },
  {
    id: "archive",
    labelKey: localizationConstants.kmaListSidebarArchive,
    href: "/module/production/kma/archive",
  },
];
