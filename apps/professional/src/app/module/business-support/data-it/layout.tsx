"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import {
	dataItNavItems,
	dataItBreadcrumbs,
} from "@/features/data-it/constants/dataItNav.config";

export default function DataItLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isSubRoute =
		pathname.includes("/create") ||
		pathname.includes("/edit") ||
		pathname.includes("/import");

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">
				{!isSubRoute && (
					<>
						<PageHeader
							title={localizationConstants.dataIT}
							breadcrumbs={dataItBreadcrumbs(localizationConstants.dataIT)}
							className="border-b-0 px-6 pt-5 pb-2"
						/>
						<div className="border-b border-slate-200 bg-white px-6">
							<RouteTabs
								items={dataItNavItems}
								ariaLabel="Data IT sections"
							/>
						</div>
					</>
				)}
				{children}
			</div>
		</div>
	);
}
