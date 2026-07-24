"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { ArrowLeft, ChevronsUpDown, ChevronRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

export interface DynamicSubSidebarItem {
	id: string;
	labelKey?: string;
	label?: string;
	href: string;
	icon?: React.ComponentType<{ size?: number; className?: string }>;
	activeIcon?: React.ComponentType<{ size?: number; className?: string }>;
	exact?: boolean;
}

interface DynamicSubSidebarProps {
	title?: string;
	titleKey?: string;
	headerIcon?: React.ComponentType<{ size?: number; className?: string }>;
	items: DynamicSubSidebarItem[];
	backHref?: string;
	backLabelKey?: string;
	hideBack?: boolean;
	additionalSection?: {
		title?: string;
		titleKey?: string;
		items: DynamicSubSidebarItem[];
	};
}

export default function DynamicSubSidebar({
	title,
	titleKey,
	headerIcon: HeaderIcon,
	items,
	backHref = "/",
	backLabelKey = "backToMainMenu",
	hideBack = false,
	additionalSection,
}: DynamicSubSidebarProps) {
	const pathname = usePathname();
	const backLabelId = useId();

	return (
		<aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header */}
			<div className="flex h-16 w-full items-center border-b border-slate-200 px-2">
				{hideBack ? (
					<div className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2">
						{HeaderIcon && (
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white">
								<HeaderIcon size={16} />
							</div>
						)}
						<span className="flex-1 text-sm font-semibold text-neutral-950">
							{titleKey ? <Translate text={titleKey} /> : title}
						</span>
						<ChevronsUpDown size={16} className="shrink-0 text-neutral-950" />
					</div>
				) : (
					<>
						<Link
							href={backHref}
							className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
							aria-labelledby={backLabelId}
						>
							<span id={backLabelId} className="sr-only">
								<Translate text={backLabelKey} />
							</span>
							<ArrowLeft size={18} />
						</Link>
						<div className="ml-3 text-sm font-semibold text-neutral-950">
							{titleKey ? <Translate text={titleKey} /> : title}
						</div>
					</>
				)}
			</div>

			{/* Nav items */}
			<nav className="flex flex-1 flex-col gap-1 p-2">
				{items.map((item) => {
					const isActive = item.exact
						? pathname === item.href
						: pathname === item.href ||
							pathname.startsWith(item.href + "/");
					const Icon = isActive && item.activeIcon
						? item.activeIcon
						: item.icon;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex h-8 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
								isActive
									? "bg-slate-800 text-slate-100"
									: "text-slate-800 hover:bg-slate-200",
							)}
						>
							{Icon && <Icon size={16} className="shrink-0" />}
							{item.labelKey ? (
								<Translate text={item.labelKey} />
							) : (
								item.label
							)}
						</Link>
					);
				})}
			</nav>

			{/* "Gå till" / additional section */}
			{additionalSection && (
				<div className="border-t border-r border-slate-200 bg-slate-50 p-2 flex flex-col gap-1">
					<div className="flex h-8 items-center px-2 opacity-70">
						<span className="text-xs text-neutral-950">
							{additionalSection.titleKey ? (
								<Translate text={additionalSection.titleKey} />
							) : (
								additionalSection.title
							)}
						</span>
					</div>
					{additionalSection.items.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.id}
								href={item.href}
								className="flex h-8 items-center gap-2 rounded-md px-4 text-sm font-medium text-slate-800 hover:bg-slate-200 transition-colors"
							>
								{Icon && <Icon size={16} className="shrink-0" />}
								<span className="flex-1">
									{item.labelKey ? (
										<Translate text={item.labelKey} />
									) : (
										item.label
									)}
								</span>
								<ChevronRight size={16} className="shrink-0 text-slate-800" />
							</Link>
						);
					})}
				</div>
			)}

			{/* Back to main menu */}
			{!hideBack && (
				<div className="border-t border-slate-200 px-4 py-3">
					<Link
						href={backHref}
						className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
					>
						<ArrowLeft size={16} />
						<Translate text={backLabelKey} />
					</Link>
				</div>
			)}
		</aside>
	);
}
