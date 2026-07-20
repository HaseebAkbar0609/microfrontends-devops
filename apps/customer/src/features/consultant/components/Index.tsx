"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHeader, ActionsToolbar } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { getConsultantListAPIAction } from "@/api-actions";
import type { Consultant } from "../types/consultant";
import { ConsultantTable } from "./ConsultantTable";
import {
	BREADCRUMBS,
	CONSULTANT_STATUS_FILTER_OPTIONS,
	CONSULTANT_TYPE_FILTER_OPTIONS,
} from "../constants";

export default function ConsultantListFeature() {
	const router = useRouter();
	const { search, changeQuery, query } = useQueryParams();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const statusFilter = query.get("status") || "";
	const typeFilter = query.get("type") || "";

	const [consultants, setConsultants] = useState<Consultant[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getConsultantListAPIAction({
			page,
			pageSize,
			search: search.trim() || undefined,
			sortBy: sortBy || undefined,
			sortOrder: sortOrder || undefined,
			status: statusFilter || undefined,
			type: typeFilter || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setConsultants(result.data.consultants);
				setTotalItems(result.data.totalItems);
			} else {
				setConsultants([]);
				setTotalItems(0);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [page, pageSize, search, sortBy, sortOrder, statusFilter, typeFilter]);

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.consultantsTitle}
				breadcrumbs={BREADCRUMBS}
				onBack={() => router.back()}
			/>
			<ActionsToolbar
				searchValue={search}
				onSearchChange={(val) => changeQuery("search", val)}
				searchPlaceholder={
					localizationConstants.consultantSearchPlaceholder
				}
				filters={[
					{
						label: localizationConstants.status,
						options: [...CONSULTANT_STATUS_FILTER_OPTIONS],
						value: statusFilter || undefined,
						onFilterChange: (val) => changeQuery("status", val),
					},
					{
						label: localizationConstants.type,
						options: [...CONSULTANT_TYPE_FILTER_OPTIONS],
						value: typeFilter || undefined,
						onFilterChange: (val) => changeQuery("type", val),
					},
				]}
			/>
			<div className="px-5 flex-1">
				{loading ? (
					<div className="flex min-h-[240px] items-center justify-center text-slate-500">
						<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
					</div>
				) : loadError ? (
					<p className="text-sm text-red-600" role="alert">
						{loadError}
					</p>
				) : (
					<ConsultantTable
						data={consultants}
						totalItems={totalItems}
					/>
				)}
			</div>
		</div>
	);
}
