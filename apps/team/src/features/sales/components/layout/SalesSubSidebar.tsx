"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SALES_SUB_NAV_ITEMS,
	isSalesSubNavItemActive,
} from "../../constants/salesNav";

/** Second sidebar for the sales system, shown on every `/module/sales` page. */
export function SalesSubSidebar() {
	const pathname = usePathname();

	return (
		<aside className="no-print flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
			<div className="flex h-16 items-center gap-3 border-b border-slate-200 px-3 sm:px-5">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
					<Clock size={18} />
				</div>
				<div className="flex min-w-0 flex-col">
					<span className="text-lg font-semibold leading-6 text-slate-900">
						<Translate text={localizationConstants.salesSystemTitle} />
					</span>
					<span className="truncate text-xs text-slate-500">
						<Translate text={localizationConstants.salesSystemSubtitle} />
					</span>
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 hide-scrollbar">
				{SALES_SUB_NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = isSalesSubNavItemActive(item, pathname);

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

			<p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
				<Translate text={localizationConstants.salesSystemFooter} />
			</p>
		</aside>
	);
}
