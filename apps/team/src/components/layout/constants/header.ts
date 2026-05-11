import {
	PlusSquare,
	FileCheck2,
	TrendingUp,
	Users,
	Bookmark,
	Landmark,
	ShoppingCart,
	FolderKanban,
	ShoppingBag,
	ShieldCheck,
	Truck,
	LayoutDashboard,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

interface AppItem {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface AppGroup {
	category: string;
	items: AppItem[];
}

export const APP_GROUPS: AppGroup[] = [
	{
		category: localizationConstants.moduleBusiness,
		items: [
			// { label: localizationConstants.offer, icon: FileText },
			{ label: localizationConstants.sales, icon: LayoutDashboard },
			{ label: localizationConstants.marketing, icon: PlusSquare },
		],
	},
	{
		category: localizationConstants.moduleOperations,
		items: [
			{ label: localizationConstants.invoice, icon: FileCheck2 },
			{ label: localizationConstants.forecast, icon: TrendingUp },
			{ label: localizationConstants.personnel, icon: Users },
			{ label: localizationConstants.finance, icon: Bookmark },
			{ label: localizationConstants.law, icon: Landmark },
		],
	},
	{
		category: localizationConstants.moduleGovernance,
		items: [
			{ label: localizationConstants.agreement, icon: ShoppingCart },
			{ label: localizationConstants.dataIT, icon: FolderKanban },
			{ label: localizationConstants.templates, icon: ShoppingBag },
			{
				label: localizationConstants.managementSupport,
				icon: ShieldCheck,
			},
			{ label: localizationConstants.kma, icon: Truck },
		],
	},
];
