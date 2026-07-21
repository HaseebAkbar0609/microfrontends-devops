"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { getConsultantTypesAPIAction } from "@/api-actions";
import type { ConsultantTypeItem } from "../../types/consultantType";
import { ConsultantTypeList } from "./ConsultantTypeList";
import { ConsultantTypeDetail } from "./ConsultantTypeDetail";
import { FindMyConsultantButton } from "../FindMyConsultantButton";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function ConsultantTypePanel() {
	const t = useTranslate();
	const [types, setTypes] = useState<ConsultantTypeItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const debouncedSearch = useDebounce(search, 500);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);

		void getConsultantTypesAPIAction({ search: debouncedSearch }).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setTypes(result.data);
				setSelectedId((prev) => {
					if (prev && result.data?.find(t => t.id === prev)) {
						return prev;
					}
					return result.data?.[0]?.id ?? null;
				});
			} else {
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [debouncedSearch]);

	const selectedType = useMemo(
		() => types.find((t) => t.id === selectedId) ?? null,
		[types, selectedId],
	);

	if (loading) {
		return (
			<div className="flex min-h-[300px] items-center justify-center text-slate-500">
				<Loader2 className="h-8 w-8 animate-spin" aria-hidden />
			</div>
		);
	}

	if (loadError) {
		return (
			<p className="p-5 text-sm text-red-600" role="alert">
				{loadError}
			</p>
		);
	}

	return (
		<div className="grid flex-1 grid-cols-1 bg-white md:grid-cols-[300px_1fr]">
			<aside className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
				<div className="relative mb-3">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t(localizationConstants.searchPlaceholder)}
						className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
					/>
				</div>
				<ConsultantTypeList
					types={types}
					selectedId={selectedId}
					onSelect={setSelectedId}
				/>
			</aside>

			<div className="flex flex-col gap-5 p-10 relative">
				<div className="flex justify-end absolute right-10 top-10">
					<FindMyConsultantButton />
				</div>
				<ConsultantTypeDetail type={selectedType} />
			</div>
		</div>
	);
}
