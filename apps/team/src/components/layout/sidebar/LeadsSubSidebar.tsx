"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Filter } from "lucide-react";

import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

const items = [
	{
		id: "leads-management",
		labelKey: "leadsManagement",
		href: "/leads/management",
	},
	{
		id: "leads-settings",
		labelKey: "settings",
		href: "/leads/settings",
	},
];

export default function LeadsSubSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-100/80">
			<div className="flex h-16 w-full items-center gap-3 border-b border-slate-200 px-4">
				<div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
					<Filter size={18} />
				</div>
				<div className="text-lg font-semibold text-slate-900">
					<Translate text="leads" />
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-2 px-3 py-4">
				{items.map((item) => {
					const isActive =
						pathname === item.href || pathname.startsWith(item.href + "/");

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
								isActive
									? "bg-slate-900 text-white shadow-sm"
									: "text-slate-600 hover:bg-slate-200"
							)}
						>
							<Translate text={item.labelKey} />
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
