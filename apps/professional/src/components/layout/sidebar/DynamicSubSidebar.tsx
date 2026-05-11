"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

export interface DynamicSubSidebarItem {
	id: string;
	labelKey?: string;
	label?: string;
	href: string;
	icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface DynamicSubSidebarProps {
	title?: string;
	titleKey?: string;
	items: DynamicSubSidebarItem[];
	backHref?: string;
	backLabelKey?: string;
	additionalSection?: {
		title?: string;
		titleKey?: string;
		items: DynamicSubSidebarItem[];
	};
}

export default function DynamicSubSidebar({
	title,
	titleKey,
	items,
	backHref = "/",
	backLabelKey = "backToMainMenu",
	additionalSection,
}: DynamicSubSidebarProps) {
	const pathname = usePathname();
	const backLabelId = useId();

	return (
		<aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-100/80">
			<div className="flex h-16 w-full items-center border-b border-slate-200 gap-3 px-3 sm:px-5">
				<Link
					href={backHref}
					className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
					aria-labelledby={backLabelId}
				>
					<span id={backLabelId} className="sr-only">
						<Translate text={backLabelKey} />
					</span>
					<ArrowLeft size={18} />
				</Link>
				<div className="text-lg font-semibold text-slate-900">
					{titleKey ? <Translate text={titleKey} /> : title}
				</div>
			</div>

			<nav className="flex flex-1 flex-col gap-2 px-3 py-4">
				{items.map((item) => {
					const isActive =
						pathname === item.href ||
						pathname.startsWith(item.href + "/");
					const Icon = item.icon;

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
							{Icon && <Icon size={18} />}
							{item.labelKey ? (
								<Translate text={item.labelKey} />
							) : (
								item.label
							)}
						</Link>
					);
				})}
			</nav>

			{additionalSection && (
				<>
					<div className="border-t border-slate-200 px-4 py-3">
						<div className="text-xs font-semibold uppercase text-slate-500 mb-2">
							{additionalSection.titleKey ? (
								<Translate text={additionalSection.titleKey} />
							) : (
								additionalSection.title
							)}
						</div>
						{additionalSection.items.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.id}
									href={item.href}
									className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 py-1"
								>
									{item.labelKey ? (
										<Translate text={item.labelKey} />
									) : (
										item.label
									)}
									{Icon && <Icon size={16} />}
								</Link>
							);
						})}
					</div>
				</>
			)}

			<div className="border-t border-slate-200 px-4 py-3">
				<Link
					href={backHref}
					className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
				>
					<ArrowLeft size={16} />
					<Translate text={backLabelKey} />
				</Link>
			</div>
		</aside>
	);
}
