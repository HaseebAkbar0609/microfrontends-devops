import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_STATUS_CLASSES, ACCESS_STATUS_LABELS } from "../constants/access.constants";
import type { AccessStatusId } from "../types/access.types";

export function AccessStatusBadge({ status }: { status: AccessStatusId }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap",
				ACCESS_STATUS_CLASSES[status],
			)}
		>
			<Translate text={ACCESS_STATUS_LABELS[status]} />
		</span>
	);
}
