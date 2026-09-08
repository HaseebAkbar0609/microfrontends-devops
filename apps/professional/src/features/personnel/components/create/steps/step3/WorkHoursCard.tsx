"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkingHoursForm } from "@/features/personnel/types/createEmployee.types";

interface WorkHoursCardProps {
	data: WorkingHoursForm;
	onChange: (field: keyof WorkingHoursForm, value: string) => void;
}

export function WorkHoursCard({ data, onChange }: WorkHoursCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionWorkHours)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
				<div>
					<Label htmlFor="startWorkDay" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldStartWorkDay)}
					</Label>
					<Input
						id="startWorkDay"
						value={data.startWorkDay}
						onChange={(e) => onChange("startWorkDay", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="endWorkDay" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldEndWorkDay)}
					</Label>
					<Input
						id="endWorkDay"
						value={data.endWorkDay}
						onChange={(e) => onChange("endWorkDay", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div>
					<Label htmlFor="startFlexTime" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldStartFlexTime)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="startFlexTime"
							value={data.startFlexTime}
							onChange={(e) => onChange("startFlexTime", e.target.value)}
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pl-10"
						/>
						<Clock className="h-4 w-4 absolute left-3 text-slate-400 pointer-events-none" />
					</div>
				</div>

				<div>
					<Label htmlFor="endFlexTime" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldEndFlexTime)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="endFlexTime"
							value={data.endFlexTime}
							onChange={(e) => onChange("endFlexTime", e.target.value)}
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pl-10"
						/>
						<Clock className="h-4 w-4 absolute left-3 text-slate-400 pointer-events-none" />
					</div>
				</div>
			</div>
		</section>
	);
}
