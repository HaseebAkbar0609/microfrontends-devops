"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailData } from "../../../types/invoiceDetail.types";

interface PrintCompanyFooterProps {
	data: InvoiceDetailData;
}

export function PrintCompanyFooter({ data }: PrintCompanyFooterProps) {
	const { t } = useTranslation();
	const supplierTitle = data.supplierName || t(localizationConstants.defaultSupplierName);

	return (
		<div className="space-y-4">
			{/* Thank you note */}
			<div className="border-t border-slate-200 pt-4 mb-4 text-center text-xs text-slate-600">
				<Translate text={localizationConstants.invoiceDetailThankYouNote} />
			</div>

			{/* Företagsuppgifter Footer */}
			<div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-[11px] text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
				<div>
					<p className="font-bold text-slate-900">
						<Translate text={localizationConstants.invoiceDetailCompanyName} />:
					</p>
					<p>{supplierTitle}</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailVatNo} />:
					</p>
					<p>SE556123456701</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailFTax} />:
					</p>
					<p>
						<Translate text={localizationConstants.invoiceDetailYes} />
					</p>
				</div>

				<div>
					<p className="font-bold text-slate-900">
						<Translate text={localizationConstants.invoiceDetailAddress} />:
					</p>
					<p>{data.supplierAddress || "Industrivägen 42, 123 45 Stockholm"}</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailOrgNo} />:
					</p>
					<p>556123-4567</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailBank} />:
					</p>
					<p>Swedbank</p>
				</div>

				<div>
					<p className="font-bold text-slate-900">
						<Translate text={localizationConstants.invoiceDetailBankgiro} />:
					</p>
					<p>8327-9, 123 456 789-0</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailBic} />:
					</p>
					<p>SWEDSESS</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailEmail} />:
					</p>
					<p>{data.supplierEmail || "info@cleaningservices.se"}</p>
				</div>

				<div>
					<p className="font-bold text-slate-900">
						<Translate text={localizationConstants.invoiceDetailIban} />:
					</p>
					<p>SE35 5000 0000 0583 9825 7466</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailSwish} />:
					</p>
					<p>123 456 7890</p>
					<p className="font-bold text-slate-900 mt-2">
						<Translate text={localizationConstants.invoiceDetailPhone} />:
					</p>
					<p>{data.supplierPhone || "08-123 456 78"}</p>
				</div>
			</div>

			<p className="text-[10px] text-slate-500 text-center">
				<Translate text={localizationConstants.invoiceDetailPaymentNote} />
			</p>
		</div>
	);
}

export default PrintCompanyFooter;
