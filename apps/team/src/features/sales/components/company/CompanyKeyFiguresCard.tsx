"use client";

import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SalesCompany } from "../../types";
import { formatCurrency } from "../../utils/salesFormatters";
import { SalesSectionCard } from "../SalesSectionCard";
import {
	CompanyNumberField,
	CompanyTextField,
} from "./CompanyFieldInput";

type CompanyCardProps = {
	company: SalesCompany;
	onChange: (patch: Partial<SalesCompany>) => void;
};

export function CompanyKeyFiguresCard({
	company,
	onChange,
}: CompanyCardProps) {
	return (
		<SalesSectionCard titleKey={localizationConstants.salesKeyFiguresTitle}>
			<div className="grid gap-4 sm:grid-cols-3">
				<CompanyNumberField
					company={company}
					field="employees"
					labelKey={localizationConstants.salesFieldEmployees}
					onChange={onChange}
				/>
				<CompanyNumberField
					company={company}
					field="revenue"
					labelKey={localizationConstants.salesFieldRevenue}
					onChange={onChange}
				/>
				<CompanyTextField
					company={company}
					field="startYear"
					labelKey={localizationConstants.salesFieldStartYear}
					onChange={onChange}
				/>
			</div>
			{company.revenue > 0 ? (
				<p className="mt-3 text-xs text-slate-500">
					<Translate text={localizationConstants.salesRevenueLabel} />
					{": "}
					<span className="tabular-nums">
						{formatCurrency(company.revenue)}
					</span>
				</p>
			) : null}
		</SalesSectionCard>
	);
}

export function CompanyOwnersCard({ company, onChange }: CompanyCardProps) {
	return (
		<SalesSectionCard titleKey={localizationConstants.salesOwnersTitle}>
			<div className="grid gap-4 sm:grid-cols-2">
				<CompanyTextField
					company={company}
					field="accountManager"
					labelKey={localizationConstants.salesFieldAccountManager}
					onChange={onChange}
				/>
				<CompanyTextField
					company={company}
					field="seller"
					labelKey={localizationConstants.salesFieldSeller}
					onChange={onChange}
				/>
			</div>
		</SalesSectionCard>
	);
}

export function CompanyNotesCard({ company, onChange }: CompanyCardProps) {
	const t = useTranslate();
	return (
		<SalesSectionCard titleKey={localizationConstants.salesNotesTitle}>
			<Textarea
				className="min-h-30"
				value={company.notes}
				placeholder={t(localizationConstants.salesNotesPlaceholder)}
				onChange={(event) => onChange({ notes: event.target.value })}
			/>
		</SalesSectionCard>
	);
}
