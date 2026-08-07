import {
	Cog,
	FolderKanban,
	KeyRound,
	Package,
	Palette,
	ShieldCheck,
	ShoppingBag,
	ShoppingCart,
	Truck,
} from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const productionSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "project",
		labelKey: localizationConstants.project,
		href: "/module/production/project",
		icon: FolderKanban,
	},
	{
		id: "order",
		labelKey: localizationConstants.order,
		href: "/module/production/order",
		icon: ShoppingCart,
	},
	{
		id: "purchase",
		labelKey: localizationConstants.purchase,
		href: "/module/production/purchase",
		icon: ShoppingBag,
	},
	{
		id: "design",
		labelKey: localizationConstants.design,
		href: "/module/production/design",
		icon: Palette,
	},
	{
		id: "kma",
		labelKey: localizationConstants.kma,
		href: "/module/production/kma",
		icon: ShieldCheck,
	},
	{
		id: "material-storage",
		labelKey: localizationConstants.materialStorage,
		href: "/module/production/material-storage",
		icon: Package,
	},
	{
		id: "machine",
		labelKey: localizationConstants.machine,
		href: "/module/production/machine",
		icon: Cog,
	},
	{
		id: "vehicle",
		labelKey: localizationConstants.vehicle,
		href: "/module/production/vehicle",
		icon: Truck,
	},
	{
		id: "access",
		labelKey: localizationConstants.access,
		href: "/module/production/access",
		icon: KeyRound,
	},
];
