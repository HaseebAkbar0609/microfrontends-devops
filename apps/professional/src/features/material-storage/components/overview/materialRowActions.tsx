import {
	BriefcaseBusiness,
	Download,
	Eye,
	FileText,
	Pencil,
	Receipt,
	ShoppingCart,
	Upload,
	type LucideIcon,
} from "lucide-react";
import type { DataTableAction } from "@/components/table/DataTable";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { MaterialRowAction } from "../../hooks/useMaterialOverviewActions";
import type { MaterialStockRow } from "../../types/materialStorage.types";

interface RowActionItem {
	id: MaterialRowAction;
	label: TranslationKeys;
	icon: LucideIcon;
	separatorBefore?: boolean;
}

/** The ⋮ menu from the Figma frame: stock actions, then a group for adding the article elsewhere. */
const ROW_ACTION_ITEMS: RowActionItem[] = [
	{ id: "view", label: localizationConstants.materialActionView, icon: Eye },
	{ id: "edit", label: localizationConstants.materialActionEdit, icon: Pencil },
	{ id: "receive", label: localizationConstants.materialActionReceive, icon: Download },
	{ id: "withdraw", label: localizationConstants.materialActionWithdraw, icon: Upload },
	{ id: "addToOffer", label: localizationConstants.materialActionAddToOffer, icon: FileText, separatorBefore: true },
	{ id: "addToOrder", label: localizationConstants.materialActionAddToOrder, icon: ShoppingCart },
	{ id: "addToProject", label: localizationConstants.materialActionAddToProject, icon: BriefcaseBusiness },
	{ id: "addToInvoice", label: localizationConstants.materialActionAddToInvoice, icon: Receipt },
];

export function buildMaterialRowActions(
	onAction: (action: MaterialRowAction, row: MaterialStockRow) => void,
): DataTableAction<MaterialStockRow>[] {
	return ROW_ACTION_ITEMS.map(({ id, label, icon: Icon, separatorBefore }) => ({
		label,
		separatorBefore,
		icon: <Icon className="h-4 w-4" aria-hidden />,
		onClick: (row) => onAction(id, row),
	}));
}
