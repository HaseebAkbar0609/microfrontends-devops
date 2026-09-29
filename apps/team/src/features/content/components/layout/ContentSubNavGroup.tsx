"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import type { ContentNavGroup } from "../../constants/contentNav";

type ContentSubNavGroupProps = {
	group: ContentNavGroup;
	pathname: string;
	isOpen: boolean;
	onToggle: () => void;
};

/** One collapsible dashboard in the settings sub-sidebar. */
export function ContentSubNavGroup({
	group,
	pathname,
	isOpen,
	onToggle,
}: ContentSubNavGroupProps) {
	return (
		<div className="flex flex-col gap-1">
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={isOpen}
				className="flex items-center justify-between gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-100"
			>
				<span className="text-left">
					<Translate text={group.titleKey} />
				</span>
				{isOpen ? (
					<ChevronUp size={14} className="shrink-0" />
				) : (
					<ChevronDown size={14} className="shrink-0" />
				)}
			</button>

			{isOpen &&
				group.items.map((item) => {
					const Icon = item.icon;
					// Every destination is a leaf route, so an equality is enough.
					const isActive = pathname === item.href;

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
		</div>
	);
}

export default ContentSubNavGroup;
