"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
import { Search } from "@/components/search/Search";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getSuppliersAPIAction, deleteSupplierAPIAction } from "@/api-actions";
import type { Supplier } from "../types/types";
import { SUPPLIER_BREADCRUMBS } from "../constants";
import { SupplierTable } from "./SupplierTable";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { toast } from "sonner";

export default function SuppliersFeature() {
	const t = useTranslate();
	const { search, changeQuery, query } = useQueryParams();
	const router = useRouter();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const handleDelete = useCallback(
		async (supplier: Supplier) => {
			const confirmed = window.confirm(
				t(localizationConstants.deleteSupplierConfirm, {
					name: supplier.companyName,
				}),
			);
			if (!confirmed) return;

			const result = await deleteSupplierAPIAction(supplier.id);
			if (result.success) {
				toast.success(t(localizationConstants.supplierDeletedSuccess));
				setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id));
				setTotalItems((prev) => prev - 1);
			} else {
				toast.error(
					result.error || t(localizationConstants.supplierDeleteError),
				);
			}
		},
		[t],
	);
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
	}, [page, pageSize, search, sortBy, sortOrder]);

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.suppliers}
				breadcrumbs={SUPPLIER_BREADCRUMBS}
			/>

			{/* Toolbar */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
					<Search
						value={search}
						onChange={(val) => changeQuery("search", val)}
						placeholder={localizationConstants.search}
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
				<div className="w-full sm:w-auto flex">
					<Button
						className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md w-full sm:w-auto justify-center"
						onClick={() => router.push("/suppliers/new")}
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.createNewButtonText}
						/>
					</Button>
				</div>
			</div>

			<div className="px-5 pb-5 flex-1 w-full">
				{loadError ? (
					<p className="text-sm text-red-600" role="alert">
						{loadError}
					</p>
				) : (
					<SupplierTable
						data={suppliers}
						totalItems={totalItems}
						loading={loading}
						onDelete={handleDelete}
					/>
				)}
			</div>
		</div>
	);
}
