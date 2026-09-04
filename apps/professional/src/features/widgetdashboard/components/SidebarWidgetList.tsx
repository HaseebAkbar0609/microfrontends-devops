import React from "react";
import { MoveVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SIDEBAR_ITEMS } from "../constants";
import { DraggableSidebarItem, WidgetItem } from "./DraggableSidebarItem";

interface SidebarWidgetListProps {
	selectedItem: string;
	onSelectItem: (id: string) => void;
	onSidebarDrop: (item: WidgetItem, clientX: number, clientY: number) => void;
	dropZoneRef: React.RefObject<HTMLDivElement | null>;
	onSidebarDrag: (clientX: number, clientY: number) => void;
	onDragEnd: () => void;
	placedSidebarIds: string[];
	sidebarItems?: WidgetItem[];
	header?: React.ReactNode;
}

export const SidebarWidgetList = ({
	selectedItem,
	onSelectItem,
	onSidebarDrop,
	dropZoneRef,
	onSidebarDrag,
	onDragEnd,
	placedSidebarIds,
	sidebarItems = SIDEBAR_ITEMS,
	header,
}: SidebarWidgetListProps) => (
	<Card className="shadow-none bg-slate-50 p-4">
		{header ?? (
			<div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
				<span className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.widgetPanelOpenClosed} />
				</span>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
				>
					<MoveVertical size={16} />
				</button>
			</div>
		)}
		<CardContent className="p-0 py-1 space-y-1">
			{sidebarItems.map((item) => (
				<DraggableSidebarItem
					key={item.id}
					item={item}
					isActive={selectedItem === item.id}
					onClick={() => onSelectItem(item.id)}
					onDrop={onSidebarDrop}
					dropZoneRef={dropZoneRef}
					onDrag={onSidebarDrag}
					onDragEnd={onDragEnd}
					isPlaced={placedSidebarIds.includes(item.id)}
				/>
			))}
		</CardContent>
	</Card>
);
