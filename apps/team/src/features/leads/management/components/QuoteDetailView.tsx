"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import QuoteDetailHeader from "@/features/leads/management/components/QuoteDetailHeader";
import QuoteOfferDetailsCard from "@/features/leads/management/components/QuoteOfferDetailsCard";
import QuoteSpecificationCard from "@/features/leads/management/components/QuoteSpecificationCard";
import QuoteItemsCard from "@/features/leads/management/components/QuoteItemsCard";
import QuoteReferencesTab from "@/features/leads/management/components/QuoteReferencesTab";
import QuoteCompanyTab from "@/features/leads/management/components/QuoteCompanyTab";
import { useLeadQuoteDetails } from "@/features/leads/queries/useLeadQuoteDetails";
import { findDummyLeadByLeadNumber } from "@/features/leads/management/constants/dummyLeadLookup";

type QuoteDetailViewProps = {
	leadId: string;
	quoteId: string;
};

const quoteTabs = [
	{ value: "quote", labelKey: localizationConstants.quoteTab },
	{ value: "company", labelKey: localizationConstants.companyTab },
	{ value: "references", labelKey: localizationConstants.referencesTab },
];

export default function QuoteDetailView({ leadId, quoteId }: QuoteDetailViewProps) {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState("quote");
	const quoteDetailQuery = useLeadQuoteDetails(leadId, quoteId);
	const quoteDetail = quoteDetailQuery.data;

	const sourceParam = searchParams.get("source");
	const resolvedLeadId = findDummyLeadByLeadNumber(leadId)?.id ?? leadId;
	const backHref = `/leads/management/${resolvedLeadId}?tab=quote-list${sourceParam ? `&source=${sourceParam}` : ""}`;

	if (!quoteDetail) {
		return (
			<div className="flex h-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<QuoteDetailHeader title="-" backHref={backHref} />
				<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.noLeadsFound} />
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
			<QuoteDetailHeader title={quoteDetail.companyName} backHref={backHref} />

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList
					variant="line"
					className="w-full justify-start gap-3 border-b border-slate-200 p-0"
				>
					{quoteTabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="w-fit flex-none px-6 py-3 text-sm"
						>
							<Translate text={tab.labelKey} />
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="quote" className="pt-6">
					<div className="grid gap-6 lg:grid-cols-2">
						<QuoteOfferDetailsCard detail={quoteDetail} />
						<QuoteSpecificationCard documents={quoteDetail.documents} />
					</div>

					<div className="mt-6">
						<QuoteItemsCard items={quoteDetail.items} totals={quoteDetail.totals} />
					</div>

					<div className="mt-6 flex justify-end gap-3 mb-10">
						<Button variant="outline" className="cursor-pointer h-10 bg-danger text-white hover:bg-red-500 hover:text-white">
							<Translate text={localizationConstants.rejectLabel} />
						</Button>
						<Button className="h-10 bg-success cursor-pointer text-white hover:bg-green-500">
							<Translate text={localizationConstants.approveLabel} />
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="company" className="pt-6">
					<QuoteCompanyTab detail={quoteDetail} />
				</TabsContent>

				<TabsContent value="references" className="pt-6">
					<QuoteReferencesTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
