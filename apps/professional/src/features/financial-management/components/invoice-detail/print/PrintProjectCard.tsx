"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { InvoiceDetailData } from "../../../types/invoiceDetail.types";

interface PrintProjectCardProps {
	data: InvoiceDetailData;
}

export function PrintProjectCard({ data }: PrintProjectCardProps) {
	return (
		<div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 mb-6 text-xs grid grid-cols-2 gap-4">
			<div>
				<p className="text-slate-500">
					<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
				</p>
				<p className="font-bold text-slate-900 text-sm mt-0.5">{data.projectNumber}</p>
			</div>
			<div>
				<p className="text-slate-500">
					<Translate text={localizationConstants.createInvoiceFieldProjectName} />
				</p>
				<p className="font-bold text-slate-900 text-sm mt-0.5">{data.projectName}</p>
			</div>
		</div>
	);
}

export default PrintProjectCard;
