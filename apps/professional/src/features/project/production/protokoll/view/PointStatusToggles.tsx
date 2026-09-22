"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { POINT_STATUS_ACTIVE_CLASS, POINT_STATUS_INACTIVE_CLASS } from "../pointStatus";
import { POINT_STATUS_LABELS, POINT_STATUSES } from "../projectProtocol.config";
import type { PointStatus } from "../types";

export interface PointStatusTogglesProps {
	/** The point's Rubrik, so a screen reader knows whose status this is. */
	label: string;
	status: PointStatus | null;
	/** Sets the status — or clears it, when it is the one already set. */
	onSelect: (status: PointStatus) => void;
}

/**
 * An Action point's three status squares, as the frame draws them: Pågående,
 * Klart, Ej klart. Each is a toggle named by its status; the chosen one is
 * filled with its check showing, and pressing it again leaves the point with
 * none. 20px squares 6px apart keep each one's 24px target clear.
 */
export function PointStatusToggles({ label, status, onSelect }: PointStatusTogglesProps) {
	const t = useTranslate();

	return (
		<div role="group" aria-label={t(localizationConstants.projectProtocolPointStatusFor, { label })} className="flex items-center gap-1.5">
			{POINT_STATUSES.map((option) => {
				const active = status === option;
				return (
					<button
						key={option}
						type="button"
						aria-pressed={active}
						aria-label={t(POINT_STATUS_LABELS[option])}
						onClick={() => onSelect(option)}
						className={cn(
							"flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm border focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 focus-visible:outline-none",
							active ? POINT_STATUS_ACTIVE_CLASS[option] : POINT_STATUS_INACTIVE_CLASS[option],
						)}
					>
						<Check className="h-3.5 w-3.5" aria-hidden />
					</button>
				);
			})}
		</div>
	);
}

export default PointStatusToggles;
