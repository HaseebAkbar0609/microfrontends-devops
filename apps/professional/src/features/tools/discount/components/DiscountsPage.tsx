"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DISCOUNTS_BREADCRUMBS, DISCOUNT_SKELETON_COUNT } from "../constants";
import { useDiscounts } from "../hooks/useDiscounts";
import { DiscountCard } from "./DiscountCard";
import { DiscountsEmptyState } from "./DiscountsEmptyState";
import { DiscountsToolbar } from "./DiscountsToolbar";

function DiscountGridSkeleton() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),320px))] gap-4">
			{Array.from({ length: DISCOUNT_SKELETON_COUNT }).map((_, index) => (
				<div
					key={index}
					className="h-[360px] animate-pulse rounded-[12px] bg-[#F1F5F9]"
				/>
			))}
		</div>
	);
}

export function DiscountsPage() {
	const {
		discounts,
		filterOptions,
		filtersLoading,
		listLoading,
		error,
		supplier,
		setSupplier,
		category,
		setCategory,
		status,
		setStatus,
		hasActiveFilters,
		clearFilters,
		hasAnyDiscounts,
	} = useDiscounts();

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.discountsItem}
				breadcrumbs={DISCOUNTS_BREADCRUMBS}
			/>

			<div className="bg-white">
				<div className="mt-4 flex flex-col gap-1.5 pb-6 pl-5 pr-0 pt-0">
					<h2 className="text-2xl font-semibold leading-none tracking-[-0.025em] text-[#020617]">
						<Translate text={localizationConstants.discountsAllTitle} />
					</h2>
					<p className="text-sm leading-5 text-[#64748B]">
						<Translate text={localizationConstants.discountsSubtitle} />
					</p>
				</div>

				<DiscountsToolbar
					loading={filtersLoading}
					options={filterOptions}
					supplier={supplier}
					onSupplierChange={setSupplier}
					category={category}
					onCategoryChange={setCategory}
					status={status}
					onStatusChange={setStatus}
				/>

				<div className="p-5">
					{listLoading ? (
						<DiscountGridSkeleton />
					) : error ? (
						<p className="py-12 text-center text-sm text-red-500">{error}</p>
					) : discounts.length === 0 ? (
						<DiscountsEmptyState
							isFiltered={hasAnyDiscounts && hasActiveFilters}
							onClearFilters={clearFilters}
						/>
					) : (
						<div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),320px))] gap-4">
							{discounts.map((discount) => (
								<DiscountCard key={discount.id} discount={discount} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
