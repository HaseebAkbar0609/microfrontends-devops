"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaxUnionForm } from "@/features/personnel/types/createEmployee.types";

interface TaxUnionCardProps {
	data: TaxUnionForm;
	onChange: (field: keyof TaxUnionForm, value: string) => void;
}

export function TaxUnionCard({ data, onChange }: TaxUnionCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionTaxUnion)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{/* Row 1: Skattetabel & Kollektivavtal */}
				<div>
					<Label htmlFor="taxTable" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldTaxTable)}
					</Label>
					<Input
						id="taxTable"
						value={data.taxTable}
						onChange={(e) => onChange("taxTable", e.target.value)}
						placeholder="32"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="collectiveAgreement" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldCollectiveAgreement)}
					</Label>
					<Input
						id="collectiveAgreement"
						value={data.collectiveAgreement}
						onChange={(e) => onChange("collectiveAgreement", e.target.value)}
						placeholder={t(localizationConstants.radioYes)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				{/* Row 2: Fackligttillhörighet */}
				<div>
					<Label htmlFor="unionAffiliation" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldUnionAffiliation)}
					</Label>
					<Input
						id="unionAffiliation"
						value={data.unionAffiliation}
						onChange={(e) => onChange("unionAffiliation", e.target.value)}
						placeholder="Unionen"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>
			</div>
		</section>
	);
}
