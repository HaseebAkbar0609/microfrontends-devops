import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
}: SidebarWidgetListProps) => (
	<Card className="shadow-none p-6">
		<CardContent className="p-0 py-2 space-y-1">
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
