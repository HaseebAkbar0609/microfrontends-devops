"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, ChevronsUpDown, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface OfferDetailSubSidebarProps {
	offerId: string;
}

export function OfferDetailSubSidebar({ offerId }: OfferDetailSubSidebarProps) {
	const [expanded, setExpanded] = useState(true);
	const pathname = usePathname();
	const t = useTranslate();

	const base = `/module/business/offer/${offerId}`;

	const STATUS_ITEMS = [
		{ id: "overview", label: t(localizationConstants.offerStatusOverview), href: `${base}/overview` },
		{ id: "quoted", label: t(localizationConstants.offerStatusQuoted), href: `${base}/quoted` },
		{ id: "accepted", label: t(localizationConstants.accepted), href: `${base}/accepted` },
		{ id: "agreed", label: t(localizationConstants.offerStatusAgreed), href: `${base}/agreed` },
		{ id: "archived", label: t(localizationConstants.offerStatusArchived), href: `${base}/archived` },
	];

	const currentStatus = pathname.split("/").at(-1);
	const activeId = STATUS_ITEMS.find((item) => item.id === currentStatus)?.id ?? "overview";

	return (
		<aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
			{/* Header */}
			<div className="flex h-16 w-full items-center border-b border-slate-200 px-2">
				<div className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2">
					<Link
						href="/module/business/offer/list"
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
						aria-label={t(localizationConstants.backToMainMenu)}
					>
						<ArrowLeft size={16} />
					</Link>
					<span className="flex-1 truncate text-sm font-semibold text-neutral-950">
						{t(localizationConstants.quoteNo)} {offerId}
					</span>
					<ChevronsUpDown size={16} className="shrink-0 text-neutral-950" />
				</div>
			</div>

			{/* Nav */}
			<nav className="flex flex-1 flex-col p-2">
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors"
				>
					<Folder size={16} className="shrink-0" />
					<span className="flex-1 text-left">{t(localizationConstants.offerManagement)}</span>
					{expanded ? (
						<ChevronUp size={16} className="shrink-0" />
					) : (
						<ChevronDown size={16} className="shrink-0" />
					)}
				</button>

				{expanded && (
					<div className="mt-1 flex flex-col gap-1">
						{STATUS_ITEMS.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								className={cn(
									"flex h-8 w-full items-center rounded-md pl-8 pr-4 text-sm font-medium transition-colors",
									activeId === item.id
										? "bg-slate-800 text-slate-100"
										: "text-slate-800 hover:bg-slate-200",
								)}
							>
								{item.label}
							</Link>
						))}
					</div>
				)}
			</nav>

			{/* Back to main menu */}
			<div className="border-t border-slate-200 px-4 py-3">
				<Link
					href="/module/business/offer/list"
					className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
				>
					<ArrowLeft size={16} />
					{t(localizationConstants.backToMainMenu)}
				</Link>
			</div>
		</aside>
	);
}
