"use client";

import Link from "next/link";
import { FileText, FilePlus2, Link2, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getSalesStatusMeta } from "../../constants/salesStatuses";
import { useCompanyWorkflow } from "../../hooks/useCompanyWorkflow";
import type { SalesCompany } from "../../types";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";
import { SalesSectionCard } from "../SalesSectionCard";

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
							className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
							onClick={moveToLead}
						>
							<Translate text={localizationConstants.salesMoveToLeadButton} />
						</Button>
					</>
				) : null}

				{company.status === "lead" ? (
					<>
						<Hint textKey={localizationConstants.salesNextStepLeadHint} />
						<Button
							asChild
							className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
						>
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
								<Button
									type="button"
									className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
								>
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
						{company.payment ? (
							<div className="space-y-2 rounded-lg border border-slate-200 p-3">
								<p className="text-sm font-medium text-slate-900">
									<Translate
										text={localizationConstants.salesPaymentStatusLabel}
									/>
									{": "}
									<span
										className={
											company.payment.status === "paid"
												? "text-emerald-700"
												: "text-slate-500"
										}
									>
										<Translate
											text={
												company.payment.status === "paid"
													? localizationConstants.salesPaymentPaid
													: localizationConstants.salesPaymentPending
											}
										/>
									</span>
								</p>
								<p className="text-sm text-slate-700">
									<Translate
										text={localizationConstants.salesInvoicedAmountLabel}
									/>
									{": "}
									<span className="tabular-nums">
										{formatCurrency(company.payment.amount)}
									</span>
								</p>
								<p className="flex items-start gap-1 break-all text-xs text-slate-500">
									<Link2 className="mt-0.5 h-3 w-3 shrink-0" />
									{company.payment.link}
								</p>
								<p className="flex items-start gap-1 text-xs text-slate-500">
									<ReceiptText className="mt-0.5 h-3 w-3 shrink-0" />
									<span>
										<Translate
											text={localizationConstants.salesOrderInvoiceLabel}
										/>{" "}
										{company.payment.invoiceNumber} ·{" "}
										<Translate
											text={localizationConstants.salesInvoiceSentLabel}
										/>{" "}
										{formatDate(company.payment.sentAt)}
									</span>
								</p>
								{company.payment.status === "pending" ? (
									<ConfirmDialog
										title={t(localizationConstants.salesConfirmMarkPaidTitle)}
										description={t(
											localizationConstants.salesConfirmMarkPaidDescription,
										)}
										confirmText={t(localizationConstants.salesConfirmLabel)}
										cancelText={t(localizationConstants.salesCancelButton)}
										onConfirm={confirmMarkPaid}
										trigger={
											<Button
												type="button"
												size="sm"
												className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
											>
												<Translate
													text={localizationConstants.salesMarkPaidButton}
												/>
											</Button>
										}
									/>
								) : null}
							</div>
						) : (
							<>
								<Hint
									textKey={localizationConstants.salesNextStepAcceptedHint}
								/>
								<ConfirmDialog
									title={t(localizationConstants.salesConfirmSendPaymentTitle)}
									description={t(
										localizationConstants.salesConfirmSendPaymentDescription,
									)}
									confirmText={t(localizationConstants.salesConfirmLabel)}
									cancelText={t(localizationConstants.salesCancelButton)}
									onConfirm={confirmSendPayment}
									trigger={
										<Button
											type="button"
											className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
										>
											<Link2 className="mr-2 h-4 w-4" />
											<Translate
												text={localizationConstants.salesSendPaymentButton}
											/>
										</Button>
									}
								/>
							</>
						)}
						{company.order ? (
							<Button asChild variant="outline" className="w-full cursor-pointer">
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
