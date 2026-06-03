"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn, isAllowedQueryValue } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SUPPLIER_DETAIL_TABS,
	SUPPLIER_DETAIL_DEFAULT_TAB,
	SUPPLIER_DETAIL_TAB_LABELS,
	DUMMY_SUPPLIER,
	DUMMY_SERVICES,
	DUMMY_REVIEWS,
	DUMMY_STAR_BREAKDOWN,
	DUMMY_POPULAR_TAGS,
	supplierDetailTabTriggerClass,
	type Supplier,
	type SupplierService,
	type SupplierReview,
	type StarBreakdown,
	type PopularTag,
} from "../constants";
import { SupplierProfileCard } from "./SupplierProfileCard";
import { OverviewTab } from "./tabs/OverviewTab";
import { ReviewsTab } from "./tabs/ReviewsTab";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "#" },
	{ label: localizationConstants.suppliers, href: "/suppliers" },
];

export function SupplierDetailPage({ supplierId }: { supplierId: string }) {
	const searchParams = useSearchParams();
	const { changeQueries, replaceQueries } = useQueryParams();

	const activeTab = useMemo(() => {
		const raw = searchParams.get("tab");
		if (isAllowedQueryValue(raw, SUPPLIER_DETAIL_TABS)) return raw;
		return SUPPLIER_DETAIL_DEFAULT_TAB;
	}, [searchParams]);

	useEffect(() => {
		const raw = searchParams.get("tab");
		if (!isAllowedQueryValue(raw, SUPPLIER_DETAIL_TABS)) {
			replaceQueries({ tab: SUPPLIER_DETAIL_DEFAULT_TAB });
		}
	}, [searchParams, replaceQueries]);

	const handleTabChange = (value: string) => {
		changeQueries({ tab: value });
	};

	const [supplier, setSupplier] = useState<Supplier>(DUMMY_SUPPLIER);
	const [services, setServices] = useState<SupplierService[]>([]);
	const [reviews, setReviews] = useState<SupplierReview[]>([]);
	const [starBreakdown, setStarBreakdown] = useState<StarBreakdown[]>([]);
	const [popularTags, setPopularTags] = useState<PopularTag[]>([]);

	useEffect(() => {
		// TODO: replace with API calls using supplierId
		setSupplier(DUMMY_SUPPLIER);
		setServices(DUMMY_SERVICES);
		setReviews(DUMMY_REVIEWS);
		setStarBreakdown(DUMMY_STAR_BREAKDOWN);
		setPopularTags(DUMMY_POPULAR_TAGS);
	}, [supplierId]);

	return (
		<div className="flex flex-col flex-1">
			<PageHeader
				title={localizationConstants.suppliers}
				breadcrumbs={BREADCRUMBS}
			/>

			<div className="flex flex-1 gap-6 p-6 bg-slate-50/50 items-start">
				{/* Left column — profile card */}
				<div className="w-[360px] shrink-0 sticky top-6">
					<SupplierProfileCard supplier={supplier} />
				</div>

				{/* Right column — tab content */}
				<div className="flex-1 min-w-0">
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<div className="bg-white rounded-t-xl border-b border-slate-200 px-2">
							<TabsList className="flex h-auto w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0">
								{SUPPLIER_DETAIL_TABS.map((tab) => (
									<TabsTrigger
										key={tab}
										value={tab}
										className={cn(
											supplierDetailTabTriggerClass,
										)}
									>
										<Translate text={SUPPLIER_DETAIL_TAB_LABELS[tab]} />
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<div className="bg-white rounded-b-xl shadow-sm p-6">
							<TabsContent value="overview" className="mt-0">
								<OverviewTab supplier={supplier} services={services} />
							</TabsContent>

							<TabsContent value="projects" className="mt-0">
								<div className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.supplierTabProjects} /> – <Translate text={localizationConstants.comingSoon} />
								</div>
							</TabsContent>

							<TabsContent value="services" className="mt-0">
								<div className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.supplierTabServices} /> – <Translate text={localizationConstants.comingSoon} />
								</div>
							</TabsContent>

							<TabsContent value="documents" className="mt-0">
								<div className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.supplierTabDocuments} /> – <Translate text={localizationConstants.comingSoon} />
								</div>
							</TabsContent>

							<TabsContent value="reviews" className="mt-0">
								<ReviewsTab
									reviews={reviews}
									starBreakdown={starBreakdown}
									popularTags={popularTags}
								/>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
