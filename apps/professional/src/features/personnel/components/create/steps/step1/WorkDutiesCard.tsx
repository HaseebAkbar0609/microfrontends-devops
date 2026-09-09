"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser, Calendar } from "lucide-react";
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
import { WorkDutiesForm } from "@/features/personnel/types/createEmployee.types";
import {
	CATEGORY_OPTIONS,
	DEPARTMENT_OPTIONS,
	LOCATION_OPTIONS,
} from "@/features/personnel/constants/createEmployee.constants";

interface WorkDutiesCardProps {
	data: WorkDutiesForm;
	fieldErrors?: Record<string, string>;
	onChange: (field: keyof WorkDutiesForm, value: string) => void;
}

export function WorkDutiesCard({ data, fieldErrors, onChange }: WorkDutiesCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionWorkDuties)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{/* Row 1: Befattning & Kategori */}
				<div>
					<Label htmlFor="role" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldRole)} <span className="text-red-500">*</span>
					</Label>
					<Input
						id="role"
						value={data.role}
						onChange={(e) => onChange("role", e.target.value)}
						placeholder="Projektledare"
						className={`h-10 bg-white text-slate-900 rounded-lg text-sm placeholder:text-slate-400 ${
							fieldErrors?.role ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
						}`}
						required
					/>
					{fieldErrors?.role && (
						<p className="text-xs text-red-500 mt-1">{fieldErrors.role}</p>
					)}
				</div>

				<div>
					<Label htmlFor="category" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldCategory)}
					</Label>
					<Select value={data.category} onValueChange={(val) => onChange("category", val)}>
						<SelectTrigger id="category" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldCategory)} />
						</SelectTrigger>
						<SelectContent>
							{CATEGORY_OPTIONS.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Row 2: Statdatum & Avdelning */}
				<div>
					<Label htmlFor="startDate" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldStartDate)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="startDate"
							type="date"
							value={data.startDate}
							onChange={(e) => onChange("startDate", e.target.value)}
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pr-10"
						/>
						<Calendar className="h-4 w-4 absolute right-3 text-slate-400 pointer-events-none" />
					</div>
				</div>

				<div>
					<Label htmlFor="department" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldDepartment)}
					</Label>
					<Select value={data.department} onValueChange={(val) => onChange("department", val)}>
						<SelectTrigger id="department" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldDepartment)} />
						</SelectTrigger>
						<SelectContent>
							{DEPARTMENT_OPTIONS.map((dept) => (
								<SelectItem key={dept} value={dept}>
									{dept}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Row 3: Ort */}
				<div>
					<Label htmlFor="workDutiesLocation" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldCity)}
					</Label>
					<Select value={data.location} onValueChange={(val) => onChange("location", val)}>
						<SelectTrigger id="workDutiesLocation" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldCity)} />
						</SelectTrigger>
						<SelectContent>
							{LOCATION_OPTIONS.map((loc) => (
								<SelectItem key={loc} value={loc}>
									{loc}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</section>
	);
}
