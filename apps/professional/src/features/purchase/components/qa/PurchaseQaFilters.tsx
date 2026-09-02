"use client";

import { PlusCircle, X } from "lucide-react";

import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { PurchaseQaStatus } from "../../types/purchase.types";

const CHIP_CLASS =
	"flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50";

const STATUS_OPTIONS: { value: PurchaseQaStatus; label: TranslationKeys }[] = [
	{ value: "new", label: localizationConstants.purchaseQaColNew },
	{ value: "opened", label: localizationConstants.purchaseQaColOpened },
	{ value: "answered", label: localizationConstants.purchaseQaColAnswered },
];

function Separator() {
	return <div className="mx-0.5 h-5 w-px shrink-0 bg-slate-200" />;
}

/** The chip's selected values, shown inline as the frame draws them. */
function SelectedValues({ values }: { values: string[] }) {
	if (values.length === 0) return null;

	return (
		<>
			<div className="h-4 w-px shrink-0 bg-slate-200" />
			<div className="flex items-center gap-1.5">
				{values.map((value) => (
					<span
						key={value}
						className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-900"
					>
						{value}
					</span>
				))}
			</div>
		</>
	);
}

export interface PurchaseQaFiltersProps {
	search: string;
	onSearchChange: (value: string) => void;
	companies: string[];
	companyOptions: string[];
	onToggleCompany: (value: string) => void;
	roles: string[];
	roleOptions: string[];
	onToggleRole: (value: string) => void;
	statuses: PurchaseQaStatus[];
	onToggleStatus: (value: PurchaseQaStatus) => void;
	onReset: () => void;
	hasFilters: boolean;
	/** Changes on reset; remounts the search box so it clears with the rest. */
	resetToken: number;
}

/**
 * Search and the board's filter chips.
 *
 * Unlike the b2b board this is modelled on, every control here narrows the
 * list — including Status, which is a bare decorative button there.
 */
export function PurchaseQaFilters({
	search,
	onSearchChange,
	companies,
	companyOptions,
	onToggleCompany,
	roles,
	roleOptions,
	onToggleRole,
	statuses,
	onToggleStatus,
	onReset,
	hasFilters,
	resetToken,
}: PurchaseQaFiltersProps) {
	const t = useTranslate();

	const statusLabels = new Map(
		STATUS_OPTIONS.map((option) => [option.value, t(option.label)]),
	);

	return (
		<div className="flex flex-col gap-3">
			<Search
				key={`purchase-qa-search-${resetToken}`}
				value={search}
				onChange={onSearchChange}
				placeholder={localizationConstants.purchaseQaSearchPlaceholder}
				wrapperClassName="w-full sm:w-72"
				className="h-10 bg-white text-xs"
			/>

			<div className="flex flex-wrap items-center gap-2.5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className={CHIP_CLASS}>
							<PlusCircle
								size={14}
								className="shrink-0 text-slate-700"
								aria-hidden
							/>
							<span>
								{t(
									localizationConstants.purchaseQaFilterCompany,
								)}
							</span>
							<SelectedValues values={companies} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-52 rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						<DropdownMenuLabel className="text-xs font-semibold text-slate-500">
							{t(localizationConstants.purchaseQaFilterCompany)}
						</DropdownMenuLabel>
						{companyOptions.map((option) => (
							<DropdownMenuCheckboxItem
								key={option}
								checked={companies.includes(option)}
								onCheckedChange={() => onToggleCompany(option)}
								className="cursor-pointer text-xs"
							>
								{option}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Separator />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className={CHIP_CLASS}>
							<PlusCircle
								size={14}
								className="shrink-0 text-slate-700"
								aria-hidden
							/>
							<span>
								{t(localizationConstants.purchaseQaFilterRole)}
							</span>
							<SelectedValues values={roles} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-44 rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						<DropdownMenuLabel className="text-xs font-semibold text-slate-500">
							{t(localizationConstants.purchaseQaFilterRole)}
						</DropdownMenuLabel>
						{roleOptions.map((option) => (
							<DropdownMenuCheckboxItem
								key={option}
								checked={roles.includes(option)}
								onCheckedChange={() => onToggleRole(option)}
								className="cursor-pointer text-xs"
							>
								{option}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Separator />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className={CHIP_CLASS}>
							<PlusCircle
								size={14}
								className="shrink-0 text-slate-700"
								aria-hidden
							/>
							<span>{t(localizationConstants.statusLabel)}</span>
							<SelectedValues
								values={statuses.map(
									(status) =>
										statusLabels.get(status) ?? status,
								)}
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-44 rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						<DropdownMenuLabel className="text-xs font-semibold text-slate-500">
							{t(localizationConstants.statusLabel)}
						</DropdownMenuLabel>
						{STATUS_OPTIONS.map((option) => (
							<DropdownMenuCheckboxItem
								key={option.value}
								checked={statuses.includes(option.value)}
								onCheckedChange={() =>
									onToggleStatus(option.value)
								}
								className="cursor-pointer text-xs"
							>
								{t(option.label)}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<Separator />

				<Button
					variant="ghost"
					onClick={onReset}
					disabled={!hasFilters}
					className="flex h-9 cursor-pointer items-center gap-1.5 px-2.5 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-default disabled:opacity-40"
				>
					<span className="font-semibold text-slate-900">
						{t(localizationConstants.purchaseQaFilterReset)}
					</span>
					<X
						size={14}
						className="shrink-0 stroke-[2.5] text-slate-900"
						aria-hidden
					/>
				</Button>
			</div>
		</div>
	);
}

export default PurchaseQaFilters;
