/**
 * Shared Type=Line tab styling. Rule 3 of the tab navigation guideline requires
 * secondary tabs to use the SAME component and SAME line style as the primary
 * row, so both `ModuleTabs` and `SectionTabs` render with these classes.
 */
export const TAB_LIST_CLASS =
  "h-auto w-full justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0 -mb-px no-scrollbar";

export const TAB_TRIGGER_CLASS =
  "flex-none cursor-pointer rounded-none px-0 pb-3 text-sm font-medium whitespace-nowrap text-slate-500 hover:text-slate-800 data-[state=active]:font-semibold data-[state=active]:text-slate-900";
