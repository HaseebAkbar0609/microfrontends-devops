"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { STAFF_CONSTANTS } from "../constants/staff.constants";
import { LedgerDatePicker } from "@/features/project/production/personalliggare/components/LedgerDatePicker";

export interface StaffFilterBarProps {
	selectedSupplier: string;
	suppliers: string[];
	startDate: string;
	endDate: string;
	isLoggedInNow: boolean;
	onSupplierChange: (supplier: string) => void;
	onStartDateChange: (date: string) => void;
	onEndDateChange: (date: string) => void;
	onLoggedInNowChange: (checked: boolean) => void;
}

export function StaffFilterBar({
	selectedSupplier,
	suppliers,
	startDate,
	endDate,
	isLoggedInNow,
	onSupplierChange,
	onStartDateChange,
	onEndDateChange,
	onLoggedInNowChange,
}: StaffFilterBarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-start gap-4 sm:gap-6 py-4 bg-white">
			{/* 1. Vald leverantör/ UE */}
			<div className="flex flex-col gap-1.5 min-w-[200px] sm:min-w-[220px]">
				<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
					<Translate text={localizationConstants.staffSelectSupplier} />
				</Label>
				<Select value={selectedSupplier} onValueChange={onSupplierChange}>
					<SelectTrigger className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-sans text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-none">
						<SelectValue placeholder={t(localizationConstants.staffAllSuppliers)} />
					</SelectTrigger>
					<SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg">
						<SelectItem value={STAFF_CONSTANTS.ALL_SUPPLIERS_VALUE} className="font-sans text-sm cursor-pointer">
							<Translate text={localizationConstants.staffAllSuppliers} />
						</SelectItem>
						{suppliers.map((sup) => (
							<SelectItem key={sup} value={sup} className="font-sans text-sm cursor-pointer">
								{sup}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Divider */}
			<div className="hidden md:block w-px bg-slate-200 shrink-0 self-stretch my-1" />

			{/* 2. Välj datum */}
			<div className="flex flex-col gap-1.5">
				<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
					<Translate text={localizationConstants.staffSelectDate} />
				</Label>
				<div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
					<div className="min-w-[170px] sm:min-w-[190px]">
						<LedgerDatePicker
							value={startDate}
							onChange={onStartDateChange}
							ariaLabel={t(localizationConstants.staffSelectDate)}
						/>
					</div>
					<div className="min-w-[170px] sm:min-w-[190px]">
						<LedgerDatePicker
							value={endDate}
							onChange={onEndDateChange}
							ariaLabel={t(localizationConstants.staffSelectDate)}
						/>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="hidden md:block w-px bg-slate-200 shrink-0 self-stretch my-1" />

			{/* 3. Inloggade NU Checkbox aligned with headings */}
			<div className="flex flex-col justify-start">
				<div className="flex items-center gap-2.5 pt-0.5">
					<Checkbox
						id="inloggade-nu"
						checked={isLoggedInNow}
						onCheckedChange={(checked) => onLoggedInNowChange(!!checked)}
						className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 cursor-pointer"
					/>
					<Label
						htmlFor="inloggade-nu"
						className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 cursor-pointer select-none"
					>
						<Translate text={localizationConstants.staffLoggedInNow} />
					</Label>
				</div>
				<span className="font-sans text-xs text-slate-500 pl-6.5 mt-1">
					<Translate text={localizationConstants.staffWorkingHours} />
				</span>
			</div>
		</div>
	);
}

export default StaffFilterBar;
