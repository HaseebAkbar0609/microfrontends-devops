"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { economyBreadcrumbs } from "../../constants/economyNav.config";
import { SupplierInvoiceView } from "./SupplierInvoiceView";

export function ExpenseListPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.expenseOverviewTitle}
				breadcrumbs={economyBreadcrumbs(localizationConstants.expenseTopTabSupplierInvoice)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<SupplierInvoiceView />
			</div>
		</div>
	);
}


export default ExpenseListPage;
