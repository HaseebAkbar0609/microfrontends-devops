"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailData } from "../../../types/invoiceDetail.types";

interface PrintDocumentHeaderProps {
	data: InvoiceDetailData;
}

export function PrintDocumentHeader({ data }: PrintDocumentHeaderProps) {
	const { t } = useTranslation();
	const supplierTitle = data.supplierName || t(localizationConstants.defaultSupplierName);

	return (
		<div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
			<div>
				<h1 className="text-2xl font-black text-slate-900 tracking-tight">
					{supplierTitle}
				</h1>
				<p className="text-xs text-slate-500 mt-0.5">
					<Translate text={localizationConstants.defaultSupplierName} />
				</p>
			</div>
			<div className="text-right">
				<div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
					<p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
						<Translate text={localizationConstants.createInvoiceModalInvoiceNo} />
					</p>
					<p className="text-xl font-black text-slate-900">#{data.invoiceNo}</p>
				</div>
			</div>
		</div>
	);
}

export default PrintDocumentHeader;
