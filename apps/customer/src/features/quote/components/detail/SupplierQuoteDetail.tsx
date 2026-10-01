"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/common";
import { cn, isAllowedQueryValue } from "@/lib/utils";
import { QuoteTab } from "./tabs/QuoteTab";
import { CompanyInfoTab } from "./tabs/CompanyInfoTab";
import { ReferenceTab } from "./tabs/ReferenceTab";
import { DiscussionsTab } from "./tabs/DiscussionsTab";
import {
	COMPANIES,
	SUPPLIER_QUOTE_DETAIL_DEFAULT_TAB,
	SUPPLIER_QUOTE_DETAIL_TABS,
	detailTabTriggerClass,
} from "../../constants";

import type { QuoteDocument, QuoteSupplier } from "../../types/form";

export function SupplierQuoteDetail({
	projectName,
	supplier,
	supplierId,
	documents = [],
	quoteId,
	projectId,
	quoteStatus,
}: {
	projectName: string;
	supplier?: QuoteSupplier | null;
	supplierId?: string;
	documents?: QuoteDocument[];
	quoteId?: string;
	projectId?: string;
	quoteStatus?: string;
}) {
	const searchParams = useSearchParams();
	const { changeQueries, replaceQueries } = useQueryParams();

	const activeTab = useMemo(() => {
		const raw = searchParams.get("tab");
		if (isAllowedQueryValue(raw, SUPPLIER_QUOTE_DETAIL_TABS)) return raw;
		return SUPPLIER_QUOTE_DETAIL_DEFAULT_TAB;
	}, [searchParams]);

	useEffect(() => {
		const raw = searchParams.get("tab");
		if (!isAllowedQueryValue(raw, SUPPLIER_QUOTE_DETAIL_TABS)) {
			replaceQueries({ tab: SUPPLIER_QUOTE_DETAIL_DEFAULT_TAB });
		}
	}, [searchParams, replaceQueries]);

	const handleTabChange = (value: string) => {
		changeQueries({ tab: value });
	};

	const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
		supplierId || "1",
	);

	const selectedCompany = COMPANIES.find((c) => c.id === selectedCompanyId);
	const displaySupplierName = supplier?.companyName || "Supplier";

	const breadcrumbs = [
		{ label: localizationConstants.home, href: "/home" },
		{ label: localizationConstants.business, href: "/business" },
		{ label: localizationConstants.quote, href: "/business/offer" },
		{ label: projectName, href: "#" },
		{ label: displaySupplierName },
	];

	return (
		<div className="flex flex-col flex-1 bg-slate-50/50 min-h-screen pb-20">
			<div className="bg-white border-b border-slate-200">
				<PageHeader
					title={`${projectName} / ${displaySupplierName}`}
					breadcrumbs={breadcrumbs}
					className="border-none px-8 py-6"
				/>

				<div className="px-8 overflow-hidden">
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10">
							<TabsTrigger
								value="quote"
								className={cn(detailTabTriggerClass)}
							>
								<Translate text={localizationConstants.quote} />
							</TabsTrigger>
							<TabsTrigger
								value="company-info"
								className={cn(detailTabTriggerClass)}
							>
								<Translate
									text={
										localizationConstants.companyInfoLabel
									}
								/>
							</TabsTrigger>
							<TabsTrigger
								value="reference"
								className={cn(detailTabTriggerClass)}
							>
								<Translate
									text={localizationConstants.referenceLabel}
								/>
							</TabsTrigger>
							<TabsTrigger
								value="discussions"
								className={cn(detailTabTriggerClass)}
							>
								<Translate
									text={
										localizationConstants.discussionsLabel
									}
								/>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			<div className="px-5 py-6 mx-auto w-full">
				<Tabs value={activeTab} className="w-full">
					<QuoteTab supplier={supplier} documents={documents} quoteId={quoteId} projectId={projectId} quoteStatus={quoteStatus} />
					<CompanyInfoTab supplier={supplier} />
					<ReferenceTab />
					<DiscussionsTab
						companies={COMPANIES}
						selectedCompanyId={selectedCompanyId}
						onSelectCompany={setSelectedCompanyId}
						selectedCompany={selectedCompany}
					/>
				</Tabs>
			</div>
		</div>
	);
}
