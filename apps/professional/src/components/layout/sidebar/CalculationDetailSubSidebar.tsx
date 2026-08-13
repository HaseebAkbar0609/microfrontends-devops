"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, ChevronsUpDown, Folder } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Props {
	calcId: string;
}

export function CalculationDetailSubSidebar({ calcId }: Props) {
	const pathname = usePathname();
	const t = useTranslate();
	const [expanded, setExpanded] = useState(true);

	const base = `/module/business/calculation/overview/${calcId}`;

	const NAV_ITEMS = [
		{
			id: "information",
			labelKey: localizationConstants.protocolFieldInformation,
			href: base,
			exact: true,
			disabled: false,
		},
		{
			id: "kalkylberakning",
			labelKey: localizationConstants.calcBerPageTitle,
			href: `${base}/kalkylberakning`,
			exact: false,
			disabled: false,
		},
		{
			id: "forfragan",
			labelKey: localizationConstants.calcDetailSidebarForfragan,
			href: `${base}/forfragan`,
			exact: false,
			disabled: false,
		},
		{
			id: "fraga-svar",
			labelKey: localizationConstants.calcDetailSidebarFragaSvar,
			href: `${base}/fraga-svar`,
			exact: false,
			disabled: false,
		},
	];

	return (
		<aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header */}
			<div className="flex h-16 w-full items-center border-b border-slate-200 px-2">
				<div className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2">
					<Link
						href="/module/business/calculation/overview"
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white transition-colors hover:bg-neutral-800"
						aria-label={t(localizationConstants.backToMainMenu)}
					>
						<ArrowLeft size={16} />
					</Link>
					<span className="flex-1 truncate text-sm font-semibold text-neutral-950">
						{t(localizationConstants.calculation)} {calcId}
					</span>
					<ChevronsUpDown size={16} className="shrink-0 text-neutral-950" />
				</div>
			</div>

			{/* Nav */}
			<nav className="flex flex-1 flex-col p-2">
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
				>
					<Folder size={16} className="shrink-0" />
					<span className="flex-1 text-left">
						{t(localizationConstants.calcDetailSidebarHeader)}
					</span>
					{expanded ? (
						<ChevronUp size={16} className="shrink-0" />
					) : (
						<ChevronDown size={16} className="shrink-0" />
					)}
				</button>

				{expanded && (
					<div className="mt-1 flex flex-col gap-1">
						{NAV_ITEMS.map((item) => {
							if (item.disabled) {
								return (
									<span
										key={item.id}
										className="flex h-8 w-full cursor-not-allowed items-center rounded-md pl-8 pr-4 text-sm font-medium text-slate-300"
									>
										{t(item.labelKey)}
									</span>
								);
							}
							const isActive = item.exact
								? pathname === item.href
								: pathname === item.href || pathname.startsWith(`${item.href}/`);
							return (
								<Link
									key={item.id}
									href={item.href}
									className={cn(
										"flex h-8 w-full items-center rounded-md pl-8 pr-4 text-sm font-medium transition-colors",
										isActive
											? "bg-slate-800 text-slate-100"
											: "text-slate-800 hover:bg-slate-200",
									)}
								>
									{t(item.labelKey)}
								</Link>
							);
						})}
					</div>
				)}
			</nav>

			{/* Back to list */}
			<div className="border-t border-slate-200 px-4 py-3">
				<Link
					href="/module/business/calculation/overview"
					className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
				>
					<ArrowLeft size={16} />
					{t(localizationConstants.backToMainMenu)}
				</Link>
			</div>
		</aside>
	);
}
