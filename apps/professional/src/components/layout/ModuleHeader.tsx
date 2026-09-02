"use client";

import { usePathname } from "next/navigation";
import { RouteTabs, isRouteTabActive } from "@/components/layout/RouteTabs";
import { RouteTabItem } from "@/types/navigation";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

import type { BreadcrumbItem } from "@/types/common";
import { PageHeader } from "@/components/layout/PageHeader";

interface ModuleHeaderProps {
	titleKey?: string;
	title?: string;
	breadcrumbs?: BreadcrumbItem[];
	items: RouteTabItem[];
	className?: string;
	containerClassName?: string;
	/**
	 * When true, automatically hides the header when the user is on a deep route
	 * not matched by any tab in `items`. Default is `true`.
	 */
	autoHideOnSubRoutes?: boolean;
}

export function ModuleHeader({
	titleKey,
	title,
	breadcrumbs,
	items,
	className,
	containerClassName,
	autoHideOnSubRoutes = true,
}: ModuleHeaderProps) {
	const pathname = usePathname();
	const isMatched = items.some((item) => isRouteTabActive(item, pathname));

	if (autoHideOnSubRoutes && !isMatched) {
		return null;
	}

	return (
		<div
			className={cn(
				"shrink-0 border-b border-slate-200 bg-white",
				containerClassName,
			)}
		>
			{breadcrumbs && breadcrumbs.length > 0 ? (
				<PageHeader
					title={titleKey || title || ""}
					breadcrumbs={breadcrumbs}
					className="border-b-0 px-6 pt-5 pb-2"
				/>
			) : (titleKey || title) ? (
				<div className="px-6 pt-5 pb-3.5">
					<h1 className="text-2xl font-bold tracking-tight text-slate-950">
						{titleKey ? <Translate text={titleKey} /> : title}
					</h1>
				</div>
			) : null}
			<div className={cn("px-6 -mb-[1px]", className)}>
				<RouteTabs items={items} />
			</div>
		</div>
	);
}
