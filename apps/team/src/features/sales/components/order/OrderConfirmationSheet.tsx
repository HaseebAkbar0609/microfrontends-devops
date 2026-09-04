"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getQuoteTermMeta } from "../../constants/quoteModules";
import type { SalesCompany, SalesOrder } from "../../types";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";
import {
	QuoteDocumentHeader,
	QuoteDocumentParty,
} from "../quote/QuoteDocumentHeader";
import { QuoteLinesTable } from "../quote/QuoteLinesTable";
import { QuoteSignatureBlock } from "../quote/QuoteSignatureBlock";
import { QuoteTotalsRow } from "../quote/QuoteTotalsRow";

type OrderConfirmationSheetProps = {
	company: SalesCompany;
	order: SalesOrder;
};

/** The A4 order confirmation the seller prints or saves as PDF. */
export function OrderConfirmationSheet({
	company,
	order,
}: OrderConfirmationSheetProps) {
	const { quote, payment } = company;

	return (
		<section className="@container print-sheet rounded-xl border border-slate-200 bg-white p-8 shadow-2xs">
			<QuoteDocumentHeader
				meta={
					<>
						<p className="font-medium text-slate-900">
							<Translate text={localizationConstants.salesOrderNumberLabel} />{" "}
							{order.orderNumber}
						</p>
						<p>{formatDate(order.createdAt)}</p>
						{quote ? (
							<p>
								<Translate
									text={localizationConstants.salesOrderRefQuoteLabel}
								/>{" "}
								{quote.quoteNumber}
							</p>
						) : null}
					</>
				}
			/>

			<div className="my-5 h-px bg-slate-200" />

			<div className="grid gap-4 text-sm @md:grid-cols-2">
				<QuoteDocumentParty
					headingKey={localizationConstants.salesQuoteCustomerHeading}
					name={company.name}
					lines={[
						company.organisationNumber,
						company.contactPerson,
						company.mobile,
						company.email,
					]}
				/>
				<div className="@md:text-right">
					<p className="text-xs uppercase tracking-wide text-slate-500">
						<Translate
							text={localizationConstants.salesOrderOwnersHeading}
						/>
					</p>
					<p className="font-medium text-slate-900">
						<Translate text={localizationConstants.salesFieldSeller} />
						{": "}
						{company.seller || "—"}
					</p>
					<p className="text-slate-500">
						<Translate text={localizationConstants.salesFieldAccountManager} />
						{": "}
						{company.accountManager || "—"}
					</p>
					{quote ? (
						<p className="text-slate-500">
							<Translate
								text={localizationConstants.salesOrderPaymentTermLabel}
							/>
							{": "}
							<Translate text={getQuoteTermMeta(quote.term).labelKey} />
						</p>
					) : null}
				</div>
			</div>

			{quote ? (
				<>
					<QuoteLinesTable lines={quote.lines} />

					<div className="mt-5 space-y-1.5 text-sm">
						<QuoteTotalsRow
							strong
							label={
								<Translate
									text={localizationConstants.salesQuoteMonthlyCost}
								/>
							}
							value={
								<>
									{formatCurrency(quote.monthlyNet)}
									<Translate
										text={localizationConstants.salesPerMonthSuffix}
									/>
								</>
							}
						/>
						<QuoteTotalsRow
							strong
							label={
								<Translate
									text={localizationConstants.salesFirstInvoiceLabel}
								/>
							}
							value={formatCurrency(quote.firstInvoice)}
						/>
					</div>

					{quote.notes ? (
						<div className="mt-5 whitespace-pre-line break-words text-xs text-slate-500">
							{quote.notes}
						</div>
					) : null}
				</>
			) : (
				<p className="mt-6 text-sm text-slate-500">
					<Translate text={localizationConstants.salesOrderNoQuoteNotice} />
				</p>
			)}

			{payment ? (
				<div className="mt-6 rounded-lg border border-slate-200 p-4 text-xs text-slate-500">
					<p className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.salesPaymentLabel} />
						{": "}
						<Translate
							text={
								payment.status === "paid"
									? localizationConstants.salesPaymentPaid
									: localizationConstants.salesPaymentPending
							}
						/>
					</p>
					<p className="break-all">
						<Translate
							text={localizationConstants.salesOrderPaymentLinkLabel}
						/>
						{": "}
						{payment.link}
					</p>
					<p>
						<Translate text={localizationConstants.salesOrderInvoiceLabel} />{" "}
						{payment.invoiceNumber}
					</p>
				</div>
			) : null}

			<QuoteSignatureBlock customerName={company.name} />
		</section>
	);
}
