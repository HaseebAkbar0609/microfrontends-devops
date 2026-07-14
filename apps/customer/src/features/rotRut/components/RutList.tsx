"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getRutEntries, type RotEntry } from "@/api-actions/rotRut";
import { RutTable } from "./RutTable";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";

export function RutList() {
	const { t } = useTranslation();
	const { search, changeQuery, query } = useQueryParams();
	const router = useRouter();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [rutEntries, setRutEntries] = useState<RotEntry[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getRutEntries("dummy-project-id", {
			page,
			pageSize,
			search: search.trim() || undefined,
			sortBy: sortBy || undefined,
			sortOrder: (sortOrder as "asc" | "desc" | null) || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setRutEntries(result.data.rutEntries);
				setTotalItems(result.data.totalItems);
			} else {
				setRutEntries([]);
				setTotalItems(0);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [page, pageSize, search, sortBy, sortOrder]);

	return (
		<div className="flex flex-col flex-1 w-full bg-white">
			{/* Toolbar */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto">
					<Search
						value={search}
						onChange={(val) => changeQuery("search", val)}
						placeholder={t(localizationConstants.search)}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[240px] lg:w-[300px]"
					/>
					<Button
						variant="outline"
						className="h-10 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-2 w-full sm:w-auto justify-center"
					>
						<Translate text={localizationConstants.filter} />
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</Button>
				</div>
				<div className="w-full sm:w-auto">
					<Button
						className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md w-full sm:w-auto justify-center"
						onClick={() => router.push("/rotRut/rut/create")}
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.createRutBtn} />
					</Button>
				</div>
			</div>

			<div className="pb-5 flex-1 w-full lg:w-[75%]">
				{loadError ? (
					<p className="text-sm text-red-600 font-medium" role="alert">
						{loadError}
					</p>
				) : (
					<RutTable
						data={rutEntries}
						totalItems={totalItems}
						loading={loading}
					/>
				)}
			</div>
		</div>
	);
}
