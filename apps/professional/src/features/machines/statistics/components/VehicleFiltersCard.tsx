"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { VehicleFilterState } from "../types/statistics.types";
import {
	VEHICLE_BRAND_OPTIONS,
	VEHICLE_MILEAGE_OPTIONS,
	VEHICLE_DRIFT_OPTIONS,
} from "../data/vehicleStatistics.mock";
import { STATUS_ITEMS } from "./MachineFiltersCard";

interface VehicleFiltersCardProps {
	filters: VehicleFilterState;
	onChange: (filters: VehicleFilterState) => void;
	onApply: () => void;
	onReset: () => void;
}

export function VehicleFiltersCard({
	filters,
	onChange,
	onApply,
	onReset,
}: VehicleFiltersCardProps) {
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
					className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
				>
					<Translate text={localizationConstants.machineStatFilterReset} />
					<X className="h-3.5 w-3.5" />
				</button>
			</div>

			{/* Filter Controls Grid */}
			<div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] items-end">
				{/* 1. Märke & modell */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate
							text={localizationConstants.machineStatFilterBrandModelLabel}
						/>
					</label>
					<Select
						value={filters.brandModel}
						onValueChange={(val: string) =>
							onChange({ ...filters, brandModel: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={localizationConstants.machineStatPlaceholderBrand}
							/>
						</SelectTrigger>
						<SelectContent>
							{VEHICLE_BRAND_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={opt}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 2. Miltal */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate
							text={localizationConstants.machineStatFilterMileageLabel}
						/>
					</label>
					<Select
						value={filters.mileageRange}
						onValueChange={(val: string) =>
							onChange({ ...filters, mileageRange: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={
									localizationConstants.machineStatPlaceholderMileage
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{VEHICLE_MILEAGE_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={opt}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 3. Drift */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.machineStatFilterDriftLabel} />
					</label>
					<Select
						value={filters.driftPeriod}
						onValueChange={(val: string) =>
							onChange({ ...filters, driftPeriod: val })
						}
					>
						<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs rounded-md">
							<SelectValue
								placeholder={localizationConstants.machineStatPlaceholderDrift}
							/>
						</SelectTrigger>
						<SelectContent>
							{VEHICLE_DRIFT_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={opt}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 4. Status */}
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
							{STATUS_ITEMS.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									<Translate text={item.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 5. Välj Button */}
				<div className="flex items-end">
					<Button
						type="button"
						onClick={onApply}
						className="h-9 w-24 px-5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-md shrink-0 cursor-pointer"
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
