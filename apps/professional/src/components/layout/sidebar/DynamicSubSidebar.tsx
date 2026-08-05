"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
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
		<aside className="sticky top-0 hidden md:flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
			{/* Header */}
			<div className="flex h-16 w-full items-center justify-between border-b border-slate-200 px-5">
				{hideBack ? (
					<div className="flex items-center gap-3">
						{HeaderIcon && (
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111721] text-white font-semibold shadow-2xs">
								<HeaderIcon className="h-5 w-5 text-white" />
							</div>
						)}
						<span className="text-sm font-semibold text-slate-900">
							{titleKey ? <Translate text={titleKey} /> : title}
						</span>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<Link
							href={backHref}
							className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111721] text-white shadow-2xs"
							aria-labelledby={backLabelId}
						>
							<span id={backLabelId} className="sr-only">
								<Translate text={backLabelKey} />
							</span>
							<ArrowLeft className="h-4 w-4 text-white" />
						</Link>
						<span className="text-sm font-semibold text-slate-900">
							{titleKey ? <Translate text={titleKey} /> : title}
						</span>
					</div>
				)}
				<ChevronsUpDown className="h-4 w-4 text-slate-500 cursor-pointer" aria-hidden />
			</div>

			{/* Nav items */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 overflow-y-auto">
				{items.map((item) => {
					const isActive = item.exact
						? pathname === item.href
						: pathname === item.href || pathname.startsWith(item.href + "/");
					const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								isActive
									? "bg-[#111721] text-white shadow-xs"
									: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
							)}
						>
							{Icon && (
								<Icon
									className={cn(
										"h-4 w-4 shrink-0",
										isActive ? "text-white" : "text-slate-500"
									)}
								/>
							)}
							<span className="truncate">
								{item.labelKey ? <Translate text={item.labelKey} /> : item.label}
							</span>
						</Link>
					);
				})}

				{additionalSection && (
					<div className="mt-4 pt-4 border-t border-slate-200">
						<p className="px-3.5 mb-2 text-xs font-semibold text-slate-500">
							{additionalSection.titleKey ? (
								<Translate text={additionalSection.titleKey} />
							) : (
								additionalSection.title
							)}
						</p>
						{additionalSection.items.map((item) => {
							const isActive = item.exact
								? pathname === item.href
								: pathname === item.href || pathname.startsWith(item.href + "/");
							const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

							return (
								<Link
									key={item.id}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
										isActive
											? "bg-[#111721] text-white shadow-xs"
											: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
									)}
								>
									{Icon && (
										<Icon
											className={cn(
												"h-4 w-4 shrink-0",
												isActive ? "text-white" : "text-slate-500"
											)}
										/>
									)}
									<span className="truncate">
										{item.labelKey ? <Translate text={item.labelKey} /> : item.label}
									</span>
								</Link>
							);
						})}
					</div>
				)}
			</nav>
		</aside>
	);
}
