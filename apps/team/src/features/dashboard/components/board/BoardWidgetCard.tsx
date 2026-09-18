"use client";

import { useState } from "react";
import { Expand, MoreVertical, Move, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { HOME_WIDGETS } from "../../constants";
import type { HomeWidgetId } from "../../types";
import WidgetContent from "./WidgetContent";

interface BoardWidgetCardProps {
	widgetId: HomeWidgetId;
	editMode?: boolean;
	/** Offered in the view only; in edit mode the card is dragged instead. */
	onMove?: () => void;
	onRemove: () => void;
}

/** Shared with the empty slots so the grid rows stay even. */
export const WIDGET_CARD_MIN_HEIGHT_CLASS = "min-h-[281px]";

const MENU_ITEM_CLASS =
	"gap-2 cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700";

const BoardWidgetCard = ({
	widgetId,
	editMode,
	onMove,
	onRemove,
}: BoardWidgetCardProps) => {
	const t = useTranslate();
	const [fullscreenOpen, setFullscreenOpen] = useState(false);
	const widget = HOME_WIDGETS[widgetId];
	const Icon = widget.icon;

	return (
		<div
			className={cn(
				"relative flex h-full flex-col rounded-sm bg-slate-100 px-3 py-3",
				WIDGET_CARD_MIN_HEIGHT_CLASS,
				editMode && "cursor-grab"
			)}
		>
			<div className="flex items-start justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white">
					<Icon size={20} strokeWidth={2} className="text-slate-700" aria-hidden />
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							aria-label={`${t(localizationConstants.widgetBoardOptions)}: ${t(widget.titleKey)}`}
							className="rounded-md p-1 text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
						>
							<MoreVertical size={18} />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-72 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						<DropdownMenuItem
							onClick={() => setFullscreenOpen(true)}
							className={MENU_ITEM_CLASS}
						>
							<Expand className="h-4 w-4 text-slate-600" />
							<Translate text={localizationConstants.widgetBoardOpenFullscreen} />
						</DropdownMenuItem>
						{onMove && (
							<DropdownMenuItem onClick={onMove} className={MENU_ITEM_CLASS}>
								<Move className="h-4 w-4 text-slate-600" />
								<Translate text={localizationConstants.widgetBoardMoveWidget} />
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={onRemove} className={MENU_ITEM_CLASS}>
							<Trash2 className="h-4 w-4 text-slate-600" />
							<Translate text={localizationConstants.widgetBoardRemoveWidget} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="mt-2">
				<h3 className="text-base font-semibold text-slate-900">
					<Translate text={widget.titleKey} />
				</h3>
				<div className="mt-1">
					<WidgetContent body={widget.body} />
				</div>
			</div>

			<Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
				<DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Icon size={20} className="text-slate-700" aria-hidden />
							<Translate text={widget.titleKey} />
						</DialogTitle>
					</DialogHeader>
					<div className="mt-2">
						<WidgetContent body={widget.body} />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default BoardWidgetCard;
