"use client";

import { useEffect, useRef } from "react";
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
}

export function SidebarFlyout({
	items,
	anchorRect,
	anchorEl,
	onClose,
}: SidebarFlyoutProps) {
	const pathname = usePathname();
	const panelRef = useRef<HTMLDivElement>(null);

	const top = anchorRect.top;
	const left = anchorRect.right + 4;

	useEffect(() => {
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

		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [anchorEl, onClose]);

	return (
		<div
			ref={panelRef}
			className="fixed z-50 min-w-56 rounded-lg bg-slate-800 py-2 shadow-xl"
			style={{ top, left }}
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
