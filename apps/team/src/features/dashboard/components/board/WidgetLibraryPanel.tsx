"use client";

import { useState } from "react";
import { PanelRightClose, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { HOME_WIDGETS } from "../../constants";
import { HOME_WIDGET_IDS } from "../../constants/dashboard.constants";
import type { HomeWidgetId } from "../../types";
import LibraryRow from "./LibraryRow";

interface WidgetLibraryPanelProps {
	placedIds: HomeWidgetId[];
	onAdd: (widgetId: HomeWidgetId) => void;
	onCollapse: () => void;
	onRowDrag: (clientX: number, clientY: number) => void;
	onRowDrop: (widgetId: HomeWidgetId, clientX: number, clientY: number) => void;
	onRowDragEnd: () => void;
}

const WidgetLibraryPanel = ({
	placedIds,
	onAdd,
	onCollapse,
	onRowDrag,
	onRowDrop,
	onRowDragEnd,
}: WidgetLibraryPanelProps) => {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	const term = search.trim().toLowerCase();
	const visibleIds = HOME_WIDGET_IDS.filter(
		(id) => term === "" || t(HOME_WIDGETS[id].titleKey).toLowerCase().includes(term)
	);

	return (
		<aside
			aria-label={t(localizationConstants.widgetBoardLibraryTitle)}
			className="w-full rounded-md border border-slate-200 bg-white p-4 lg:w-[320px] lg:shrink-0"
		>
			<div className="flex items-start justify-between">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.widgetBoardLibraryTitle} />
					</h2>
					<p className="mt-0.5 text-xs text-slate-500">
						<Translate text={localizationConstants.widgetBoardLibraryHint} />
					</p>
				</div>
				<button
					type="button"
					onClick={onCollapse}
					aria-label={t(localizationConstants.widgetBoardHideLibrary)}
					className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
				>
					<PanelRightClose size={16} />
				</button>
			</div>

			<div className="relative mt-3">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
				<Input
					type="search"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder={t(localizationConstants.widgetBoardSearchWidget)}
					aria-label={t(localizationConstants.widgetBoardSearchWidget)}
					className="h-9 rounded-md border-slate-200 pl-9 text-sm 2xl:h-9"
				/>
			</div>

			<div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
				<Translate text={localizationConstants.widgetBoardAllWidgets} />
				<span>{HOME_WIDGET_IDS.length}</span>
			</div>
			{visibleIds.length === 0 ? (
				<p className="px-2 py-3 text-sm text-slate-500">
					<Translate text={localizationConstants.widgetBoardNoMatches} />
				</p>
			) : (
				<ul className="mt-1">
					{visibleIds.map((id) => (
						<LibraryRow
							key={id}
							widgetId={id}
							added={placedIds.includes(id)}
							onAdd={onAdd}
							onDrag={onRowDrag}
							onDrop={onRowDrop}
							onDragEnd={onRowDragEnd}
						/>
					))}
				</ul>
			)}

			<p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
				<Translate text={localizationConstants.widgetBoardLibraryFooter} />
			</p>
		</aside>
	);
};

export default WidgetLibraryPanel;
