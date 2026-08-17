import {
	Archive,
	BookOpen,
	FileText,
	HardHat,
	Leaf,
	LayoutList,
	Shield,
	Users,
} from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const KMA_SIDEBAR_NAV_ITEMS: DynamicSubSidebarItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.kmaListSidebarOverview,
		href: "/module/production/kma/overview",
		icon: LayoutList,
	},
	{
		id: "quality",
		labelKey: localizationConstants.kmaListSidebarKvalite,
		href: "/module/production/kma/quality",
		icon: Shield,
	},
	{
		id: "environment",
		labelKey: localizationConstants.kmaListSidebarMiljo,
		href: "/module/production/kma/environment",
		icon: Leaf,
	},
	{
		id: "work-environment",
		labelKey: localizationConstants.kmaListSidebarArbetsmiljo,
		href: "/module/production/kma/work-environment",
		icon: HardHat,
	},
	{
		id: "personnel",
		labelKey: localizationConstants.kmaListSidebarPersonal,
		href: "/module/production/kma/personnel",
		icon: Users,
	},
	{
		id: "policy",
		labelKey: localizationConstants.kmaListSidebarPolicy,
		href: "/module/production/kma/policy",
		icon: BookOpen,
	},
	{
		id: "revisions",
		labelKey: localizationConstants.kmaListSidebarRevisioner,
		href: "/module/production/kma/revisions",
		icon: FileText,
	},
	{
		id: "documents",
		labelKey: localizationConstants.kmaListSidebarDocCenter,
		href: "/module/production/kma/documents",
		icon: FileText,
	},
	{
		id: "archive",
		labelKey: localizationConstants.kmaListSidebarArchive,
		href: "/module/production/kma/archive",
		icon: Archive,
	},
];
