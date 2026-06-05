"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHeader, ActionsToolbar } from "@/components/common";
import { QuoteTable } from "@/features/quote/components/QuoteTable";
import { useQueryParams } from "@/hooks/useQueryParams";
import { BREADCRUMBS, PROJECT_STATUS_FILTER_OPTIONS } from "../constants";
import localizationConstants from "@/utils/translation/constants";
import { getProjectListAPIAction } from "@/api-actions";
import type { Quote } from "../types/types";

export default function OfferFeature() {
	const { search, changeQuery, query } = useQueryParams();
	const router = useRouter();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const quoteStatusFilter = query.get("quote_status") || "";
	const projectTypeFilter = query.get("project_type") || "";

	const [quotes, setQuotes] = useState<Quote[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [listVersion, setListVersion] = useState(0);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getProjectListAPIAction({
			page,
			pageSize,
			search: search.trim() || undefined,
			sortBy: sortBy || undefined,
			sortOrder: sortOrder || undefined,
			quote_status: quoteStatusFilter || undefined,
			project_type: projectTypeFilter || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setQuotes(result.data.quotes);
				setTotalItems(result.data.totalItems);
			} else {
				setQuotes([]);
				setTotalItems(0);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [
		page,
		pageSize,
		search,
		sortBy,
		sortOrder,
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
						totalItems={totalItems}
						onRefresh={() =>
							setListVersion((v) => v + 1)
						}
					/>
				)}
			</div>
		</div>
	);
}
