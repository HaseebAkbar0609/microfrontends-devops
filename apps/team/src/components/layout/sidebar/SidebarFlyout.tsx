"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavFlyoutItem } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarFlyoutProps {
	items: NavFlyoutItem[];
	anchorRect: DOMRect;
	anchorEl?: HTMLElement | null;
	onClose: () => void;
	leftOffset?: number;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

export function SidebarFlyout({
	items,
	anchorRect,
	anchorEl,
	onClose,
	leftOffset = 25,
	onMouseEnter,
	onMouseLeave,
}: SidebarFlyoutProps) {
	const pathname = usePathname();
	const panelRef = useRef<HTMLDivElement>(null);
	const frameRef = useRef<number | null>(null);
	const [position, setPosition] = useState(() => ({
		top: anchorRect.top,
		left: anchorRect.right + leftOffset,
	}));

	useEffect(() => {
		const updatePosition = () => {
			const sourceRect = anchorEl?.getBoundingClientRect() ?? anchorRect;
			const nextTop = sourceRect.top;
			const nextLeft = sourceRect.right + leftOffset;
			setPosition((prev) =>
				prev.top === nextTop && prev.left === nextLeft
					? prev
					: { top: nextTop, left: nextLeft },
			);
		};

		const schedulePositionUpdate = () => {
			if (frameRef.current !== null) return;
			frameRef.current = window.requestAnimationFrame(() => {
				frameRef.current = null;
				updatePosition();
			});
		};

		function handleOutsideClick(e: MouseEvent) {
			if (anchorEl && anchorEl.contains(e.target as Node)) {
				return;
			}
			if (
				panelRef.current &&
				!panelRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}
		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}

		updatePosition();
		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("keydown", handleEscape);
		window.addEventListener("scroll", schedulePositionUpdate, true);
		window.addEventListener("resize", schedulePositionUpdate);
		return () => {
			if (frameRef.current !== null) {
				window.cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("scroll", schedulePositionUpdate, true);
			window.removeEventListener("resize", schedulePositionUpdate);
		};
	}, [anchorEl, anchorRect, leftOffset, onClose]);

	return (
		<div
			ref={panelRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className="fixed z-50 min-w-[244px] rounded-lg bg-slate-800 py-2 shadow-xl"
			style={{ top: position.top, left: position.left }}
		>
			{items.map((item) => {
				const isActive =
					pathname === item.href ||
					pathname.startsWith(item.href + "/");
				return (
					<Link
						key={item.id}
						href={item.href}
						onClick={onClose}
						className={cn(
							"flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150",
							isActive
								? "bg-slate-700 text-slate-200"
								: "text-slate-300 hover:bg-slate-700/60 hover:text-slate-200",
						)}
					>
						{/* {Icon && <Icon size={16} className="text-slate-300" />} */}
						<Translate text={item.label} />
					</Link>
				);
			})}
		</div>
	);
}
