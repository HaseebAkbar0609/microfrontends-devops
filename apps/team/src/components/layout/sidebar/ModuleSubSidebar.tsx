"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export type ModuleSubNavItem = {
	id: string;
	labelKey: TranslationKeys;
	href: string;
	icon: LucideIcon;
};

type ModuleNavProps<Item extends ModuleSubNavItem> = {
	titleKey: TranslationKeys;
	items: Item[];
	/** Each module decides what lights an entry: an exact match, or the most specific href. */
	isActive: (item: Item, pathname: string) => boolean;
};

type ModuleSubSidebarProps<Item extends ModuleSubNavItem> = ModuleNavProps<Item> & {
	icon: LucideIcon;
	subtitleKey?: TranslationKeys;
	footerKey?: TranslationKeys;
};

/** A module's own second sidebar (Sales, Marknad, Support), shown from `lg` up. */
export function ModuleSubSidebar<Item extends ModuleSubNavItem>({
	titleKey,
	subtitleKey,
	footerKey,
	icon: ModuleIcon,
	items,
	isActive,
}: ModuleSubSidebarProps<Item>) {
	const pathname = usePathname();

	return (
		<aside className="no-print hidden h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
			<div className="flex h-16 items-center gap-3 border-b border-slate-200 px-3 sm:px-5">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
					<ModuleIcon size={18} />
				</div>
				<div className="flex min-w-0 flex-col">
					<span className="truncate text-lg font-semibold leading-6 text-slate-900">
						<Translate text={titleKey} />
					</span>
					{subtitleKey ? (
						<span className="truncate text-xs text-slate-500">
							<Translate text={subtitleKey} />
						</span>
					) : null}
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 hide-scrollbar">
				{items.map((item) => {
					const Icon = item.icon;
					const active = isActive(item, pathname);

					return (
						<Link
							key={item.id}
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
								active
									? "bg-slate-900 text-white shadow-sm"
									: "text-slate-600 hover:bg-slate-200",
							)}
						>
							<Icon size={18} className="shrink-0" />
							<Translate text={item.labelKey} />
						</Link>
					);
				})}
			</nav>

			{footerKey ? (
				<p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
					<Translate text={footerKey} />
				</p>
			) : null}
		</aside>
	);
}

/** The same entries as a scrolling row, below the `lg` breakpoint where the sidebar is hidden. */
export function ModuleMobileNav<Item extends ModuleSubNavItem>({
	titleKey,
	items,
	isActive,
}: ModuleNavProps<Item>) {
	const pathname = usePathname();
	const t = useTranslate();

	return (
		<nav
			aria-label={t(titleKey)}
			className="no-print flex min-w-0 shrink-0 gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 hide-scrollbar lg:hidden"
		>
			{items.map((item) => {
				const Icon = item.icon;
				const active = isActive(item, pathname);
				return (
					<Link
						key={item.id}
						href={item.href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
							active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
						)}
					>
						<Icon size={16} className="shrink-0" />
						<Translate text={item.labelKey} />
					</Link>
				);
			})}
		</nav>
	);
}
