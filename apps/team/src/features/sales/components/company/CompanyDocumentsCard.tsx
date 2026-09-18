"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getQuoteTermMeta } from "../../constants/quoteModules";
import type { SalesCompany } from "../../types";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";
import { SalesSectionCard } from "../SalesSectionCard";

type CompanyDocumentsCardProps = {
	company: SalesCompany;
};

/**
 * Quote and order confirmation for this company, with the links that reach
 * them. The record tab row no longer carries that navigation.
 */
export function CompanyDocumentsCard({ company }: CompanyDocumentsCardProps) {
	const { quote, order } = company;
	if (!quote && !order) return null;

	return (
		<SalesSectionCard titleKey={localizationConstants.salesDocumentsTitle}>
			{quote ? (
				<div className="text-sm">
					<p className="font-medium text-slate-900">
						<Translate text={localizationConstants.salesQuoteLabel} />{" "}
						{quote.quoteNumber}
					</p>
					<p className="text-xs text-slate-500">
						{formatCurrency(quote.monthlyNet)}
						<Translate text={localizationConstants.salesPerMonthSuffix} /> ·{" "}
						<Translate text={getQuoteTermMeta(quote.term).labelKey} /> ·{" "}
						{formatDate(quote.createdAt)}
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.salesFirstInvoiceLabel} />
						{": "}
						{formatCurrency(quote.firstInvoice)}
					</p>
					<Button
						asChild
						variant="outline"
						size="sm"
						className="mt-2 w-full cursor-pointer"
					>
						<Link href={`/module/sales/companies/${company.id}/quote`}>
							<Translate text={localizationConstants.salesEditQuoteButton} />
						</Link>
					</Button>
				</div>
			) : null}

			{order ? (
				<>
					{quote ? <div className="my-3 h-px bg-slate-200" /> : null}
					<p className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.salesOrderLabel} />{" "}
						{order.orderNumber}
					</p>
					<Button
						asChild
						variant="outline"
						size="sm"
						className="mt-2 w-full cursor-pointer"
					>
						<Link
							href={`/module/sales/companies/${company.id}/order-confirmation`}
						>
							<Translate text={localizationConstants.salesViewOrderButton} />
						</Link>
					</Button>
				</>
			) : null}
		</SalesSectionCard>
	);
}
