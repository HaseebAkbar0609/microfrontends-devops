"use client";

import { useRef, useState } from "react";
import Draggable, { type DraggableEvent } from "react-draggable";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { HOME_WIDGETS } from "../../constants";
import type { HomeWidgetId } from "../../types";

interface LibraryRowProps {
	widgetId: HomeWidgetId;
	added: boolean;
	onAdd: (widgetId: HomeWidgetId) => void;
	onDrag: (clientX: number, clientY: number) => void;
	onDrop: (widgetId: HomeWidgetId, clientX: number, clientY: number) => void;
	onDragEnd: () => void;
}

const LibraryRow = ({
	widgetId,
	added,
	onAdd,
	onDrag,
	onDrop,
	onDragEnd,
}: LibraryRowProps) => {
	const t = useTranslate();
	const nodeRef = useRef<HTMLLIElement>(null);
	const [dragKey, setDragKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const widget = HOME_WIDGETS[widgetId];
	const Icon = widget.icon;
	const label = t(widget.titleKey);

	return (
		<Draggable
			key={dragKey}
			nodeRef={nodeRef as React.RefObject<HTMLElement>}
			disabled={added}
			cancel="button"
			onStart={() => setIsDragging(true)}
			onDrag={(event: DraggableEvent) => {
				const { clientX, clientY } = event as MouseEvent;
				if (clientX !== undefined) onDrag(clientX, clientY);
			}}
			onStop={(event: DraggableEvent) => {
				setIsDragging(false);
				onDragEnd();
				const { clientX, clientY } = event as MouseEvent;
				if (clientX !== undefined) onDrop(widgetId, clientX, clientY);
				setDragKey((key) => key + 1);
			}}
		>
			<li
				ref={nodeRef}
				className={cn(
					"relative flex items-center gap-2 rounded-md px-2 py-2",
					isDragging
						? "z-[9999] cursor-grabbing bg-slate-900 text-white shadow-2xl [&_*]:!text-white"
						: added
							? "opacity-60"
							: "cursor-grab hover:bg-slate-50"
				)}
			>
				<GripVertical size={14} className="text-slate-300" aria-hidden />
				<Icon size={16} className="text-slate-600" aria-hidden />
				<span className="flex-1 text-sm text-slate-800">{label}</span>
				{added ? (
					<span className="text-xs text-slate-400">
						<Translate text={localizationConstants.widgetBoardAdded} />
					</span>
				) : (
					<button
						type="button"
						onClick={() => onAdd(widgetId)}
						aria-label={`${label}: ${t(localizationConstants.widgetBoardAddToDashboard)}`}
						className="rounded-md p-1 text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
					>
						<Plus size={15} />
					</button>
				)}
			</li>
		</Draggable>
	);
};

export default LibraryRow;
