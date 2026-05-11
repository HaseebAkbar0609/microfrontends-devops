"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFlyout } from "./SidebarFlyout";
import type { NavSubItem } from "./navConfig";
import { Translate } from "@/utils/translation/translate";

interface SidebarSubItemProps {
	item: NavSubItem;
}

export function SidebarSubItem({ item }: SidebarSubItemProps) {
	const pathname = usePathname();
	const [flyoutOpen, setFlyoutOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const itemRef = useRef<HTMLButtonElement>(null);

	const hasFlyout = !!item.flyoutItems?.length;
	const isActive =
		pathname === item.href || pathname.startsWith(item.href + "/");

	function handleClick() {
		if (!hasFlyout) return;
		if (flyoutOpen) {
			setFlyoutOpen(false);
			return;
		}
		const rect = itemRef.current?.getBoundingClientRect();
		if (rect) {
			setAnchorRect(rect);
			setFlyoutOpen(true);
		}
	}

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
					onClick={handleClick}
					className={sharedClassName}
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
						onClose={() => setFlyoutOpen(false)}
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
