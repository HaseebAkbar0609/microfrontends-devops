"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionTaxUnion)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div>
					<Label htmlFor="taxTable" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldTaxTable)}
					</Label>
					<Input
						id="taxTable"
						value={data.taxTable}
						onChange={(e) => onChange("taxTable", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="collectiveAgreement" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldCollectiveAgreement)}
					</Label>
					<Input
						id="collectiveAgreement"
						value={data.collectiveAgreement}
						onChange={(e) => onChange("collectiveAgreement", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="unionAffiliation" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldUnionAffiliation)}
					</Label>
					<Input
						id="unionAffiliation"
						value={data.unionAffiliation}
						onChange={(e) => onChange("unionAffiliation", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>
		</section>
	);
}
