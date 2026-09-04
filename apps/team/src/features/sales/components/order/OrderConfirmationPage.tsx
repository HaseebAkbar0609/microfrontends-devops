"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { SalesNotFound } from "../SalesNotFound";
import { SalesPageHeader } from "../SalesPageHeader";
import { OrderConfirmationSheet } from "./OrderConfirmationSheet";

type OrderConfirmationPageProps = {
	companyId: string;
};

export default function OrderConfirmationPage({
	companyId,
}: OrderConfirmationPageProps) {
	const { getCompany } = useSalesCompanies();
	const company = getCompany(companyId);

	if (!company || !company.order) {
		return (
			<SalesNotFound
				titleKey={
					company
						? localizationConstants.salesOrderNotFoundTitle
						: localizationConstants.salesCompanyNotFoundTitle
				}
				backHref={
					company ? `/module/sales/companies/${company.id}` : "/module/sales"
				}
				backLabelKey={
					company
						? localizationConstants.salesBackToCompanyButton
						: localizationConstants.salesBackToCrmButton
				}
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-white px-6 py-6">
			<SalesPageHeader
				className="no-print"
				title={
					<Translate
						text={localizationConstants.salesOrderConfirmationTitle}
					/>
				}
				subtitle={<p className="text-sm text-slate-500">{company.name}</p>}
				trail={[
					{
						label: company.name || company.id,
						href: `/module/sales/companies/${company.id}`,
					},
					{
						label: (
							<Translate
								text={localizationConstants.salesOrderConfirmationTitle}
							/>
						),
					},
				]}
				actions={
					<Button
						type="button"
						variant="outline"
						className="h-10 cursor-pointer gap-2"
						onClick={() => window.print()}
					>
						<Printer className="h-4 w-4" />
						<Translate text={localizationConstants.salesPrintButton} />
					</Button>
				}
			/>

			<div className="mx-auto w-full max-w-4xl">
				<OrderConfirmationSheet company={company} order={company.order} />
			</div>
		</div>
	);
}
