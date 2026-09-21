"use client";

import React, { Suspense } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SuppliersOverviewTable } from "./SuppliersOverviewTable";

export function SuppliersOverviewPage() {
	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar with Leverantörslista */}
			<div className="border-b border-slate-200">
				<div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-3 px-1 text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierListTab} />
				</div>
			</div>

			{/* Supplier Table Content */}
			<Suspense
				fallback={
					<div className="py-8 text-center text-sm text-slate-500">
						<Translate text={localizationConstants.genericLoading} />
					</div>
				}
			>
				<SuppliersOverviewTable />
			</Suspense>
		</div>
	);
}

export default SuppliersOverviewPage;
