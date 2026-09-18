"use client";

import { LayoutGrid, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

/** Shown in the view when every widget has been removed from the board. */
const BoardEmptyState = ({ onAddWidgets }: { onAddWidgets: () => void }) => (
	<div className="flex flex-col items-center rounded-md border-2 border-dashed border-slate-200 px-6 py-16 text-center">
		<div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100">
			<LayoutGrid size={22} className="text-slate-600" aria-hidden />
		</div>
		<h2 className="mt-4 text-lg font-semibold text-slate-900">
			<Translate text={localizationConstants.widgetBoardBuildTitle} />
		</h2>
		<p className="mt-2 max-w-xl text-sm text-slate-500">
			<Translate text={localizationConstants.widgetBoardBuildBody} />
		</p>
		<Button
			type="button"
			onClick={onAddWidgets}
			className="mt-5 h-10 gap-2 rounded-md bg-slate-900 px-4 text-sm text-white hover:bg-slate-900/90"
		>
			<SquarePlus className="h-4 w-4" />
			<Translate text={localizationConstants.widgetBoardAddWidgets} />
		</Button>
		<p className="mt-3 text-xs text-slate-400">
			<Translate text={localizationConstants.widgetBoardBuildHint} />
		</p>
	</div>
);

export default BoardEmptyState;
