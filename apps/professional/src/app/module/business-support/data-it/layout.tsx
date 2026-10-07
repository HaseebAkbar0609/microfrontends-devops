"use client";

import React from "react";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	dataItNavItems,
	dataItBreadcrumbs,
} from "@/features/data-it/constants/dataItNav.config";

export default function DataItLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = useTranslate();

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">
				<PageHeader
					title={localizationConstants.dataIT}
					breadcrumbs={dataItBreadcrumbs(localizationConstants.dataIT)}
					className="border-b-0 px-6 pt-5 pb-2"
				/>
				<div className="border-b border-slate-200 bg-white px-6">
					<RouteTabs
						items={dataItNavItems}
						ariaLabel={t(localizationConstants.dataItAriaSections)}
					/>
				</div>
				{children}
			</div>
		</div>
	);
}

