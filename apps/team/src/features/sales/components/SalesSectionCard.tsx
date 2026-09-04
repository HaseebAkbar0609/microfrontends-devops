"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type SalesSectionCardProps = {
	/** Translation key for the card heading. */
	titleKey: string;
	icon?: LucideIcon;
	/** Rendered on the right of the heading row, typically a button. */
	action?: ReactNode;
	children: ReactNode;
	className?: string;
};

/** The card shell every panel in the sales CRM sits in. */
export function SalesSectionCard({
	titleKey,
	icon: Icon,
	action,
	children,
	className,
}: SalesSectionCardProps) {
	return (
		<section
			className={cn(
				"@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs",
				className,
			)}
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
					{Icon ? <Icon className="h-4 w-4 text-slate-500" /> : null}
					<Translate text={titleKey} />
				</h2>
				{action}
			</div>
			<div className="mt-4">{children}</div>
		</section>
	);
}
