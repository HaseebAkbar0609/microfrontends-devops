"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WorkInfoForm } from "@/features/personnel/types/createEmployee.types";
import { EMPLOYMENT_FORM_OPTIONS } from "@/features/personnel/constants/createEmployee.constants";

interface WorkInfoCardProps {
	data: WorkInfoForm;
	onChange: (field: keyof WorkInfoForm, value: string) => void;
}

export function WorkInfoCard({ data, onChange }: WorkInfoCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionWorkInfo)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				<div>
					<Label htmlFor="workingHours" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldWorkingHours)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="workingHours"
							value={data.workingHours}
							onChange={(e) => onChange("workingHours", e.target.value)}
							placeholder="40"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pr-20 placeholder:text-slate-400"
						/>
						<span className="absolute right-3 text-xs text-slate-500 font-medium pointer-events-none">
							/ {t(localizationConstants.unitPerWeek)}
						</span>
					</div>
				</div>

				<div>
					<Label htmlFor="employmentForm" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldEmploymentForm)}
					</Label>
					<Select
						value={data.employmentForm}
						onValueChange={(val) => onChange("employmentForm", val)}
					>
						<SelectTrigger id="employmentForm" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldEmploymentForm)} />
						</SelectTrigger>
						<SelectContent>
							{EMPLOYMENT_FORM_OPTIONS.map((form) => (
								<SelectItem key={form} value={form}>
									{form}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="col-span-1 md:col-span-2">
					<Label htmlFor="annualVacationDays" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldAnnualVacation)}
					</Label>
					<div className="relative flex items-center max-w-md">
						<Input
							id="annualVacationDays"
							value={data.annualVacationDays}
							onChange={(e) => onChange("annualVacationDays", e.target.value)}
							placeholder="25"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pr-16 placeholder:text-slate-400"
						/>
						<span className="absolute right-3 text-xs text-slate-500 font-medium pointer-events-none">
							/ {t(localizationConstants.unitPerYear)}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
