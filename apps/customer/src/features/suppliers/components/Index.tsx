"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
import { Search } from "@/components/search/Search";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getSuppliersAPIAction } from "@/api-actions";
import type { Supplier } from "../types/types";
import { SUPPLIER_BREADCRUMBS } from "../constants";
import { SupplierTable } from "./SupplierTable";
import { CreateSupplierView } from "./CreateSupplierView";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export default function SuppliersFeature() {
	const { search, changeQuery, query } = useQueryParams();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [showCreate, setShowCreate] = useState(false);
	const [listVersion, setListVersion] = useState(0);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(null);

		void getSuppliersAPIAction({
			page,
			pageSize,
			search: search.trim() || undefined,
			sortBy: sortBy || undefined,
			sortOrder: sortOrder || undefined,
		}).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setSuppliers(result.data.suppliers);
				setTotalItems(result.data.totalItems);
			} else {
				setSuppliers([]);
				setTotalItems(0);
				setLoadError(result.error ?? null);
			}
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [page, pageSize, search, sortBy, sortOrder, listVersion]);

	if (showCreate) {
		return (
			<CreateSupplierView
				onBack={() => setShowCreate(false)}
				onSuccess={() => {
					setShowCreate(false);
					setListVersion((v) => v + 1);
				}}
			/>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.suppliers}
				breadcrumbs={SUPPLIER_BREADCRUMBS}
			/>

			{/* Toolbar */}
			<div className="flex items-center justify-between gap-4 px-5 py-6">
				<div className="flex items-center gap-3">
					<Search
						value={search}
						onChange={(val) => changeQuery("search", val)}
						placeholder={localizationConstants.searchPlaceholder}
						className="h-10 w-full max-w-[300px]"
					/>
					<Button
						variant="outline"
						className="h-10 border-slate-200 text-slate-700 font-normal hover:bg-transparent gap-2"
					>
						<Filter className="h-4 w-4" />
						<Translate text={localizationConstants.filter} />
					</Button>
				</div>
				<div className="flex items-center gap-2">
<Button
						className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md"
						onClick={() => setShowCreate(true)}
					>
						<Plus className="h-4 w-4" />
						<Translate text={localizationConstants.createNewButtonText} />
					</Button>
				</div>
			</div>

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
					<SupplierTable data={suppliers} totalItems={totalItems} />
				)}
			</div>
		</div>
	);
}
