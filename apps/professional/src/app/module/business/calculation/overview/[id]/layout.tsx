"use client";

import { use } from "react";
import { RecordNavRow } from "@/components/layout/navigation";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { RouteTabItem } from "@/types/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

interface Props {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

export default function CalculationDetailLayout({ children, params }: Props) {
	const resolvedParams = use(params);
	const calcId = resolvedParams.id;
	const t = useTranslate();
	const base = `/module/business/calculation/overview/${calcId}`;

	const tabs: RouteTabItem[] = [
		{
			id: "information",
			labelKey: localizationConstants.protocolFieldInformation,
			href: base,
			exact: true,
		},
		{
			id: "kalkylberakning",
			labelKey: localizationConstants.calcBerPageTitle,
			href: `${base}/kalkylberakning`,
		},
		{
			id: "inquiry",
			labelKey: localizationConstants.calcDetailSidebarForfragan,
			href: `${base}/inquiry`,
			matchSubPaths: [`${base}/forfragan`],
		},
		{
			id: "qa",
			labelKey: localizationConstants.calcDetailSidebarFragaSvar,
			href: `${base}/qa`,
			matchSubPaths: [`${base}/fraga-svar`],
		},
	];

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="border-b border-slate-200 bg-white px-6 pt-4 shrink-0">
				<RecordNavRow
					title={`${t(localizationConstants.calculation)} ${calcId}`}
					backHref="/module/business/calculation/overview"
					className="pt-0 pb-2"
				/>
				<div className="-mb-[1px]">
					<RouteTabs items={tabs} ariaLabel="Calculation Detail Tabs" />
				</div>
			</div>
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">
				{children}
			</div>
		</div>
	);
}
