import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

export const SUPPORT_BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools },
  { label: localizationConstants.support },
];