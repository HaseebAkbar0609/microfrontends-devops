"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RecordNavRow } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

interface Props {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

export default function CalculationDetailLayout({ children, params }: Props) {
	const resolvedParams = use(params);
	const calcId = resolvedParams.id;
	const t = useTranslate();
	const pathname = usePathname();
	const base = `/module/business/calculation/overview/${calcId}`;

	const tabs = [
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
			matches: [`${base}/inquiry`, `${base}/forfragan`],
		},
		{
			id: "qa",
			labelKey: localizationConstants.calcDetailSidebarFragaSvar,
			href: `${base}/qa`,
			matches: [`${base}/qa`, `${base}/fraga-svar`],
		},
	];

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			<div className="shrink-0 border-b border-slate-200 bg-white px-4 sm:px-6 pt-4">
				<RecordNavRow
					title={`${t(localizationConstants.calculation)} ${calcId}`}
					backHref="/module/business/calculation/overview"
					className="pt-0 pb-2"
					titleClassName="font-sans font-semibold text-lg sm:text-xl md:text-2xl leading-8 tracking-tight text-slate-950"
				/>
				<div className="-mb-[1px] ml-0 sm:ml-9 overflow-x-auto scrollbar-none">
					<nav
						className="inline-flex items-center gap-1 sm:gap-2 h-[36px] min-w-max"
						aria-label="Calculation Tabs"
					>
						{tabs.map((tab) => {
							const isActive = tab.exact
								? pathname === tab.href
								: pathname === tab.href ||
								  pathname.startsWith(`${tab.href}/`) ||
								  Boolean(tab.matches?.some((m) => pathname.startsWith(m)));

							return (
								<Link
									key={tab.id}
									href={tab.href}
									className={cn(
										"relative inline-flex items-center justify-center h-[36px] px-3 sm:px-4.5 pb-2 pt-1 font-sans text-sm font-semibold leading-none tracking-normal text-center whitespace-nowrap transition-colors",
										isActive
											? "text-slate-950 font-bold"
											: "text-slate-600 hover:text-slate-900 font-medium",
									)}
								>
									<Translate text={tab.labelKey} />
									{isActive && (
										<span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-950 z-10" />
									)}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
				{children}
			</div>
		</div>
	);
}
