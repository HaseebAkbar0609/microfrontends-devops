import localizationConstants from "@/utils/translation/constants";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	Clock,
	Folder,
	LayoutList,
	Search,
	Shield,
	UserCheck,
} from "lucide-react";

export const AGREEMENT_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "agreementKpi",
		label: localizationConstants.agreementWidgetKpiTitle,
		icon: Folder,
	},
	{
		id: "agreementActive",
		label: localizationConstants.agreementWidgetActiveTitle,
		icon: LayoutList,
	},
	{
		id: "agreementExpiring",
		label: localizationConstants.agreementWidgetExpiringTitle,
		icon: Clock,
	},
	{
		id: "agreementPending",
		label: localizationConstants.agreementWidgetPendingTitle,
		icon: Shield,
	},
	{
		id: "agreementSupplier",
		label: localizationConstants.agreementWidgetSupplierTitle,
		icon: UserCheck,
	},
	{
		id: "agreementSearch",
		label: localizationConstants.agreementWidgetSearchTitle,
		icon: Search,
	},
];
