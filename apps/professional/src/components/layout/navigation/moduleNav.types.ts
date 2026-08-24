import type { TranslationKeys } from "@/utils/translation/constants";

/**
 * One entry in a tab row. Replaces the near-identical item shapes that used to
 * live in DynamicSubSidebar, projectNav.config and orderNav.config.
 */
export interface ModuleTabItem {
  id: string;
  /** Translation key, resolved through `Translate`. Preferred over `label`. */
  labelKey?: TranslationKeys;
  /** Literal label, for values that are not translatable (e.g. a record number). */
  label?: string;
  href: string;
  /** Match the pathname exactly instead of also matching nested routes. */
  exact?: boolean;
}

export function isModuleTabActive(
  item: ModuleTabItem,
  pathname: string
): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Most-specific match wins: when several hrefs are prefixes of the pathname
 * (e.g. `/module/production/order` and `/module/production/order/overview`),
 * the longest one is the active tab.
 */
export function findActiveModuleTab(
  items: ModuleTabItem[],
  pathname: string
): ModuleTabItem | undefined {
  return items
    .filter((item) => isModuleTabActive(item, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
