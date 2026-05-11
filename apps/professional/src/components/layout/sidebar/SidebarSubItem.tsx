"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFlyout } from "./SidebarFlyout";
import { useSidebarRailFlyoutLock } from "./SidebarRailContext";
import type { NavSubItem } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarSubItemProps {
	item: NavSubItem;
	/** When the parent nav group accordion collapses, any open flyout closes. */
	isGroupOpen?: boolean;
}

export function SidebarSubItem({
	item,
	isGroupOpen = true,
}: SidebarSubItemProps) {
	const pathname = usePathname();
	const [flyoutOpen, setFlyoutOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const itemRef = useRef<HTMLButtonElement>(null);
	const setRailFlyoutOpen = useSidebarRailFlyoutLock();

	const hasFlyout = !!item.flyoutItems?.length;
	const isActive =
		pathname === item.href || pathname.startsWith(item.href + "/");

	function closeFlyout() {
		setFlyoutOpen(false);
		setRailFlyoutOpen?.(false);
	}

	function handleClick() {
		if (!hasFlyout) return;
		if (flyoutOpen) {
			closeFlyout();
			return;
		}
		const rect = itemRef.current?.getBoundingClientRect();
		if (rect) {
			setAnchorRect(rect);
			setFlyoutOpen(true);
			setRailFlyoutOpen?.(true);
		}
	}

	useEffect(() => {
		return () => setRailFlyoutOpen?.(false);
	}, [setRailFlyoutOpen]);

	useEffect(() => {
		if (!isGroupOpen) {
			setFlyoutOpen(false);
			setRailFlyoutOpen?.(false);
		}
	}, [isGroupOpen, setRailFlyoutOpen]);

	const sharedClassName = cn(
		"flex w-full min-w-0 items-start gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium transition-colors duration-150",
		isActive
			? "bg-slate-600 text-white shadow-sm"
			: "text-slate-300 hover:bg-slate-700/60 hover:text-slate-200",
	);

	const labelClassName =
		"min-w-0 flex-1 text-left leading-snug break-words";

	if (hasFlyout) {
		return (
			<>
				<button
					ref={itemRef}
					type="button"
					onClick={handleClick}
					className={sharedClassName}
				>
					<span className={labelClassName}>
						<Translate text={item.label} />
					</span>
					<ChevronRight
						size={14}
						className="mt-0.5 shrink-0 self-start opacity-60"
					/>
				</button>

				{flyoutOpen && anchorRect && (
					<SidebarFlyout
						items={item.flyoutItems!}
						anchorRect={anchorRect}
						anchorEl={itemRef.current}
						onClose={closeFlyout}
					/>
				)}
			</>
		);
	}

	return (
		<Link href={item.href} className={sharedClassName}>
			<span className={labelClassName}>
				<Translate text={item.label} />
			</span>
		</Link>
	);
}
