import localizationConstants from "@/utils/translation/constants";

export interface ProjectSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
	exact?: boolean;
}

export interface ProjectGoToItem {
	id: string;
	title: string;
	href: string;
}

export const PROJECT_SUB_SIDEBAR_ITEMS: ProjectSubSidebarItem[] = [
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

export const PROJECT_GOTO_ITEMS: ProjectGoToItem[] = [
	{
		id: "5001",
		title: "Projekt nr 5001",
		href: "/module/production/project/5001",
	},
	{
		id: "5000-002",
		title: "Project 5000-002",
		href: "/module/production/project/5000-002",
	},
];
