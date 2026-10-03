import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_ITEM_STATUS_CLASSES, ACCESS_ITEM_STATUS_LABELS } from "../../constants/accessItems.constants";
import type { AccessItemStatusId } from "../../types/accessItems.types";

export function AccessItemStatusBadge({ status }: { status: AccessItemStatusId }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap",
				ACCESS_ITEM_STATUS_CLASSES[status],
			)}
		>
			<Translate text={ACCESS_ITEM_STATUS_LABELS[status]} />
		</span>
	);
}
