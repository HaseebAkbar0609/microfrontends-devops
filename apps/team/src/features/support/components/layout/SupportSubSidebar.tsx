"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	SUPPORT_SUB_NAV_ITEMS,
	getActiveSupportNavId,
} from "../../constants/supportNav";

/** Second sidebar for the support desk, shown on every `/support` page. */
export function SupportSubSidebar() {
	const activeId = getActiveSupportNavId(usePathname());

	return (
		<aside className="no-print hidden h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
			<div className="flex h-16 items-center gap-3 border-b border-slate-200 px-3 sm:px-5">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
					<Headset size={18} />
				</div>
				<span className="text-lg font-semibold leading-6 text-slate-900">
					<Translate text={localizationConstants.support} />
				</span>
			</div>

			<nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 hide-scrollbar">
				{SUPPORT_SUB_NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = item.id === activeId;

					return (
						<Link
							key={item.id}
							href={item.href}
							aria-current={isActive ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
								isActive
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
		</aside>
	);
}

export function SupportMobileNav() {
	const activeId = getActiveSupportNavId(usePathname());
	const t = useTranslate();

	return (
		<nav
			aria-label={t(localizationConstants.support)}
			className="no-print flex min-w-0 shrink-0 gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 hide-scrollbar lg:hidden"
		>
			{SUPPORT_SUB_NAV_ITEMS.map((item) => {
				const Icon = item.icon;
				const isActive = item.id === activeId;
				return (
					<Link
						key={item.id}
						href={item.href}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
							isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
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
