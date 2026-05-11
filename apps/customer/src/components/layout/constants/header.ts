import {
	FileText,
	LayoutGrid,
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
	ClipboardEdit,
	FileSignature,
	FileStack,
	BarChart2,
	Monitor,
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
		category: localizationConstants.businessCategory,
		items: [
			{ label: localizationConstants.offer, icon: FileText },
			{ label: localizationConstants.b2b, icon: LayoutDashboard },
			{ label: localizationConstants.calculation, icon: PlusSquare },
		],
	},
	{
		category: localizationConstants.financialManagementCategory,
		items: [
			{ label: localizationConstants.invoice, icon: FileCheck2 },
			{ label: localizationConstants.forecast, icon: TrendingUp },
			{ label: localizationConstants.personnel, icon: Users },
			{ label: localizationConstants.debtCollection, icon: Bookmark },
			{ label: localizationConstants.law, icon: Landmark },
		],
	},
	{
		category: localizationConstants.productionCategory,
		items: [
			{ label: localizationConstants.order, icon: ShoppingCart },
			{ label: localizationConstants.project, icon: FolderKanban },
			{ label: localizationConstants.purchase, icon: ShoppingBag },
			{ label: localizationConstants.kma, icon: ShieldCheck },
			{ label: localizationConstants.machineVehicle, icon: Truck },
			{ label: localizationConstants.design, icon: ClipboardEdit },
		],
	},
	{
		category: localizationConstants.businessSupportCategory,
		items: [
			{ label: localizationConstants.agreement, icon: FileSignature },
			{ label: localizationConstants.templates, icon: FileStack },
			{ label: localizationConstants.marketingSales, icon: BarChart2 },
			{ label: localizationConstants.dataIT, icon: Monitor },
			{ label: localizationConstants.managementSupport, icon: LayoutGrid },
		],
	},
];
