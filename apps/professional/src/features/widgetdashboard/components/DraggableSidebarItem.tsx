"use client";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { type LucideIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";

export interface WidgetItem {
	id: string;
	label: string;
	icon: LucideIcon;
}

interface DraggableSidebarItemProps {
	item: WidgetItem;
	isActive: boolean;
	onClick: () => void;
	onDrop: (item: WidgetItem, clientX: number, clientY: number) => void;
	dropZoneRef: React.RefObject<HTMLDivElement | null>;
	onDrag: (clientX: number, clientY: number) => void;
	onDragEnd: () => void;
	isPlaced?: boolean;
}

export const DraggableSidebarItem = ({
	item,
	isActive,
	onClick,
	onDrop,
	onDrag,
	onDragEnd,
	isPlaced,
}: DraggableSidebarItemProps) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [dragKey, setDragKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const handleStart = () => {
		if (isPlaced) return false;
		setIsDragging(true);
	};

	const handleDrag = (e: DraggableEvent) => {
		const { clientX, clientY } = e as MouseEvent;
		if (clientX !== undefined && clientY !== undefined) {
			onDrag(clientX, clientY);
		}
	};

	const handleStop = (e: DraggableEvent) => {
		setIsDragging(false);
		onDragEnd();
		onClick();

		const mouseEvent = e as MouseEvent;
		const clientX = mouseEvent.clientX;
		const clientY = mouseEvent.clientY;

		if (clientX !== undefined && clientY !== undefined) {
			onDrop(item, clientX, clientY);
		}

		setDragKey((k) => k + 1);
	};

	return (
		<Draggable
			key={dragKey}
			disabled={isPlaced}
			nodeRef={nodeRef as React.RefObject<HTMLElement>}
			onStart={handleStart}
			onDrag={handleDrag}
			onStop={handleStop}
		>
			<div
				ref={nodeRef}
				className={`flex items-center gap-2 px-4 py-2 rounded-md select-none transition-[background-color,box-shadow,ring-color,transform] duration-150 ${isDragging
						? "bg-[#1E293B] text-white shadow-2xl cursor-grabbing ring-1 ring-white/20 scale-105 !transition-none [&_*]:!bg-transparent [&_*]:!text-white [&_*]:!border-none"
						: isPlaced
							? "bg-slate-50 text-slate-400 cursor-default opacity-60"
							: isActive
								? "bg-[#1E293B] text-white cursor-grab"
								: "hover:bg-slate-100 text-slate-700 cursor-grab"
					}`}
				style={{
					zIndex: isDragging ? 9999 : "auto",
					position: "relative",
				}}
			>
				<div
					className={`flex items-center gap-2 transition-all duration-150`}
				>
					<item.icon size={18} />
					<span className="text-sm">
						<Translate text={item.label} />
					</span>
				</div>
			</div>
		</Draggable>
	);
};
