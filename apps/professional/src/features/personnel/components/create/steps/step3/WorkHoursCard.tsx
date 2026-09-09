"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser, Clock } from "lucide-react";
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
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionWorkHours)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-5">
				<div>
					<Label htmlFor="startWorkDay" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldStartWorkDay)}
					</Label>
					<Input
						id="startWorkDay"
						value={data.startWorkDay}
						onChange={(e) => onChange("startWorkDay", e.target.value)}
						placeholder="08:00"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="endWorkDay" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldEndWorkDay)}
					</Label>
					<Input
						id="endWorkDay"
						value={data.endWorkDay}
						onChange={(e) => onChange("endWorkDay", e.target.value)}
						placeholder="17:00"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				<div>
					<Label htmlFor="startFlexTime" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldStartFlexTime)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="startFlexTime"
							value={data.startFlexTime}
							onChange={(e) => onChange("startFlexTime", e.target.value)}
							placeholder="07:00"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pl-10 placeholder:text-slate-400"
						/>
						<Clock className="h-4 w-4 absolute left-3 text-slate-400 pointer-events-none" />
					</div>
				</div>

				<div>
					<Label htmlFor="endFlexTime" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldEndFlexTime)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="endFlexTime"
							value={data.endFlexTime}
							onChange={(e) => onChange("endFlexTime", e.target.value)}
							placeholder="18:30"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pl-10 placeholder:text-slate-400"
						/>
						<Clock className="h-4 w-4 absolute left-3 text-slate-400 pointer-events-none" />
					</div>
				</div>
			</div>
		</section>
	);
}
