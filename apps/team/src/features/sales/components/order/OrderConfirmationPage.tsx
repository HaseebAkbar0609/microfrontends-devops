"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	SALES_CRM_HREF,
	SALES_MODULE_TABS,
	SALES_MODULE_TITLE_KEY,
	getSalesRecordTabs,
} from "../../constants/salesNav";
import { SalesNotFound } from "../SalesNotFound";
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
					company ? `/module/sales/companies/${company.id}` : SALES_CRM_HREF
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
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				className="no-print"
				title={SALES_MODULE_TITLE_KEY}
				tabs={SALES_MODULE_TABS}
				secondaryTabs={getSalesRecordTabs(company)}
				record={{
					title: company.name || company.id,
					backHref: SALES_CRM_HREF,
					actions: (
						<Button
							type="button"
							variant="outline"
							className="h-9 cursor-pointer gap-2"
							onClick={() => window.print()}
						>
							<Printer className="h-4 w-4" />
							<Translate text={localizationConstants.salesPrintButton} />
						</Button>
					),
				}}
			/>

			<div className="mx-auto w-full max-w-4xl px-5 py-5">
				<OrderConfirmationSheet company={company} order={company.order} />
			</div>
		</div>
	);
}
