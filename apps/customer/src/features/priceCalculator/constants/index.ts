import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "/priceCalculator" },
	{ label: localizationConstants.priceCalculatorTabExamples },
];

export const PRICE_CALCULATOR_TABS_LIST_CLASS =
	"flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10";

export const PRICE_CALCULATOR_TAB_TRIGGER_CLASS =
	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";
