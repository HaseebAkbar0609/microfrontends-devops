"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, FolderOpen, ChevronsUpDown, ChevronRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";
import {
	PROJECT_SUB_SIDEBAR_ITEMS,
	PROJECT_GOTO_ITEMS,
} from "@/features/project/data/projectNav.config";

export function isProjectPathActive(
	currentPath: string,
	itemHref: string,
	exact?: boolean
): boolean {
	if (exact) {
		return currentPath === itemHref;
	}
	return currentPath === itemHref || currentPath.startsWith(`${itemHref}/`);
}

export function ProjectSubSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 hidden md:flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header */}
			<div className="flex h-16 w-full items-center justify-between border-b border-slate-200 px-5">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111721] text-white font-semibold shadow-2xs">
						<Folder className="h-5 w-5 text-white" aria-hidden />
					</div>
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.projectModule} />
					</span>
				</div>
				<ChevronsUpDown className="h-4 w-4 text-slate-500 cursor-pointer" aria-hidden />
			</div>

			{/* Nav items */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 overflow-y-auto">
				{PROJECT_SUB_SIDEBAR_ITEMS.map((item) => {
					const active = isProjectPathActive(pathname, item.href, item.exact);
					const ItemIcon = active ? FolderOpen : Folder;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								active
									? "bg-[#111721] text-white shadow-xs"
									: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
							)}
						>
							<ItemIcon
								className={cn(
									"h-4 w-4 shrink-0",
									active ? "text-white" : "text-slate-500"
								)}
								aria-hidden
							/>
							<span className="truncate">
								<Translate text={item.labelKey} />
							</span>
						</Link>
					);
				})}

				{/* "Gå till" section */}
				<div className="mt-4 pt-4 border-t border-slate-200">
					<p className="px-3.5 mb-2 text-xs font-semibold text-slate-500">
						<Translate text={localizationConstants.projectGoTo} />
					</p>
					<div className="flex flex-col gap-1">
						{PROJECT_GOTO_ITEMS.map((item) => {
							const active = isProjectPathActive(pathname, item.href);
							const ItemIcon = active ? FolderOpen : Folder;

							return (
								<Link
									key={item.id}
									href={item.href}
									className={cn(
										"flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
										active
											? "bg-[#111721] text-white shadow-xs"
											: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
									)}
								>
									<span className="flex items-center gap-3 min-w-0">
										<ItemIcon
											className={cn(
												"h-4 w-4 shrink-0",
												active ? "text-white" : "text-slate-500"
											)}
											aria-hidden
										/>
										<span className="truncate">{item.title}</span>
									</span>
									<ChevronRight
										className={cn(
											"h-4 w-4 shrink-0",
											active ? "text-white" : "text-slate-400"
										)}
										aria-hidden
									/>
								</Link>
							);
						})}
					</div>
				</div>
			</nav>
		</aside>
	);
}

export default ProjectSubSidebar;
