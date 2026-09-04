"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export type SalesBreadcrumb = {
	label: ReactNode;
	href?: string;
};

type SalesPageHeaderProps = {
	title: ReactNode;
	subtitle?: ReactNode;
	/** Crumbs after the fixed Home → Module → Sales CRM prefix. */
	trail?: SalesBreadcrumb[];
	actions?: ReactNode;
	className?: string;
};

const SALES_CRM_HREF = "/module/sales";

/** Shared heading, breadcrumb and action row for every sales CRM page. */
export function SalesPageHeader({
	title,
	subtitle,
	trail = [],
	actions,
	className,
}: SalesPageHeaderProps) {
	const items: SalesBreadcrumb[] = [
		{
			label: <Translate text={localizationConstants.dashboard} />,
			href: "/home",
		},
		{ label: <Translate text={localizationConstants.moduleItem} /> },
		{
			label: <Translate text={localizationConstants.salesCrmTitle} />,
			href: trail.length > 0 ? SALES_CRM_HREF : undefined,
		},
		...trail,
	];

	return (
		<div
			className={`flex flex-wrap items-start justify-between gap-4 ${className ?? ""}`}
		>
			<div className="flex min-w-0 flex-col gap-2">
				<h1 className="truncate text-2xl font-semibold text-slate-900">
					{title}
				</h1>
				{subtitle}
				<DynamicBreadcrumb
					separator={<ChevronRight className="h-3 w-3" />}
					items={items}
				/>
			</div>
			{actions ? (
				<div className="flex flex-wrap items-center gap-2">{actions}</div>
			) : null}
		</div>
	);
}
