"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getSalesStatusMeta } from "../../constants/salesStatuses";
import type { SalesCompany } from "../../types";
import { SalesSectionCard } from "../SalesSectionCard";
import { ProfessionalBillingHandoff } from "./ProfessionalBillingHandoff";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";

type Props = {
	company: SalesCompany;
	onChange: (patch: Partial<SalesCompany>) => void;
};

const PRIMARY_BUTTON_CLASS = `w-full cursor-pointer ${SALES_PRIMARY_BUTTON_CLASS}`;

export function CompanyNextStepCard({ company, onChange }: Props) {
	const status = getSalesStatusMeta(company.status);
	const quoteHref = `/module/sales/companies/${company.id}/quote`;

	return (
		<SalesSectionCard titleKey={localizationConstants.salesNextStepTitle}>
			<span className={`mb-3 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${status.accentClassName}`}>
				<Translate text={status.labelKey} />
			</span>
			<div className="space-y-3">
				{company.status === "prospect" && (
					<>
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.salesNextStepProspectHint} /></p>
						<Button className={PRIMARY_BUTTON_CLASS} onClick={() => onChange({ status: "lead" })}>
							<Translate text={localizationConstants.salesMoveToLeadButton} />
						</Button>
					</>
				)}
				{company.status === "lead" && (
					<>
						<p className="text-sm text-slate-500"><Translate text={localizationConstants.salesNextStepLeadHint} /></p>
						<Button asChild className={PRIMARY_BUTTON_CLASS}>
							<Link href={quoteHref}>
								<FileText className="mr-2 h-4 w-4" />
								<Translate text={localizationConstants.salesCreateQuoteButton} />
							</Link>
						</Button>
					</>
				)}
				{(company.status === "quoted" || company.status === "accepted") && (
					<>
						<ProfessionalBillingHandoff company={company} />
						<Button asChild variant="outline" className="w-full cursor-pointer">
							<Link href={quoteHref}><Translate text={localizationConstants.salesEditQuoteButton} /></Link>
						</Button>
					</>
				)}
				{company.status === "closed" && (
					<p className="text-sm text-slate-500"><Translate text={localizationConstants.salesNextStepClosedHint} /></p>
				)}
			</div>
		</SalesSectionCard>
	);
}
