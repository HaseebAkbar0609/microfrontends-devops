/**
 * Shared Type=Line tab styling. Rule 3 of the tab navigation guideline requires
 * secondary tabs to use the SAME component and SAME line style as the primary
 * row, so both `ModuleTabs` and `SectionTabs` render with these classes.
 */
export const TAB_LIST_CLASS =
  "h-[36px] w-full justify-start gap-1 sm:gap-2 overflow-x-auto rounded-none bg-transparent p-0 -mb-px no-scrollbar";

export const TAB_TRIGGER_CLASS =
  "relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap text-slate-500 hover:text-slate-900 data-[state=active]:text-slate-950 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[3px] data-[state=active]:after:bg-slate-950 transition-colors";
