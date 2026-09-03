"use client";

import React, { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import {
	expenseBreadcrumbs,
	EXPENSE_TOP_TAB_ACTIVE_CLASS,
	EXPENSE_TOP_TAB_INACTIVE_CLASS,
} from "../../constants/expense.constants";
import { SupplierInvoiceView } from "./SupplierInvoiceView";
import { CustomerInvoiceView } from "./CustomerInvoiceView";

export function ExpenseListPage() {
	// Top Category Tab: "customer_invoice" (Kundfaktura) | "supplier_invoice" (Leverantörsfaktura)
	const [topCategoryTab, setTopCategoryTab] = useState<"customer_invoice" | "supplier_invoice">("supplier_invoice");

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.expenseOverviewTitle}
				breadcrumbs={expenseBreadcrumbs}
				className="border-b-0 px-8 pt-5 pb-2"
			/>

			{/* Top Level Category Tabs: Kundfaktura / Leverantörsfaktura (Standard #1 & #3) */}
			<div className="px-8 border-b border-slate-200 bg-white">
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={() => setTopCategoryTab("customer_invoice")}
						className={
							topCategoryTab === "customer_invoice"
								? EXPENSE_TOP_TAB_ACTIVE_CLASS
								: EXPENSE_TOP_TAB_INACTIVE_CLASS
						}
					>
						<Translate text={localizationConstants.expenseTopTabCustomerInvoice} />
					</button>

					<button
						type="button"
						onClick={() => setTopCategoryTab("supplier_invoice")}
						className={
							topCategoryTab === "supplier_invoice"
								? EXPENSE_TOP_TAB_ACTIVE_CLASS
								: EXPENSE_TOP_TAB_INACTIVE_CLASS
						}
					>
						<Translate text={localizationConstants.expenseTopTabSupplierInvoice} />
					</button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="px-8 py-5 flex-1 max-w-7xl mx-auto w-full">
				{topCategoryTab === "supplier_invoice" ? (
					<SupplierInvoiceView />
				) : (
					<CustomerInvoiceView />
				)}
			</div>
		</div>
	);
}

export default ExpenseListPage;
