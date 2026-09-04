"use client";

import localizationConstants from "@/utils/translation/constants";
import {
	SALES_CATEGORIES,
	SALES_REGIONS,
} from "../../constants/salesTaxonomy";
import type { SalesCompany } from "../../types";
import { SalesSectionCard } from "../SalesSectionCard";
import {
	CompanyTaxonomyField,
	CompanyTextField,
	type EditableTextField,
} from "./CompanyFieldInput";

type CompanyDetailsCardProps = {
	company: SalesCompany;
	onChange: (patch: Partial<SalesCompany>) => void;
};

const TEXT_FIELDS: {
	field: EditableTextField;
	labelKey: string;
	type?: "text" | "email" | "tel";
}[] = [
	{ field: "name", labelKey: localizationConstants.salesFieldCompanyName },
	{
		field: "organisationNumber",
		labelKey: localizationConstants.salesFieldOrgNumber,
	},
	{ field: "trade", labelKey: localizationConstants.salesFieldTrade },
	{ field: "city", labelKey: localizationConstants.salesFieldCity },
	{
		field: "contactPerson",
		labelKey: localizationConstants.salesFieldContactPerson,
	},
	{
		field: "mobile",
		labelKey: localizationConstants.salesFieldMobile,
		type: "tel",
	},
	{
		field: "email",
		labelKey: localizationConstants.salesFieldEmail,
		type: "email",
	},
	{ field: "source", labelKey: localizationConstants.salesFieldSource },
];

export function CompanyDetailsCard({
	company,
	onChange,
}: CompanyDetailsCardProps) {
	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesCompanyDetailsTitle}
		>
			<div className="grid gap-4 @lg:grid-cols-2">
				{TEXT_FIELDS.map((entry) => (
					<CompanyTextField
						key={entry.field}
						company={company}
						field={entry.field}
						labelKey={entry.labelKey}
						type={entry.type}
						onChange={onChange}
					/>
				))}
				<CompanyTaxonomyField
					value={company.category}
					field="category"
					labelKey={localizationConstants.salesFieldCategory}
					placeholderKey={localizationConstants.salesSelectCategoryPlaceholder}
					options={SALES_CATEGORIES}
					onChange={onChange}
				/>
				<CompanyTaxonomyField
					value={company.region}
					field="region"
					labelKey={localizationConstants.salesFieldRegion}
					placeholderKey={localizationConstants.salesSelectRegionPlaceholder}
					options={SALES_REGIONS}
					onChange={onChange}
				/>
			</div>
		</SalesSectionCard>
	);
}
