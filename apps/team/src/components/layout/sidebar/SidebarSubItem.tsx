"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFlyout } from "./SidebarFlyout";
import { navSubItemMatchesPath, type NavSubItem } from "./navConfig";
import { SIDEBAR_FLYOUT_CLOSE_DELAY_MS } from "./sidebar.constants";
import { Translate } from "@/utils/translation/translate";

interface SidebarSubItemProps {
	item: NavSubItem;
}

export function SidebarSubItem({ item }: SidebarSubItemProps) {
	const pathname = usePathname();
	const [flyoutOpen, setFlyoutOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const itemRef = useRef<HTMLButtonElement>(null);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const hasFlyout = !!item.flyoutItems?.length;
	const isActive = navSubItemMatchesPath(item, pathname);

	const cancelClose = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
	};

	// Opens on hover and on click. Clicking never toggles it shut, so a user who
	// hovers first and then clicks does not close the menu they just opened.
	const openFlyout = () => {
		cancelClose();
		const rect = itemRef.current?.getBoundingClientRect();
		if (rect) {
			setAnchorRect(rect);
			setFlyoutOpen(true);
		}
	};

	// Leaving the item or the panel waits before closing, so the pointer can
	// cross the gap between them. Entering either one cancels the close.
	const scheduleClose = () => {
		cancelClose();
		closeTimeoutRef.current = setTimeout(
			() => setFlyoutOpen(false),
			SIDEBAR_FLYOUT_CLOSE_DELAY_MS,
		);
	};

	const closeFlyout = () => {
		cancelClose();
		setFlyoutOpen(false);
	};

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		};
	}, []);

	const sharedClassName = cn(
		"flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150",
		isActive
			? "bg-slate-700 text-slate-200"
			: "text-slate-300 hover:bg-slate-700/60 hover:text-slate-200",
	);

	if (hasFlyout) {
		return (
			<>
				<button
					ref={itemRef}
					type="button"
					aria-haspopup="menu"
					aria-expanded={flyoutOpen}
					onClick={openFlyout}
					onMouseEnter={openFlyout}
					onMouseLeave={scheduleClose}
					className={cn(sharedClassName, flyoutOpen && "bg-slate-700/60 text-slate-200")}
				>
					<span>
						<Translate text={item.label} />
					</span>
					<ChevronRight size={14} className="shrink-0 opacity-60" />
				</button>

				{flyoutOpen && anchorRect && (
					<SidebarFlyout
						items={item.flyoutItems!}
						anchorRect={anchorRect}
						anchorEl={itemRef.current}
						onClose={closeFlyout}
						onMouseEnter={cancelClose}
						onMouseLeave={scheduleClose}
					/>
				)}
			</>
		);
	}

	return (
		<Link href={item.href} className={sharedClassName}>
			<Translate text={item.label} />
		</Link>
	);
}
