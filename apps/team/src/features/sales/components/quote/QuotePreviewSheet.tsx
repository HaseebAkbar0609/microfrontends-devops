"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getQuoteTermMeta } from "../../constants/quoteModules";
import { MS_PER_DAY } from "../../constants/sales.constants";
import type { QuoteTotals } from "../../types";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";
import type { QuoteDraft } from "../../utils/quoteDraft";
import {
	QuoteDocumentHeader,
	QuoteDocumentParty,
} from "./QuoteDocumentHeader";
import { QuoteLinesTable } from "./QuoteLinesTable";
import { QuoteSignatureBlock } from "./QuoteSignatureBlock";
import { QuoteTotalsRow } from "./QuoteTotalsRow";

type QuotePreviewSheetProps = {
	draft: QuoteDraft;
	totals: QuoteTotals;
	quoteNumber: string;
};

/** The A4 document the seller prints or saves as PDF. */
export function QuotePreviewSheet({
	draft,
	totals,
	quoteNumber,
}: QuotePreviewSheetProps) {
	const term = getQuoteTermMeta(draft.term);
	const validUntil = new Date(
		new Date(draft.createdAt).getTime() + draft.validDays * MS_PER_DAY,
	).toISOString();

	return (
		<section className="@container print-sheet rounded-xl border border-slate-200 bg-white p-8 shadow-2xs @4xl:sticky @4xl:top-6 @4xl:self-start">
			<QuoteDocumentHeader
				meta={
					<>
						<p className="font-medium text-slate-900">
							<Translate text={localizationConstants.salesQuoteNumberLabel} />{" "}
							{quoteNumber || <Translate text={localizationConstants.salesQuoteNumberPending} />}
						</p>
						<p suppressHydrationWarning>{formatDate(draft.createdAt)}</p>
						<p suppressHydrationWarning>
							<Translate
								text={localizationConstants.salesQuoteValidUntilLabel}
							/>{" "}
							{formatDate(validUntil)}
						</p>
					</>
				}
			/>

			<div className="my-5 h-px bg-slate-200" />

			<div className="grid gap-4 text-sm @md:grid-cols-2">
				<QuoteDocumentParty
					headingKey={localizationConstants.salesQuoteCustomerHeading}
					name={draft.customerName}
					lines={[
						draft.organisationNumber,
						draft.contactPerson,
						draft.email,
						draft.customerMobile,
					]}
				/>
				<QuoteDocumentParty
					headingKey={localizationConstants.salesQuoteSellerHeading}
					name={draft.sellerName}
					lines={[draft.sellerEmail, draft.sellerMobile]}
					extra={
						<>
							{draft.users}{" "}
							<Translate
								text={localizationConstants.salesQuoteUsersSuffix}
							/>{" "}
							· <Translate text={term.labelKey} />
						</>
					}
					align="right"
				/>
			</div>

			<QuoteLinesTable lines={totals.lines} showDescriptions />

			<div className="mt-5 space-y-1.5 text-sm">
				<QuoteTotalsRow
					label={
						<Translate text={localizationConstants.salesQuoteRunningCost} />
					}
					value={
						<>
							{formatCurrency(totals.monthlyGross)}
							<Translate text={localizationConstants.salesPerMonthSuffix} />
						</>
					}
				/>
				{term.discount > 0 ? (
					<QuoteTotalsRow
						muted
						label={
							<>
								<Translate
									text={localizationConstants.salesQuoteTermDiscountLabel}
								/>{" "}
								<Translate text={term.labelKey} /> (
								{Math.round(term.discount * 100)} %)
							</>
						}
						value={
							<>
								-{formatCurrency(totals.termDiscountAmount)}
								<Translate text={localizationConstants.salesPerMonthSuffix} />
							</>
						}
					/>
				) : null}
				{draft.extraDiscountPercent > 0 ? (
					<QuoteTotalsRow
						muted
						label={
							<>
								<Translate
									text={
										localizationConstants.salesQuoteExtraDiscountRowLabel
									}
								/>{" "}
								({draft.extraDiscountPercent} %)
							</>
						}
						value={
							<>
								-{formatCurrency(totals.extraDiscountAmount)}
								<Translate text={localizationConstants.salesPerMonthSuffix} />
							</>
						}
					/>
				) : null}

				<div className="my-2 h-px bg-slate-200" />

				<QuoteTotalsRow
					strong
					label={
						<Translate text={localizationConstants.salesQuoteMonthlyCost} />
					}
					value={
						<>
							{formatCurrency(totals.monthlyNet)}
							<Translate text={localizationConstants.salesPerMonthSuffix} />
						</>
					}
				/>
				<QuoteTotalsRow
					label={
						<>
							<Translate
								text={localizationConstants.salesQuoteInvoiceAmount}
							/>{" "}
							({totals.periodMonths}{" "}
							<Translate text={localizationConstants.salesQuoteMonthsSuffix} />)
						</>
					}
					value={formatCurrency(totals.amountPerInvoice)}
				/>
				{totals.oneTimeTotal > 0 ? (
					<QuoteTotalsRow
						label={
							<Translate text={localizationConstants.salesQuoteOneTimeCost} />
						}
						value={formatCurrency(totals.oneTimeTotal)}
					/>
				) : null}

				<div className="my-2 h-px bg-slate-200" />

				<QuoteTotalsRow
					strong
					label={
						<Translate text={localizationConstants.salesFirstInvoiceLabel} />
					}
					value={formatCurrency(totals.firstInvoice)}
				/>
				<QuoteTotalsRow
					muted
					label={
						<Translate text={localizationConstants.salesQuoteAnnualCost} />
					}
					value={formatCurrency(totals.annualCost)}
				/>
			</div>

			<div className="mt-5 whitespace-pre-line break-words text-xs text-slate-500">
				{draft.notes || (
					<Translate text={localizationConstants.salesQuoteVatNotice} />
				)}
			</div>

			<QuoteSignatureBlock customerName={draft.customerName} />
		</section>
	);
}
