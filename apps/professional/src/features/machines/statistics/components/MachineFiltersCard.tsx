"use client";

import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	MachineFilterState,
	MachineTypeCategory,
} from "../types/statistics.types";
import {
	SUPPLIER_OPTIONS,
	AGE_INTERVAL_OPTIONS,
	CATEGORY_OPTIONS,
	STATUS_OPTIONS,
} from "../data/machineStatistics.mock";

interface MachineFiltersCardProps {
	filters: MachineFilterState;
	onChange: (filters: MachineFilterState) => void;
	onApply: () => void;
	onReset: () => void;
}

export function MachineFiltersCard({
	filters,
	onChange,
	onApply,
	onReset,
}: MachineFiltersCardProps) {
	const toggleCategory = (cat: string) => {
		const exists = filters.categories.includes(cat);
		const newCategories = exists
			? filters.categories.filter((c) => c !== cat)
			: [...filters.categories, cat];
		onChange({ ...filters, categories: newCategories });
	};

	const removeCategory = (cat: string) => {
		onChange({
			...filters,
			categories: filters.categories.filter((c) => c !== cat),
		});
	};

	const isExternal =
		filters.machineType === "Externa" || filters.machineType === "Alla";

	return (
		<div className="flex flex-col gap-3">
			{/* Header with Title & Reset */}
			<div className="flex items-center justify-between">
				<h3 className="text-base font-bold text-slate-900">
					<Translate text={localizationConstants.machineStatFilterTitle} />
				</h3>
				<button
					type="button"
					onClick={onReset}
					className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
				>
					<Translate text={localizationConstants.machineStatFilterReset} />
					<X className="h-3.5 w-3.5" />
				</button>
			</div>

			{/* Filter Controls Grid */}
			<div
				className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 ${
					isExternal
						? "lg:grid-cols-[1fr_1fr_1fr_1.5fr_1fr_auto]"
						: "lg:grid-cols-[1fr_1fr_1.5fr_1fr_auto]"
				} items-end`}
			>
				{/* 1. Maskin (Type) */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.machineStatFilterTypeLabel} />
					</label>
					<Select
						value={filters.machineType}
						onValueChange={(val: MachineTypeCategory) =>
							onChange({ ...filters, machineType: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={localizationConstants.machineStatPlaceholderType}
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Interna">
								<Translate text={localizationConstants.machineStatTypeInternal} />
							</SelectItem>
							<SelectItem value="Externa">
								<Translate text={localizationConstants.machineStatTypeExternal} />
							</SelectItem>
							<SelectItem value="Alla">
								<Translate text={localizationConstants.machineStatTypeAll} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* 2. Leverantör (Visible for External or All) */}
				{isExternal && (
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-500">
							<Translate
								text={localizationConstants.machineStatFilterSupplierLabel}
							/>
						</label>
						<Select
							value={filters.supplier}
							onValueChange={(val: string) =>
								onChange({ ...filters, supplier: val })
							}
						>
							<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
								<SelectValue
									placeholder={
										localizationConstants.machineStatPlaceholderSupplier
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{SUPPLIER_OPTIONS.map((opt) => (
									<SelectItem key={opt} value={opt}>
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				{/* 3. Åldersintervall */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.machineStatFilterAgeLabel} />
					</label>
					<Select
						value={filters.ageInterval}
						onValueChange={(val: string) =>
							onChange({ ...filters, ageInterval: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={localizationConstants.machineStatPlaceholderAge}
							/>
						</SelectTrigger>
						<SelectContent>
							{AGE_INTERVAL_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={opt}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 4. Kategori (Multi-select) */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate
							text={localizationConstants.machineStatFilterCategoryLabel}
						/>
					</label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="flex min-h-[36px] w-full flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs cursor-pointer hover:border-slate-300">
								{filters.categories.length === 0 ? (
									<span className="text-slate-400 text-xs">
										<Translate
											text={localizationConstants.machineStatAllCategories}
										/>
									</span>
								) : (
									filters.categories.map((val) => (
										<span
											key={val}
											className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
										>
											{val}
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													removeCategory(val);
												}}
												className="text-slate-400 hover:text-slate-600"
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									))
								)}
								<ChevronDown className="ml-auto h-4 w-4 text-slate-400 shrink-0" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-56">
							{CATEGORY_OPTIONS.map((cat) => (
								<DropdownMenuCheckboxItem
									key={cat}
									checked={filters.categories.includes(cat)}
									onCheckedChange={() => toggleCategory(cat)}
								>
									{cat}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* 5. Status */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate
							text={localizationConstants.machineStatFilterStatusLabel}
						/>
					</label>
					<Select
						value={filters.status}
						onValueChange={(val: string) =>
							onChange({ ...filters, status: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={localizationConstants.machineStatPlaceholderStatus}
							/>
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={opt}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 6. Välj (Apply Button) */}
				<div className="flex items-end">
					<Button
						type="button"
						onClick={onApply}
						className="h-9 w-24 px-5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-md shrink-0"
					>
						<Translate
							text={localizationConstants.machineStatFilterSelectButton}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
}
