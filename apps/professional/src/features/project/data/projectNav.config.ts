import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
  type TranslationKeys,
} from "@/utils/translation/constants";

export const PROJECT_MODULE_BASE_URL = "/module/production/project";

/** Module title shown as the H1 on every page of the Project module (rule 1). */
export const PROJECT_MODULE_TITLE = localizationConstants.projectModule;

/** `Home > Project > Section` breadcrumb for Project list/overview pages. */
export function projectBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
  return [
    { label: localizationConstants.home, href: "/dashboard" },
    {
      label: localizationConstants.projectModule,
      href: PROJECT_MODULE_BASE_URL,
    },
    { label: section },
  ];
}

/** Primary tab row for the Project module. */
export const PROJECT_MODULE_TABS: ModuleTabItem[] = [
  {
    id: "project-dashboard",
    labelKey: localizationConstants.projectSubDashboard,
    href: "/module/production/project",
    exact: true,
  },
  {
    id: "project-overview",
    labelKey: localizationConstants.projectSubOverview,
    href: "/module/production/project/overview",
  },
  {
    id: "project-economy",
    labelKey: localizationConstants.projectEconomicOverview,
    href: "/module/production/project/economy",
  },
  {
    id: "project-warranty",
    labelKey: localizationConstants.projectWarrantyCommitments,
    href: "/module/production/project/warranty",
  },
  {
    id: "project-archive",
    labelKey: localizationConstants.projectArchive,
    href: "/module/production/project/archive",
  },
];
