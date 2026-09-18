import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import {
	DISCOUNT_STATUS_BADGE_CLASSES,
	DISCOUNT_STATUS_LABELS,
} from "../constants";
import type { DiscountStatus } from "../types/discount.types";

interface DiscountStatusBadgeProps {
	status: DiscountStatus;
	className?: string;
}

export function DiscountStatusBadge({
	status,
	className,
}: DiscountStatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
				DISCOUNT_STATUS_BADGE_CLASSES[status],
				className,
			)}
		>
			<Translate text={DISCOUNT_STATUS_LABELS[status]} />
		</span>
	);
}
