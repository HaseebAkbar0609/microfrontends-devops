"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_STATUSES, getSalesStatusMeta } from "../constants/salesStatuses";
import {
	getSalesCategoryLabelKey,
	getSalesRegionLabelKey,
} from "../constants/salesTaxonomy";
import type { SalesCompany, SalesCompanyStatus } from "../types";
import {
	EMPTY_VALUE_PLACEHOLDER,
	formatCurrency,
	getInvoicedAmount,
} from "../utils/salesFormatters";
import { TrialAccountBadge } from "./TrialAccountBadge";

type SalesCompanyRowProps = {
	company: SalesCompany;
	onStatusChange: (companyId: string, status: SalesCompanyStatus) => void;
};

function TextCell({ value }: { value: string }) {
	return <>{value || EMPTY_VALUE_PLACEHOLDER}</>;
}

function TaxonomyCell({ labelKey }: { labelKey: string | null }) {
	if (!labelKey) return <>{EMPTY_VALUE_PLACEHOLDER}</>;
	return <Translate text={labelKey} />;
}

export function SalesCompanyRow({
	company,
	onStatusChange,
}: SalesCompanyRowProps) {
	const t = useTranslate();
	const status = getSalesStatusMeta(company.status);
	const invoiced = getInvoicedAmount(company);
	const companyHref = `/module/sales/companies/${company.id}`;

	return (
		<TableRow className="hover:bg-slate-50/70">
			<TableCell>
				<Link
					href={companyHref}
					className="font-medium text-slate-900 hover:underline"
				>
					{company.name || t(localizationConstants.salesUnnamedCompany)}
				</Link>
				<span className="block text-xs text-slate-500">
					{[company.trade, company.city].filter(Boolean).join(" · ") ||
						EMPTY_VALUE_PLACEHOLDER}
				</span>
			</TableCell>
			<TableCell className="text-xs text-slate-500">
				<TextCell value={company.organisationNumber} />
			</TableCell>
			<TableCell>
				<TaxonomyCell labelKey={getSalesCategoryLabelKey(company.category)} />
			</TableCell>
			<TableCell>
				<TaxonomyCell labelKey={getSalesRegionLabelKey(company.region)} />
			</TableCell>
			<TableCell>
				<TextCell value={company.contactPerson} />
			</TableCell>
			<TableCell className="text-xs text-slate-500">
				<TextCell value={company.mobile} />
			</TableCell>
			<TableCell className="text-xs text-slate-500">
				<TextCell value={company.email} />
			</TableCell>
			<TableCell>
				<TextCell value={company.seller} />
			</TableCell>
			<TableCell>
				<Select
					value={company.status}
					onValueChange={(value) =>
						onStatusChange(company.id, value as SalesCompanyStatus)
					}
				>
					<SelectTrigger
						aria-label={t(localizationConstants.salesStatusSelectLabel)}
						className={`h-8 w-auto gap-1 border-none px-2 text-xs font-medium ${status.accentClassName}`}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SALES_STATUSES.map((option) => (
							<SelectItem key={option.id} value={option.id}>
								<Translate text={option.labelKey} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="text-xs">
				{company.quote ? (
					<>
						<span className="block font-medium text-slate-900">
							{company.quote.quoteNumber}
						</span>
						<span className="text-slate-500">
							{formatCurrency(company.quote.monthlyNet)}
							<Translate text={localizationConstants.salesPerMonthSuffix} />
						</span>
					</>
				) : (
					<span className="text-slate-500">
						<Translate text={localizationConstants.salesNoQuote} />
					</span>
				)}
			</TableCell>
			<TableCell className="text-right tabular-nums">
				{invoiced > 0 ? (
					<>
						<span className="font-medium">{formatCurrency(invoiced)}</span>
						<span className="block text-xs text-slate-500">
							<Translate
								text={
									company.payment?.status === "paid"
										? localizationConstants.salesPaymentPaid
										: localizationConstants.salesPaymentPending
								}
							/>
						</span>
					</>
				) : (
					<span className="text-slate-500">{EMPTY_VALUE_PLACEHOLDER}</span>
				)}
			</TableCell>
			<TableCell>
				<TrialAccountBadge accounts={company.demoAccounts} kind="demo" />
			</TableCell>
			<TableCell>
				<TrialAccountBadge accounts={company.testAccounts} kind="test" />
			</TableCell>
			<TableCell className="text-right">
				<Button asChild variant="outline" size="sm" className="cursor-pointer">
					<Link href={companyHref}>
						<Translate text={localizationConstants.salesOpenAction} />
						<ArrowRight className="ml-1 h-3.5 w-3.5" />
					</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}
