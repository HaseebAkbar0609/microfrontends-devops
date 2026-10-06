"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHeader, ActionsToolbar } from "@/components/common";
import { QuoteTable } from "@/features/quote/components/QuoteTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import {
	ACCEPTED_OFFER_QUOTE_STATUS,
	BREADCRUMBS,
	PROJECT_STATUS_FILTER_OPTIONS,
} from "../constants";
import localizationConstants from "@/utils/translation/constants";
import { getProjectListAPIAction } from "@/api-actions";
import type { Quote } from "../types/types";

const SHOW_OFFER_DASHBOARD_FILTERS = false;

export default function OfferFeature() {
	const { search, changeQuery, query } = useQueryParams();
	const router = useRouter();

	const quoteStatusFilter = query.get("quote_status") || "";
	const projectTypeFilter = query.get("project_type") || "";

	const [quotes, setQuotes] = useState<Quote[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [listVersion, setListVersion] = useState(0);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getProjectListAPIAction({
			page: 1,
			pageSize: 100,
			search: SHOW_OFFER_DASHBOARD_FILTERS
				? search.trim() || undefined
				: undefined,
			quote_status: SHOW_OFFER_DASHBOARD_FILTERS
				? quoteStatusFilter || undefined
				: undefined,
			project_type: SHOW_OFFER_DASHBOARD_FILTERS
				? projectTypeFilter || undefined
				: undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				// Accepted offers are active projects and are listed there instead.
				// Filtered here because the list API's quote_status takes one value
				// and cannot exclude one; move it server-side once the list pages.
				setQuotes(
					result.data.quotes.filter(
						(q) => q.quote_status !== ACCEPTED_OFFER_QUOTE_STATUS,
					),
				);
			} else {
				setQuotes([]);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [
		search,
		quoteStatusFilter,
		projectTypeFilter,
		listVersion,
	]);

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.offer}
				breadcrumbs={BREADCRUMBS}
			/>
			<ActionsToolbar
				searchValue={search}
				onSearchChange={(val) => changeQuery("search", val)}
				onCreateClick={() => router.push("/business/offer/create")}
				showSearch={SHOW_OFFER_DASHBOARD_FILTERS}
				showFilters={SHOW_OFFER_DASHBOARD_FILTERS}
				filters={[
					{
						label: localizationConstants.status,
						options: [...PROJECT_STATUS_FILTER_OPTIONS],
						value: query.get("quote_status") || undefined,
						onFilterChange: (val) =>
							changeQuery("quote_status", val),
					},
					{
						label: localizationConstants.type,
						options: [
							{ label: localizationConstants.b2c, value: "b2c" },
							{
								label: localizationConstants.offerExpress,
								value: "express",
							},
						],
						value: query.get("project_type") || undefined,
						onFilterChange: (val) => changeQuery("project_type", val),
					},
				]}
			/>
			<div className="p-5 flex-1">
				{loading ? (
					<div className="flex min-h-[240px] items-center justify-center text-slate-500">
						<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
					</div>
				) : loadError ? (
					<p className="text-sm text-red-600" role="alert">
						{loadError}
					</p>
				) : (
					<QuoteTable
						data={quotes}
						onRefresh={() =>
							setListVersion((v) => v + 1)
						}
					/>
				)}
			</div>
		</div>
	);
}
