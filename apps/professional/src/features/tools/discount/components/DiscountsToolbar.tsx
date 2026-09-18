"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DISCOUNT_FILTER_ALL,
	DISCOUNT_STATUS_LABELS,
	DISCOUNT_STATUS_ORDER,
} from "../constants";
import type { DiscountFilters, DiscountStatus } from "../types/discount.types";

interface DiscountsToolbarProps {
	loading: boolean;
	options: DiscountFilters;
	supplier: string;
	onSupplierChange: (value: string) => void;
	category: string;
	onCategoryChange: (value: string) => void;
	status: DiscountStatus | "";
	onStatusChange: (value: DiscountStatus | "") => void;
}

const TRIGGER_CLASS =
	"h-auto w-[200px] rounded-[6px] border-0 bg-[#F1F5F9] px-3 py-1.5 text-sm font-semibold text-[#0A0A0A] shadow-none";

export function DiscountsToolbar({
	loading,
	options,
	supplier,
	onSupplierChange,
	category,
	onCategoryChange,
	status,
	onStatusChange,
}: DiscountsToolbarProps) {
	const t = useTranslate();

	if (loading) {
		return (
			<div className="flex flex-wrap items-center gap-4 px-5 py-3">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="h-9 w-[200px] animate-pulse rounded-[6px] bg-[#F1F5F9]"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center gap-4 px-5 py-3">
			<Select
				value={supplier || DISCOUNT_FILTER_ALL}
				onValueChange={(value) =>
					onSupplierChange(value === DISCOUNT_FILTER_ALL ? "" : value)
				}
			>
				<SelectTrigger className={TRIGGER_CLASS}>
					<SelectValue
						placeholder={t(
							localizationConstants.discountsFilterSupplierPlaceholder,
						)}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={DISCOUNT_FILTER_ALL}>
						<Translate text={localizationConstants.discountsAllSuppliers} />
					</SelectItem>
					{options.suppliers.map((name) => (
						<SelectItem key={name} value={name}>
							{name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={category || DISCOUNT_FILTER_ALL}
				onValueChange={(value) =>
					onCategoryChange(value === DISCOUNT_FILTER_ALL ? "" : value)
				}
			>
				<SelectTrigger className={TRIGGER_CLASS}>
					<SelectValue
						placeholder={t(
							localizationConstants.discountsFilterCategoryPlaceholder,
						)}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={DISCOUNT_FILTER_ALL}>
						<Translate text={localizationConstants.discountsAllCategories} />
					</SelectItem>
					{options.categories.map((name) => (
						<SelectItem key={name} value={name}>
							{name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={status || DISCOUNT_FILTER_ALL}
				onValueChange={(value) =>
					onStatusChange(
						value === DISCOUNT_FILTER_ALL ? "" : (value as DiscountStatus),
					)
				}
			>
				<SelectTrigger className={TRIGGER_CLASS}>
					<SelectValue
						placeholder={t(
							localizationConstants.discountsFilterStatusPlaceholder,
						)}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={DISCOUNT_FILTER_ALL}>
						<Translate text={localizationConstants.discountsAllStatuses} />
					</SelectItem>
					{DISCOUNT_STATUS_ORDER.map((value) => (
						<SelectItem key={value} value={value}>
							<Translate text={DISCOUNT_STATUS_LABELS[value]} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
