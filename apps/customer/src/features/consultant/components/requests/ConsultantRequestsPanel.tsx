"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ActionsToolbar } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { 
	getConsultantRequestsAPIAction,
	getConsultantTypesAPIAction
} from "@/api-actions";
import type { ConsultantRequest } from "../../types/consultantRequest";
import { ConsultantRequestsTable } from "./ConsultantRequestsTable";

export function ConsultantRequestsPanel() {
	const router = useRouter();
	const { search, changeQuery, query } = useQueryParams();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const consultantFilter = query.get("consultant") || "";

	const [requests, setRequests] = useState<ConsultantRequest[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [filterOptions, setFilterOptions] = useState<{label: string; value: string}[]>([]);

	useEffect(() => {
		let cancelled = false;
		void getConsultantTypesAPIAction().then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setFilterOptions(
					result.data.map((t) => ({
						label: t.name,
						value: t.id,
					}))
				);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getConsultantRequestsAPIAction({
			page,
			pageSize,
			search: search.trim() || undefined,
			sortBy: sortBy || undefined,
			sortOrder: sortOrder || undefined,
			consultant: consultantFilter || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setRequests(result.data.requests);
				setTotalItems(result.data.totalItems);
			} else {
				setRequests([]);
				setTotalItems(0);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [page, pageSize, search, sortBy, sortOrder, consultantFilter]);

	return (
		<div className="flex flex-col">
			<ActionsToolbar
				searchValue={search}
				onSearchChange={(val) => changeQuery("search", val)}
				filters={[
					{
						label: localizationConstants.filter,
						options: filterOptions,
						value: consultantFilter || undefined,
						onFilterChange: (val) => changeQuery("consultant", val),
					},
				]}
				onCreateClick={() =>
					router.push("/business/consultant/create")
				}
				createButtonLabel={localizationConstants.findMyConsultant}
			/>
			<div className="px-5 pb-5 flex-1">
				{loading ? (
					<div className="flex min-h-[240px] items-center justify-center text-slate-500">
						<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
					</div>
				) : loadError ? (
					<p className="text-sm text-red-600" role="alert">
						{loadError}
					</p>
				) : (
					<ConsultantRequestsTable
						data={requests}
						totalItems={totalItems}
					/>
				)}
			</div>
		</div>
	);
}
