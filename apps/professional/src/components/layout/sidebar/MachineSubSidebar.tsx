"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, ShoppingBag, ChevronsUpDown, X, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

export interface MachineSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
	exact?: boolean;
}

export const MACHINE_SUB_SIDEBAR_ITEMS: MachineSubSidebarItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.machineSidebarDashboard,
		href: "/module/production/machine",
		exact: true,
	},
	{
		id: "overview",
		labelKey: localizationConstants.machineSidebarOverview,
		href: "/module/production/machine/overview",
		exact: false,
	},
	{
		id: "handling",
		labelKey: localizationConstants.machineSidebarHandling,
		href: "/module/production/machine/handling",
		exact: false,
	},
	{
		id: "purchase",
		labelKey: localizationConstants.machineSidebarPurchase,
		href: "/module/production/machine/purchase",
		exact: false,
	},
	{
		id: "statistics",
		labelKey: localizationConstants.machineSidebarStatistics,
		href: "/module/production/machine/statistics",
		exact: false,
	},
	{
		id: "archive",
		labelKey: localizationConstants.machineSidebarArchive,
		href: "/module/production/machine/archive",
		exact: false,
	},
];

export function MachineSubSidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(true);

	if (!isOpen) {
		return (
			<div className="relative hidden md:flex h-full w-0 shrink-0">
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="absolute left-0 top-3 z-30 flex items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white p-2 text-slate-600 shadow-md hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer group"
					title="Öppna navigering"
					aria-label="Öppna navigering"
				>
					<PanelLeftOpen className="h-4.5 w-4.5 text-slate-600 group-hover:text-slate-900" />
				</button>
			</div>
		);
	}

	return (
		<aside className="sticky top-0 hidden md:flex h-full w-64 shrink-0 flex-col border-r border-slate-200/90 bg-[#FBFBFD]">
			{/* Top Header */}
			<div className="flex h-14 w-full items-center justify-between border-b border-slate-200/80 px-4">
				<span className="text-sm font-semibold text-slate-800">
					<Translate text={localizationConstants.machineSidebarProjectOverview} />
				</span>
				<button
					type="button"
					onClick={() => setIsOpen(false)}
					className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
					title="Stäng"
					aria-label="Stäng navigering"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			{/* Module Header / Selector (Figma Exact Parity) */}
			<div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18181B] text-white shadow-xs">
						<ShoppingBag className="h-4.5 w-4.5 text-white stroke-[1.8]" />
					</div>
					<span className="text-base font-bold text-slate-900">
						<Translate text={localizationConstants.machine} />
					</span>
				</div>
				<ChevronsUpDown className="h-4 w-4 text-slate-700 cursor-pointer" aria-hidden />
			</div>

			{/* Nav items */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-3 overflow-y-auto">
				{MACHINE_SUB_SIDEBAR_ITEMS.map((item) => {
					const isActive = item.exact
						? pathname === item.href
						: pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-[#1E293B] text-white shadow-xs font-semibold"
									: "text-slate-800 hover:bg-slate-200/50 hover:text-slate-900"
							)}
						>
							<Folder
								className={cn(
									"h-4.5 w-4.5 shrink-0 stroke-[1.75]",
									isActive ? "text-white stroke-2" : "text-slate-700"
								)}
							/>
							<span>
								<Translate text={item.labelKey} />
							</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
