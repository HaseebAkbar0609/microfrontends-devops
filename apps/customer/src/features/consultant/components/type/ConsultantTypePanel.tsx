"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { getConsultantTypesAPIAction } from "@/api-actions";
import type { ConsultantTypeItem } from "../../types/consultantType";
import { ConsultantTypeList } from "./ConsultantTypeList";
import { ConsultantTypeDetail } from "./ConsultantTypeDetail";
import { FindMyConsultantButton } from "../FindMyConsultantButton";

export function ConsultantTypePanel() {
	const [types, setTypes] = useState<ConsultantTypeItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		void getConsultantTypesAPIAction({}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setTypes(result.data);
				setSelectedId((prev) => prev ?? result.data?.[0]?.id ?? null);
			} else {
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const filteredTypes = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return types;
		return types.filter((t) => t.name.toLowerCase().includes(q));
	}, [types, search]);

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
				<ConsultantTypeList
					types={filteredTypes}
					selectedId={selectedId}
					onSelect={setSelectedId}
					search={search}
					onSearchChange={setSearch}
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
