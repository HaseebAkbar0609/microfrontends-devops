"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, FolderOpen, Folder, ChevronsUpDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";

const items: { id: string; labelKey: string; href: string; Icon: LucideIcon }[] = [
	{
		id: "professional",
		labelKey: localizationConstants.professional,
		href: "/customers/professional",
		Icon: FolderOpen,
	},
	{
		id: "private",
		labelKey: localizationConstants.private,
		href: "/customers/private",
		Icon: Folder,
	},
];

export default function CustomersSubSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header: outer p-2 gap-2, inner Level 3 header p-2 gap-2 rounded-lg */}
			<div className="flex w-full items-center gap-2 border-b border-slate-200 p-2">
				<div className="flex w-full items-center gap-2 rounded-lg p-2">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#171717] text-white">
						<UserRound size={16} />
					</div>
					<span className="flex-1 text-sm font-semibold text-[#0A0A0A]">
						<Translate text={localizationConstants.customerUsers} />
					</span>
					<ChevronsUpDown size={16} className="shrink-0 text-slate-400" />
				</div>
			</div>

			{/* Sidebar: p-2, menu gap-1 (4px) */}
			<nav className="flex flex-1 flex-col p-2">
				<div className="flex flex-col gap-1">
					{items.map(({ id, labelKey, href, Icon }) => {
						const isActive = pathname === href || pathname.startsWith(href + "/");

						return (
							<Link
								key={id}
								href={href}
								className={cn(
									"flex h-8 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
									isActive
										? "bg-slate-800 text-slate-100 shadow-sm"
										: "text-slate-800 hover:bg-slate-200",
								)}
							>
								<Icon size={16} />
								<Translate text={labelKey} />
							</Link>
						);
					})}
				</div>
			</nav>
		</aside>
	);
}
