"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { QuoteDraft } from "../../utils/quoteDraft";
import { SalesSectionCard } from "../SalesSectionCard";

type QuoteCustomerFormProps = {
	draft: QuoteDraft;
	onChange: (patch: Partial<QuoteDraft>) => void;
};

type TextFieldName = Extract<
	keyof QuoteDraft,
	| "customerName"
	| "organisationNumber"
	| "contactPerson"
	| "email"
	| "customerMobile"
	| "sellerName"
	| "sellerEmail"
	| "sellerMobile"
>;

const FIELDS: {
	name: TextFieldName;
	labelKey: string;
	type?: "text" | "email" | "tel";
}[] = [
	{
		name: "customerName",
		labelKey: localizationConstants.salesFieldCompanyName,
	},
	{
		name: "organisationNumber",
		labelKey: localizationConstants.salesFieldOrgNumber,
	},
	{
		name: "contactPerson",
		labelKey: localizationConstants.salesFieldContactPerson,
	},
	{
		name: "email",
		labelKey: localizationConstants.salesFieldEmail,
		type: "email",
	},
	{
		name: "customerMobile",
		labelKey: localizationConstants.salesFieldMobile,
		type: "tel",
	},
	{ name: "sellerName", labelKey: localizationConstants.salesFieldSeller },
	{
		name: "sellerEmail",
		labelKey: localizationConstants.salesFieldSellerEmail,
		type: "email",
	},
	{
		name: "sellerMobile",
		labelKey: localizationConstants.salesFieldSellerMobile,
		type: "tel",
	},
];

export function QuoteCustomerForm({
	draft,
	onChange,
}: QuoteCustomerFormProps) {
	return (
		<SalesSectionCard
			titleKey={localizationConstants.salesQuoteCustomerSectionTitle}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				{FIELDS.map((field) => (
					<div key={field.name} className="space-y-1.5">
						<Label htmlFor={`quote-${field.name}`}>
							<Translate text={field.labelKey} />
						</Label>
						<Input
							id={`quote-${field.name}`}
							type={field.type ?? "text"}
							value={draft[field.name]}
							onChange={(event) =>
								onChange({ [field.name]: event.target.value })
							}
						/>
					</div>
				))}
			</div>
		</SalesSectionCard>
	);
}
