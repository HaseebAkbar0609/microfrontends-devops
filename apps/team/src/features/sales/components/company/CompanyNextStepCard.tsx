"use client";

import Link from "next/link";
import { FileText, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getSalesStatusMeta } from "../../constants/salesStatuses";
import { useCompanyWorkflow } from "../../hooks/useCompanyWorkflow";
import type { SalesCompany } from "../../types";
import { SalesSectionCard } from "../SalesSectionCard";
import { CompanyPaymentPanel } from "./CompanyPaymentPanel";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";

type CompanyNextStepCardProps = {
	company: SalesCompany;
	onChange: (patch: Partial<SalesCompany>) => void;
};

function Hint({ textKey }: { textKey: string }) {
	return (
		<p className="text-sm text-slate-500">
			<Translate text={textKey} />
		</p>
	);
}

const PRIMARY_BUTTON_CLASS =
	`w-full cursor-pointer ${SALES_PRIMARY_BUTTON_CLASS}`;

export function CompanyNextStepCard({
	company,
	onChange,
}: CompanyNextStepCardProps) {
	const { moveToLead, confirmCreateOrder, confirmSendPayment, confirmMarkPaid } =
		useCompanyWorkflow(company, onChange);
	const t = useTranslate();
	const status = getSalesStatusMeta(company.status);
	const quoteHref = `/module/sales/companies/${company.id}/quote`;
	const orderHref = `/module/sales/companies/${company.id}/order-confirmation`;

	return (
		<SalesSectionCard titleKey={localizationConstants.salesNextStepTitle}>
			<span
				className={`mb-3 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${status.accentClassName}`}
			>
				<Translate text={status.labelKey} />
			</span>

			<div className="space-y-3">
				{company.status === "prospect" ? (
					<>
						<Hint textKey={localizationConstants.salesNextStepProspectHint} />
						<Button
							type="button"
							className={PRIMARY_BUTTON_CLASS}
							onClick={moveToLead}
						>
							<Translate text={localizationConstants.salesMoveToLeadButton} />
						</Button>
					</>
				) : null}

				{company.status === "lead" ? (
					<>
						<Hint textKey={localizationConstants.salesNextStepLeadHint} />
						<Button asChild className={PRIMARY_BUTTON_CLASS}>
							<Link href={quoteHref}>
								<FileText className="mr-2 h-4 w-4" />
								<Translate
									text={localizationConstants.salesCreateQuoteButton}
								/>
							</Link>
						</Button>
					</>
				) : null}

				{company.status === "quoted" ? (
					<>
						<Hint textKey={localizationConstants.salesNextStepQuotedHint} />
						<ConfirmDialog
							title={t(localizationConstants.salesConfirmCreateOrderTitle)}
							description={t(
								localizationConstants.salesConfirmCreateOrderDescription,
							)}
							confirmText={t(localizationConstants.salesConfirmLabel)}
							cancelText={t(localizationConstants.salesCancelButton)}
							onConfirm={confirmCreateOrder}
							trigger={
								<Button type="button" className={PRIMARY_BUTTON_CLASS}>
									<FilePlus2 className="mr-2 h-4 w-4" />
									<Translate
										text={localizationConstants.salesCreateOrderButton}
									/>
								</Button>
							}
						/>
						<Button asChild variant="outline" className="w-full cursor-pointer">
							<Link href={quoteHref}>
								<Translate text={localizationConstants.salesEditQuoteButton} />
							</Link>
						</Button>
					</>
				) : null}

				{company.status === "accepted" ? (
					<>
						<CompanyPaymentPanel
							payment={company.payment}
							onSendPayment={confirmSendPayment}
							onMarkPaid={confirmMarkPaid}
						/>
						{company.order ? (
							<Button
								asChild
								variant="outline"
								className="w-full cursor-pointer"
							>
								<Link href={orderHref}>
									<Translate
										text={localizationConstants.salesViewOrderButton}
									/>
								</Link>
							</Button>
						) : null}
					</>
				) : null}

				{company.status === "closed" ? (
					<Hint textKey={localizationConstants.salesNextStepClosedHint} />
				) : null}
			</div>
		</SalesSectionCard>
	);
}
