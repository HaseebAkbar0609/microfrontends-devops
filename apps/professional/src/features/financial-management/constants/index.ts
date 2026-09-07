import { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";

export const financialNavItems: RouteTabItem[] = [
	{
		id: "invoice",
		labelKey: localizationConstants.invoice,
		href: "/module/financial-management/invoice",
	},
	{
		id: "economy",
		labelKey: localizationConstants.economy,
		href: "/module/financial-management/economy",
	},
	{
		id: "forecast",
		labelKey: localizationConstants.forecast,
		href: "/module/financial-management/forecast",
	},
	{
		id: "rot-rut",
		labelKey: localizationConstants.rotRutNav,
		href: "/module/financial-management/rot-rut",
	},
	{
		id: "personnel",
		labelKey: localizationConstants.personnel,
		href: "/module/financial-management/personnel",
	},
	{
		id: "law",
		labelKey: localizationConstants.law,
		href: "/module/financial-management/law",
	},
	{
		id: "debt-collection",
		labelKey: localizationConstants.debtCollection,
		href: "/module/financial-management/debt-collection",
	},
];

export const financialSidebarItems = financialNavItems;
