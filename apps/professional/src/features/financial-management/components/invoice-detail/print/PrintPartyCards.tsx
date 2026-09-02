"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailData } from "../../../types/invoiceDetail.types";

interface PrintPartyCardsProps {
	data: InvoiceDetailData;
}

export function PrintPartyCards({ data }: PrintPartyCardsProps) {
	const { t } = useTranslation();
	const supplierTitle = data.supplierName || t(localizationConstants.defaultSupplierName);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-6">
			{/* Customer Card */}
			<div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
				<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
					<Translate text={localizationConstants.createInvoiceModalBillTo} />
				</p>
				<p className="font-bold text-sm text-slate-900 pt-0.5">{data.customer}</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.createInvoiceFieldContactPerson} />: {data.contactPerson}
				</p>
				<p className="text-slate-600">{data.customerAddress}</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailOrgNo} />: {data.customerOrgNr}
				</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailEmail} />: {data.customerEmail}
				</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailPhone} />: {data.customerPhone}
				</p>
			</div>

			{/* Supplier Card */}
			<div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-1">
				<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
					<Translate text={localizationConstants.invoiceDetailSupplier} />
				</p>
				<p className="font-bold text-sm text-slate-900 pt-0.5">{supplierTitle}</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.createInvoiceFieldContactPerson} />: {data.supplierContact}
				</p>
				<p className="text-slate-600">{data.supplierAddress}</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailOrgNo} />: 556123-4567
				</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailEmail} />: {data.supplierEmail}
				</p>
				<p className="text-slate-600">
					<Translate text={localizationConstants.invoiceDetailPhone} />: {data.supplierPhone}
				</p>
			</div>
		</div>
	);
}

export default PrintPartyCards;
