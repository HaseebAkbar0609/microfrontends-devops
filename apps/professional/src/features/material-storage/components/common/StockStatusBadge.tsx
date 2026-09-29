import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { STOCK_STATUS_LABELS } from "../../constants/materialStorage.constants";
import type { StockStatus } from "../../types/materialStorage.types";

/** Solid fills as in the Figma stock table. */
const STATUS_CLASSES: Record<StockStatus, string> = {
	inStock: "bg-green-600",
	lowStock: "bg-orange-500",
	outOfStock: "bg-slate-400",
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap",
				STATUS_CLASSES[status],
			)}
		>
			<Translate text={STOCK_STATUS_LABELS[status]} />
		</span>
	);
}
