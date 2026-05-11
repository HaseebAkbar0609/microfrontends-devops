"use client";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { Translate } from "@/utils/translation/translate";
import type { WidgetItem } from "@/features/dashboard/types";

interface DraggableSidebarItemProps {
	item: WidgetItem;
	isActive: boolean;
	onClick: () => void;
	onDrop: (item: WidgetItem, clientX: number, clientY: number) => void;
	dropZoneRef: React.RefObject<HTMLElement | null>;
	onDrag: (clientX: number, clientY: number) => void;
	onDragEnd: () => void;
	isPlaced?: boolean;
	variant?: "sidebar" | "menu";
	disabled?: boolean;
	showDisabledStyle?: boolean;
}

export const DraggableSidebarItem = ({
	item,
	isActive,
	onClick,
	onDrop,
	onDrag,
	onDragEnd,
	isPlaced,
	variant = "sidebar",
	disabled,
	showDisabledStyle = true,
}: DraggableSidebarItemProps) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [dragKey, setDragKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const handleStart = () => {
		if (isPlaced) return false;
		setIsDragging(true);
		onClick();
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
			disabled={Boolean(isPlaced || disabled)}
			nodeRef={nodeRef as React.RefObject<HTMLElement>}
			onStart={handleStart}
			onDrag={handleDrag}
			onStop={handleStop}
		>
			<div
				ref={nodeRef}
				className={`select-none transition-[background-color,box-shadow,ring-color,transform] duration-150 ${
					variant === "menu"
						? "flex items-center gap-2 text-slate-700 cursor-grab"
						: "flex items-center gap-2 px-4 py-2 rounded-md"
				} ${
					isDragging
						? "bg-[#1E293B] p-3 rounded-xl text-white shadow-2xl cursor-grabbing ring-1 ring-white/20 scale-105 !transition-none [&_*]:!bg-transparent [&_*]:!text-white [&_*]:!border-none"
						: isActive
							? variant === "menu"
								? "text-slate-900"
								: "bg-[#1E293B] text-white cursor-grab"
							: isPlaced || (disabled && showDisabledStyle)
								? variant === "menu"
									? "text-slate-400 cursor-default opacity-60"
									: "bg-slate-50 text-slate-400 cursor-default opacity-60"
								: variant === "menu"
									? "hover:text-slate-900"
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
