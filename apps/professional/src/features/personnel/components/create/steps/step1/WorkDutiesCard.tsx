"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
	onChange: (field: keyof WorkDutiesForm, value: string) => void;
}

export function WorkDutiesCard({ data, onChange }: WorkDutiesCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionWorkDuties)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{/* Row 1 */}
				<div>
					<Label htmlFor="role" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldRole)}
					</Label>
					<Input
						id="role"
						value={data.role}
						onChange={(e) => onChange("role", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
						required
					/>
				</div>

				<div>
					<Label htmlFor="category" className="text-xs font-medium text-slate-600 mb-1.5 block">
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

				<div>
					<Label htmlFor="startDate" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldStartDate)}
					</Label>
					<Input
						id="startDate"
						type="date"
						value={data.startDate}
						onChange={(e) => onChange("startDate", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				{/* Row 2 */}
				<div>
					<Label htmlFor="department" className="text-xs font-medium text-slate-600 mb-1.5 block">
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

				<div>
					<Label htmlFor="location" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldCity)}
					</Label>
					<Select value={data.location} onValueChange={(val) => onChange("location", val)}>
						<SelectTrigger id="location" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
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
