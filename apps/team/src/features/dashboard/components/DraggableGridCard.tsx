"use client";

import { useRef, useState } from "react";
import Draggable, { type DraggableEvent } from "react-draggable";
import { cn } from "@/lib/utils";

interface DraggableGridCardProps {
	className?: string;
	disabled?: boolean;
	/** Elements inside the card that must not start a drag, such as its menu button. */
	cancel?: string;
	onDragStart: () => void;
	onDrag: (clientX: number, clientY: number) => void;
	onDragStop: (clientX: number, clientY: number) => void;
	/** Forwards the wrapper div so the parent can read its bounding rect */
	containerRef: (el: HTMLDivElement | null) => void;
	/** Whether this card represents an empty slot */
	isEmpty?: boolean;
	children: React.ReactNode;
}

export const DraggableGridCard = ({
	className,
	disabled,
	cancel = "a, button, [role='button'], input, textarea, select, .no-drag",
	onDragStart,
	onDrag,
	onDragStop,
	containerRef,
	isEmpty,
	children,
}: DraggableGridCardProps) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [dragKey, setDragKey] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const handleStart = () => {
		if (disabled) return false;
		setIsDragging(true);
		onDragStart();
	};

	const handleDrag = (e: DraggableEvent) => {
		const { clientX, clientY } = e as MouseEvent;
		onDrag(clientX, clientY);
	};

	const handleStop = (e: DraggableEvent) => {
		const { clientX, clientY } = e as MouseEvent;
		setIsDragging(false);
		onDragStop(clientX, clientY);
		// Remount so the card snaps back; the board re-renders it in its new slot.
		setDragKey((k) => k + 1);
	};

	return (
		<Draggable
			key={dragKey}
			disabled={disabled}
			cancel={cancel}
			nodeRef={nodeRef as React.RefObject<HTMLElement>}
			onStart={handleStart}
			onDrag={handleDrag}
			onStop={handleStop}
		>
			<div
				ref={(el) => {
					nodeRef.current = el;
					containerRef(el);
				}}
				className={cn(
					"flex h-full flex-col rounded-lg transition-[box-shadow,background-color,border-color,transform] duration-150",
					isDragging
						? "bg-[#1E293B] text-white shadow-2xl cursor-grabbing ring-1 ring-white/10 !transition-none [&_*]:!bg-transparent [&_*]:!text-white [&_*]:!border-none"
						: isEmpty
							? "border-2 border-dashed border-slate-200 bg-transparent hover:border-slate-300"
							: "border border-slate-200/80 bg-white shadow-xs hover:border-slate-300 hover:shadow-md",
					!isDragging && (disabled ? "cursor-default" : "cursor-grab"),
					className
				)}
				style={{ position: "relative", zIndex: isDragging ? 9998 : "auto" }}
			>
				<div
					className={cn(
						"flex h-full flex-1 flex-col transition-transform duration-150",
						isDragging && "scale-95"
					)}
				>
					{children}
				</div>
			</div>
		</Draggable>
	);
};
