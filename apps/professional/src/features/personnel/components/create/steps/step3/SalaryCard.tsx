"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SalaryCompensationForm } from "@/features/personnel/types/createEmployee.types";

interface SalaryCardProps {
	data: SalaryCompensationForm;
	onChange: <K extends keyof SalaryCompensationForm>(field: K, value: SalaryCompensationForm[K]) => void;
}

export function SalaryCard({ data, onChange }: SalaryCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionSalaryCompensation)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
				<div>
					<Label htmlFor="paymentDay" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldPaymentDay)}
					</Label>
					<Input
						id="paymentDay"
						value={data.paymentDay}
						onChange={(e) => onChange("paymentDay", e.target.value)}
						placeholder="25"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="hourlyRate" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldHourlyRate)}
					</Label>
					<Input
						id="hourlyRate"
						value={data.hourlyRate}
						onChange={(e) => onChange("hourlyRate", e.target.value)}
						placeholder="250 SEK"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div className="col-span-1 md:col-span-2">
					<Label htmlFor="grossSalary" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldGrossSalary)}
					</Label>
					<Input
						id="grossSalary"
						value={data.grossSalary}
						onChange={(e) => onChange("grossSalary", e.target.value)}
						placeholder="42 000 SEK"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-2.5 block">
						{t(localizationConstants.fieldOvertimeCompensation)}
					</Label>
					<RadioGroup
						value={data.overtimeCompensation ? "yes" : "no"}
						onValueChange={(val) => onChange("overtimeCompensation", val === "yes")}
						className="flex items-center gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="yes" id="ot-yes" />
							<Label htmlFor="ot-yes" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioYes)}
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="no" id="ot-no" />
							<Label htmlFor="ot-no" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioNo)}
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-2.5 block">
						{t(localizationConstants.fieldTravelCompensation)}
					</Label>
					<RadioGroup
						value={data.travelCompensation ? "yes" : "no"}
						onValueChange={(val) => onChange("travelCompensation", val === "yes")}
						className="flex items-center gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="yes" id="travel-yes" />
							<Label htmlFor="travel-yes" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioYes)}
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="no" id="travel-no" />
							<Label htmlFor="travel-no" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioNo)}
							</Label>
						</div>
					</RadioGroup>
				</div>
			</div>
		</section>
	);
}
