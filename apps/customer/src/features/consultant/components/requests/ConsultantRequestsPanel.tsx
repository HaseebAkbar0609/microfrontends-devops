"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ActionsToolbar } from "@/components/common";
import { useQueryParams } from "@/hooks/useQueryParams";
import localizationConstants from "@/utils/translation/constants";
import { getConsultantRequestsAPIAction } from "@/api-actions";
import type { ConsultantRequest } from "../../types/consultantRequest";
import { ConsultantRequestsTable } from "./ConsultantRequestsTable";

export function ConsultantRequestsPanel() {
	const router = useRouter();
	const { query } = useQueryParams();

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [requests, setRequests] = useState<ConsultantRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getConsultantRequestsAPIAction({
			page: 1,
			pageSize: 100,
			sortBy: sortBy || undefined,
			sortOrder: sortOrder || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setRequests(result.data.requests);
			} else {
				setRequests([]);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [sortBy, sortOrder]);

	return (
		<div className="flex flex-col">
			<ActionsToolbar
				searchValue=""
				onSearchChange={() => { }}
				showSearch={false}
				showFilters={false}
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
					<ConsultantRequestsTable data={requests} />
				)}
			</div>
		</div>
	);
}
