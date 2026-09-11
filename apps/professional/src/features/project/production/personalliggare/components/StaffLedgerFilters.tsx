"use client";

import { STANDARD_WORKDAY } from "@/features/tools/time/constants/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SUPPLIER_FILTER_ALL } from "../hooks/useProjectStaffLedger";
import { LedgerDatePicker } from "./LedgerDatePicker";

const DATE_ERROR_ID = "staff-ledger-date-error";

export interface StaffLedgerFiltersProps {
	supplier: string;
	onSupplierChange: (value: string) => void;
	supplierOptions: string[];
	dateFrom: string;
	onDateFromChange: (value: string) => void;
	dateTo: string;
	onDateToChange: (value: string) => void;
	dateRangeInvalid: boolean;
	onSiteOnly: boolean;
	onOnSiteOnlyChange: (value: boolean) => void;
}

/**
 * The ledger's filter row: supplier, a date range, and who is still on site.
 *
 * The frame draws no search box, so there is none — the personnummer column is
 * therefore never matched against, unlike `usePersonnelOverview` and
 * `useRotRut`, which both search the raw ID.
 *
 * The two date fields sit under one "Välj datum" heading, as the frame draws
 * them and as `MeetingDateTimeFields` already lays out a pair.
 */
export function StaffLedgerFilters({
	supplier,
	onSupplierChange,
	supplierOptions,
	dateFrom,
	onDateFromChange,
	dateTo,
	onDateToChange,
	dateRangeInvalid,
	onSiteOnly,
	onOnSiteOnlyChange,
}: StaffLedgerFiltersProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-start lg:gap-8">
			<div className="flex flex-col gap-1.5 lg:w-64">
				<Label htmlFor="staff-ledger-supplier">
					<Translate
						text={
							localizationConstants.projectStaffLedgerSupplierLabel
						}
					/>
				</Label>
				<Select value={supplier} onValueChange={onSupplierChange}>
					<SelectTrigger
						id="staff-ledger-supplier"
						className="h-10 w-full cursor-pointer border-slate-200 bg-white"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							value={SUPPLIER_FILTER_ALL}
							className="cursor-pointer"
						>
							<Translate
								text={localizationConstants.allSuppliers}
							/>
						</SelectItem>
						{supplierOptions.map((option) => (
							<SelectItem
								key={option}
								value={option}
								className="cursor-pointer"
							>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-1.5 lg:flex-1">
				<span className="text-sm font-medium text-gray-700">
					<Translate text={localizationConstants.chooseDate} />
				</span>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<LedgerDatePicker
						value={dateFrom}
						onChange={onDateFromChange}
						ariaLabel={`${t(localizationConstants.chooseDate)} — ${t(localizationConstants.purchaseGanttFrom)}`}
						invalid={dateRangeInvalid}
						describedBy={
							dateRangeInvalid ? DATE_ERROR_ID : undefined
						}
					/>
					<LedgerDatePicker
						value={dateTo}
						onChange={onDateToChange}
						ariaLabel={`${t(localizationConstants.chooseDate)} — ${t(localizationConstants.purchaseGanttTo)}`}
						invalid={dateRangeInvalid}
						describedBy={
							dateRangeInvalid ? DATE_ERROR_ID : undefined
						}
					/>
				</div>
				{/* Rule 4: an invalid range is reported at the field, not left
				    for the reader to infer from an empty table. */}
				{dateRangeInvalid && (
					<p id={DATE_ERROR_ID} className="text-sm text-red-700">
						<Translate
							text={
								localizationConstants.projectStaffLedgerDateRangeInvalid
							}
						/>
					</p>
				)}
			</div>

			<div className="flex flex-row items-start gap-3 lg:w-56 lg:border-l lg:border-slate-200 lg:pl-8">
				<Checkbox
					id="staff-ledger-on-site"
					checked={onSiteOnly}
					onCheckedChange={(checked) =>
						onOnSiteOnlyChange(checked === true)
					}
					className="mt-0.5 cursor-pointer"
				/>
				<div className="grid gap-1 leading-none">
					<Label
						htmlFor="staff-ledger-on-site"
						className="mb-0 cursor-pointer"
					>
						<Translate
							text={
								localizationConstants.projectStaffLedgerLoggedInNow
							}
						/>
					</Label>
					{/* The company's hours, from the shared constant rather
					    than the frame's literal figures (rule 1). */}
					<p className="text-sm text-slate-500">
						<Translate
							text={localizationConstants.arbetstidHeader}
						/>
						{`: ${STANDARD_WORKDAY.start} - ${STANDARD_WORKDAY.end}`}
					</p>
				</div>
			</div>
		</div>
	);
}

export default StaffLedgerFilters;
