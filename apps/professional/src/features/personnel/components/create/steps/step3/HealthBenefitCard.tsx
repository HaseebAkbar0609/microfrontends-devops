"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser, Calendar } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { HealthSupportForm } from "@/features/personnel/types/createEmployee.types";
import { HEALTH_PROVIDER_OPTIONS } from "@/features/personnel/constants/createEmployee.constants";

interface HealthBenefitCardProps {
	data: HealthSupportForm;
	onChange: <K extends keyof HealthSupportForm>(field: K, value: HealthSupportForm[K]) => void;
}

export function HealthBenefitCard({ data, onChange }: HealthBenefitCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionHealthSupport)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
				<div>
					<Label htmlFor="healthProvider" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldWorkEnvProvider)}
					</Label>
					<Select
						value={data.workEnvironmentProvider}
						onValueChange={(val) => onChange("workEnvironmentProvider", val)}
					>
						<SelectTrigger id="healthProvider" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
							<SelectValue placeholder={t(localizationConstants.fieldWorkEnvProvider)} />
						</SelectTrigger>
						<SelectContent>
							{HEALTH_PROVIDER_OPTIONS.map((provider) => (
								<SelectItem key={provider} value={provider}>
									{provider}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="coverageStartDate" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldCoverageStartDate)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="coverageStartDate"
							type="date"
							value={data.coverageStartDate}
							onChange={(e) => onChange("coverageStartDate", e.target.value)}
							placeholder="2026-01-01"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pr-10 placeholder:text-slate-400"
						/>
						<Calendar className="h-4 w-4 absolute right-3 text-slate-400 pointer-events-none" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-2.5 block">
						{t(localizationConstants.fieldMedicalCheckRequired)}
					</Label>
					<RadioGroup
						value={data.mandatoryMedicalCheckRequired ? "yes" : "no"}
						onValueChange={(val) => onChange("mandatoryMedicalCheckRequired", val === "yes")}
						className="flex items-center gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="yes" id="med-yes" />
							<Label htmlFor="med-yes" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioYes)}
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="no" id="med-no" />
							<Label htmlFor="med-no" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioNo)}
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-2.5 block">
						{t(localizationConstants.fieldWellnessAllowance)}
					</Label>
					<RadioGroup
						value={data.wellnessAllowance ? "yes" : "no"}
						onValueChange={(val) => onChange("wellnessAllowance", val === "yes")}
						className="flex items-center gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="yes" id="wellness-yes" />
							<Label htmlFor="wellness-yes" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioYes)}
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="no" id="wellness-no" />
							<Label htmlFor="wellness-no" className="text-sm font-normal text-slate-700 cursor-pointer">
								{t(localizationConstants.radioNo)}
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="col-span-1 md:col-span-2 max-w-md">
					<Label htmlFor="wellnessAmount" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldAmount)}
					</Label>
					<div className="relative flex items-center">
						<Input
							id="wellnessAmount"
							value={data.wellnessAmount}
							onChange={(e) => onChange("wellnessAmount", e.target.value)}
							placeholder="5 000 SEK"
							className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm pr-20 placeholder:text-slate-400"
						/>
						<span className="absolute right-3 text-xs text-slate-500 font-medium pointer-events-none">
							/ {t(localizationConstants.unitPerMonth)}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
