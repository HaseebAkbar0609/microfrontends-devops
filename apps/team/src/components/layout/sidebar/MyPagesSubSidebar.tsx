"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import {
	ArrowLeft,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import type { FlyoutSubSidebarItem } from "./navConfig";

interface MyPagesSubSidebarProps {
	titleKey: string;
	items: FlyoutSubSidebarItem[];
	backHref?: string;
}

export default function MyPagesSubSidebar({
	titleKey = localizationConstants.myPages,
	items,
	backHref = "/",
}: MyPagesSubSidebarProps) {
	const pathname = usePathname();
	const backLabelId = useId();

	return (
		<aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
			<div className="flex h-16 w-full items-center border-b border-slate-200 gap-3 px-3 sm:px-5">
				<Link
					href={backHref}
					className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
					aria-labelledby={backLabelId}
				>
					<span id={backLabelId} className="sr-only">
						<Translate text="backToMainMenu" />
					</span>
					<ArrowLeft size={18} />
				</Link>
				<div className="text-lg font-semibold text-slate-900">
					<Translate text={titleKey} />
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

			<div className="border-t border-slate-200 px-4 py-3">
				<Link
					href={backHref}
					className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
				>
					<ArrowLeft size={16} />
					<Translate text="backToMainMenu" />
				</Link>
			</div>
		</aside>
	);
}
