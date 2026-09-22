"use client";

import { Info } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { POINT_STATUS_SWATCH_CLASS } from "../pointStatus";
import { POINT_STATUS_LABELS, POINT_STATUS_LEGEND_ORDER } from "../projectProtocol.config";

const M = localizationConstants;

/* The table's other headers use SortableHead, whose classes it keeps to itself. */
const HEAD = "h-12 px-3 text-sm font-medium whitespace-nowrap text-slate-500 lg:px-4";

/**
 * "Välj status ⓘ" — the Action points' status column. The ⓘ opens the frame's
 * dark legend: "Välj en", then each status beside its colour. The legend
 * renders in a portal, so the scrolling table never clips it.
 */
export function PointStatusHead() {
	const t = useTranslate();
	const legend = t(M.projectProtocolStatusLegend);

	return (
		<TableHead className={HEAD}>
			<span className="inline-flex items-center gap-1">
				<Translate text={M.protocolPointColStatus} />
				<Popover>
					<PopoverTrigger asChild>
						<button
							type="button"
							aria-label={legend}
							className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
						>
							<Info className="h-4 w-4" aria-hidden />
						</button>
					</PopoverTrigger>
					<PopoverContent align="start" aria-label={legend} className="w-40 border-slate-900 bg-slate-900 p-3 text-white">
						<p className="mb-2 text-xs font-medium">
							<Translate text={M.protocolPointStatusPick} />
						</p>
						<ul className="flex flex-col gap-1.5">
							{POINT_STATUS_LEGEND_ORDER.map((status) => (
								<li key={status} className="flex items-center gap-2 text-xs">
									<span aria-hidden className={cn("h-2.5 w-2.5 rounded-sm", POINT_STATUS_SWATCH_CLASS[status])} />
									<Translate text={POINT_STATUS_LABELS[status]} />
								</li>
							))}
						</ul>
					</PopoverContent>
				</Popover>
			</span>
		</TableHead>
	);
}

export default PointStatusHead;
