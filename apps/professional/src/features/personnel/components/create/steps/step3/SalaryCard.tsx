"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionSalaryCompensation)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
				<div>
					<Label htmlFor="paymentDay" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldPaymentDay)}
					</Label>
					<Input
						id="paymentDay"
						value={data.paymentDay}
						onChange={(e) => onChange("paymentDay", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="hourlyRate" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldHourlyRate)}
					</Label>
					<Input
						id="hourlyRate"
						value={data.hourlyRate}
						onChange={(e) => onChange("hourlyRate", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="grossSalary" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldGrossSalary)}
					</Label>
					<Input
						id="grossSalary"
						value={data.grossSalary}
						onChange={(e) => onChange("grossSalary", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
				<div>
					<Label className="text-xs font-medium text-slate-600 mb-2 block">
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
					<Label className="text-xs font-medium text-slate-600 mb-2 block">
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
