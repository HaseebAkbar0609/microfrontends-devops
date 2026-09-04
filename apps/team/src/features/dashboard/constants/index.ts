import {
	UserRound,
	Folder,
	ShieldCheck,
	Layers,
	Table2,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

export const dashboardInfoCards = [
	{
		titleKey: localizationConstants.statsTitle,
		lines: [
			localizationConstants.statsLineOne,
			localizationConstants.statsLineTwo,
			localizationConstants.statsLineThree,
		],
		icon: Table2,
	},
	{
		titleKey: localizationConstants.kpiStatusTitle,
		lines: [
			localizationConstants.kpiLineOne,
			localizationConstants.kpiLineTwo,
			localizationConstants.kpiLineThree,
			localizationConstants.kpiLineFour,
		],
		icon: Folder,
	},
	{
		titleKey: localizationConstants.usersTitle,
		lines: [
			localizationConstants.usersLineOne,
			localizationConstants.usersLineTwo,
			localizationConstants.usersLineThree,
			localizationConstants.usersLineFour,
		],
		icon: Table2,
	},
	{
		titleKey: localizationConstants.economyTitle,
		lines: [
			localizationConstants.economyLineOne,
			localizationConstants.economyLineTwo,
		],
		icon: ShieldCheck,
	},
	{
		titleKey: localizationConstants.vehiclesTitle,
		lines: [
			localizationConstants.vehiclesLineOne,
			localizationConstants.vehiclesLineTwo,
			localizationConstants.vehiclesLineThree,
		],
		icon: ShieldCheck,
	},
	{
		titleKey: localizationConstants.keysTitle,
		lines: [
			localizationConstants.keysLineOne,
			localizationConstants.keysLineTwo,
			localizationConstants.keysLineThree,
		],
		icon: UserRound,
	},
];

export const dashboardNewsItems = [
	{
		id: "news-global",
		titleKey: localizationConstants.newsGlobalTitle,
		dateKey: localizationConstants.newsGlobalDate,
		bodyKey: localizationConstants.newsGlobalBody,
	},
	{
		id: "news-sweden",
		titleKey: localizationConstants.newsSwedenTitle,
		dateKey: localizationConstants.newsSwedenDate,
		bodyKey: localizationConstants.newsSwedenBody,
	},
];

export const dashboardMenuItems = [
	{
		id: "menu-economy",
		labelKey: localizationConstants.menuEconomy,
		icon: Layers,
	},
	{
		id: "menu-kpi",
		labelKey: localizationConstants.menuKpiStatus,
		icon: Layers,
	},
	{
		id: "menu-users",
		labelKey: localizationConstants.menuUsers,
		icon: Layers,
	},
	{
		id: "menu-news-global",
		labelKey: localizationConstants.menuNewsGlobal,
		icon: Layers,
	},
	{
		id: "menu-news-sweden",
		labelKey: localizationConstants.menuNewsSweden,
		icon: Layers,
	},
	{
		id: "menu-graph",
		labelKey: localizationConstants.menuGraph,
		icon: Layers,
	},
	{
		id: "menu-image",
		labelKey: localizationConstants.menuImage,
		icon: Layers,
	},
];
