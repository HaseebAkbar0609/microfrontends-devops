"use client";

import React, { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { economyBreadcrumbs } from "../../constants/economyNav.config";
import { SupplierInvoiceView } from "./SupplierInvoiceView";

import { CustomerInvoiceView } from "./CustomerInvoiceView";

export function ExpenseListPage() {
	// Top Category Tab: "customer_invoice" (Kundfaktura) | "supplier_invoice" (Leverantörsfaktura)
	const [topCategoryTab, setTopCategoryTab] = useState<"customer_invoice" | "supplier_invoice">("supplier_invoice");

	const breadcrumbSection = topCategoryTab === "customer_invoice"
		? localizationConstants.expenseTopTabCustomerInvoice
		: localizationConstants.expenseTopTabSupplierInvoice;

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.expenseOverviewTitle}
				breadcrumbs={economyBreadcrumbs(breadcrumbSection)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area with 2-Level Line Tabs */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<Tabs
					value={topCategoryTab}
					onValueChange={(val) => setTopCategoryTab(val as "customer_invoice" | "supplier_invoice")}
					className="flex-1"
				>
					<div className="flex items-center border-b border-slate-200 mb-5 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="supplier_invoice" className="cursor-pointer">
								<Translate text={localizationConstants.expenseTopTabSupplierInvoice} />
							</TabsTrigger>
							<TabsTrigger value="customer_invoice" className="cursor-pointer">
								<Translate text={localizationConstants.expenseTopTabCustomerInvoice} />
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="supplier_invoice" className="mt-0">
						<SupplierInvoiceView />
					</TabsContent>
					<TabsContent value="customer_invoice" className="mt-0">
						<CustomerInvoiceView />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}


export default ExpenseListPage;
