"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

type DraftRowActionsProps = {
	index: number;
	count: number;
	/** Names the row in the buttons' accessible labels, e.g. "Avsnitt 2". */
	itemLabel: string;
	removeLabelKey: TranslationKeys;
	onMove: (from: number, to: number) => void;
	onRemove: () => void;
	className?: string;
};

/** Move up, move down and remove for one row of a draft list. */
export function DraftRowActions({
	index,
	count,
	itemLabel,
	removeLabelKey,
	onMove,
	onRemove,
	className,
}: DraftRowActionsProps) {
	const t = useTranslate();

	return (
		<div className={cn("flex shrink-0 items-center gap-0.5", className)}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label={`${t(localizationConstants.contentConsultantTypeMoveUp)}: ${itemLabel}`}
				disabled={index === 0}
				onClick={() => onMove(index, index - 1)}
				className="size-8"
			>
				<ArrowUp className="size-4" aria-hidden />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label={`${t(localizationConstants.contentConsultantTypeMoveDown)}: ${itemLabel}`}
				disabled={index === count - 1}
				onClick={() => onMove(index, index + 1)}
				className="size-8"
			>
				<ArrowDown className="size-4" aria-hidden />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label={`${t(removeLabelKey)}: ${itemLabel}`}
				onClick={onRemove}
				className="size-8 text-slate-500 hover:text-red-600"
			>
				<Trash2 className="size-4" aria-hidden />
			</Button>
		</div>
	);
}

export default DraftRowActions;
