"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSubItem } from "./SidebarSubItem";
import { SidebarFlyout } from "./SidebarFlyout";
import { navGroupMatchesPath, type NavGroup } from "./navConfig";
import { SIDEBAR_FLYOUT_CLOSE_DELAY_MS } from "./sidebar.constants";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";

interface SidebarNavGroupProps {
	group: NavGroup;
	collapsed?: boolean;
	isOpen?: boolean;
	onToggle?: () => void;
}

export function SidebarNavGroup({
	group,
	collapsed = false,
	isOpen = false,
	onToggle,
}: SidebarNavGroupProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [flyoutOpen, setFlyoutOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const groupRef = useRef<HTMLElement | null>(null);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const Icon = group.icon;
	const hasItems = group.items.length > 0;
	const isLink = !hasItems && !!group.href;
	const isActive = navGroupMatchesPath(group, pathname);

	const collapsedFlyoutItems = group.items.map((item) => ({
		id: item.id,
		label: item.label,
		href: item.href,
	}));

	const openCollapsedFlyout = () => {
		if (!collapsed || !hasItems) return;
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		const rect = groupRef.current?.getBoundingClientRect();
		if (rect) {
			setAnchorRect(rect);
			setFlyoutOpen(true);
		}
	};

	const closeCollapsedFlyout = (delay = SIDEBAR_FLYOUT_CLOSE_DELAY_MS) => {
		if (!collapsed || !hasItems) return;
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		closeTimeoutRef.current = setTimeout(() => {
			setFlyoutOpen(false);
		}, delay);
	};

	useEffect(() => {
		if (!collapsed) {
			setFlyoutOpen(false);
		}
	}, [collapsed]);

	useEffect(() => {
		setFlyoutOpen(false);
	}, [pathname]);

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	const content = (
		<>
			<div
				className={cn(
					"flex h-7 shrink-0 items-center justify-center rounded-md p-1",
					collapsed ? "w-full" : "w-7",
					isActive
						? !collapsed
							? "text-slate-100"
							: "text-slate-300"
						: "text-slate-100"
				)}
			>
				<Icon
					size={15}
					className={cn(
						isActive
							? collapsed
								? "text-slate-100"
								: "text-slate-100"
							: "text-slate-300"
					)}
				/>
			</div>

			{!collapsed && (
				<div className="flex h-7 flex-1 items-center gap-2 px-1">
					<span
						className={cn(
							"flex-1 text-left text-sm font-medium",
							isActive ? "text-slate-100" : "text-slate-300"
						)}
					>
						<Translate text={group.label} />
					</span>
					{hasItems &&
						(isOpen ? (
							<ChevronUp size={14} className="shrink-0 text-slate-300" />
						) : (
							<ChevronDown size={14} className="shrink-0 text-slate-300" />
						))}
				</div>
			)}
		</>
	);

	return (
		<div className="flex w-full flex-col">
			{isLink ? (
				<Link
					ref={(element) => {
						groupRef.current = element;
					}}
					href={group.href!}
					title={collapsed ? group.label : undefined}
					className={cn(
						"flex w-full flex-row items-center rounded-md px-2 py-1.5 transition-colors cursor-pointer hover:bg-[#2a3548]",
						isActive ? "bg-slate-600 text-slate-100" : "text-slate-300"
					)}
					onMouseEnter={openCollapsedFlyout}
					onMouseLeave={() => closeCollapsedFlyout()}
				>
					{content}
				</Link>
			) : (
				<Button
					ref={(element) => {
						groupRef.current = element;
					}}
					type="button"
					variant="ghost"
					onClick={() => {
						if (collapsed && hasItems) {
							openCollapsedFlyout();
							const firstHref = group.items[0]?.href;
							if (firstHref) {
								router.push(firstHref);
							}
							return;
						}

						if (!collapsed && hasItems) {
							onToggle?.();
						}
					}}
					title={collapsed ? group.label : undefined}
					className={cn(
						"flex w-full flex-row items-center rounded-md px-2 py-1.5 transition-colors cursor-pointer hover:bg-[#2a3548]",
						isActive ? "bg-slate-600 text-slate-100" : "text-slate-300"
					)}
					onMouseEnter={openCollapsedFlyout}
					onMouseLeave={() => closeCollapsedFlyout()}
				>
					{content}
				</Button>
			)}

			{hasItems && isOpen && !collapsed && (
				<div className="flex flex-row self-stretch pl-5">
					<div className="flex flex-1 flex-col gap-1 border-l border-[#364157] py-1 pl-2">
						{group.items.map((item) => (
							<SidebarSubItem key={item.id} item={item} />
						))}
					</div>
				</div>
			)}

			{collapsed && hasItems && flyoutOpen && anchorRect && (
				<SidebarFlyout
					items={collapsedFlyoutItems}
					anchorRect={anchorRect}
					anchorEl={groupRef.current}
					leftOffset={22}
					onClose={() => setFlyoutOpen(false)}
				/>
			)}
		</div>
	);
}
