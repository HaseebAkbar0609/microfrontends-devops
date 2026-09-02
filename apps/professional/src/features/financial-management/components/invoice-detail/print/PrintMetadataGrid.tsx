"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailData } from "../../../types/invoiceDetail.types";

interface PrintMetadataGridProps {
	data: InvoiceDetailData;
}

export function PrintMetadataGrid({ data }: PrintMetadataGridProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-6 pb-6 border-b border-slate-100">
			<div>
				<p className="text-slate-500 font-normal">
					<Translate text={localizationConstants.createInvoiceModalDate} />
				</p>
				<p className="font-semibold text-slate-900 mt-0.5">{data.invoiceDate}</p>
			</div>
			<div>
				<p className="text-slate-500 font-normal">
					<Translate text={localizationConstants.createInvoiceModalDueDate} />
				</p>
				<p className="font-semibold text-slate-900 mt-0.5">{data.dueDate}</p>
			</div>
			<div>
				<p className="text-slate-500 font-normal">
					<Translate text={localizationConstants.createInvoiceModalPaymentTerms} />
				</p>
				<p className="font-semibold text-slate-900 mt-0.5">{data.paymentPlanName}</p>
			</div>
			<div>
				<p className="text-slate-500 font-normal">
					<Translate text={localizationConstants.invoiceDetailContractNo} />
				</p>
				<p className="font-semibold text-slate-900 mt-0.5">AVT-2025-001</p>
			</div>
		</div>
	);
}

export default PrintMetadataGrid;
