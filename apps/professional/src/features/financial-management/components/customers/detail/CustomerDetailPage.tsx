"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCustomerDetail } from "@/features/financial-management/hooks/useCustomerDetail";
import { CustomerDetailHeader } from "./CustomerDetailHeader";
import { CustomerDetailTabs } from "./CustomerDetailTabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { ContactTab } from "./tabs/ContactTab";
import { AssessmentTab } from "./tabs/AssessmentTab";
import { InvoiceTab } from "./tabs/InvoiceTab";

interface CustomerDetailPageProps {
	id: string;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ id }) => {
	const {
		customer,
		isLoading,
		activeTab,
		setActiveTab,
		handleBack,
		handleEditSection,
		handleDeleteContactPerson,
		handleDeleteDocument,
	} = useCustomerDetail(id);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white" />
			</div>
		);
	}

	if (!customer) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
					<Translate text={localizationConstants.customerDetailNotFound} />
				</h2>
				<button
					type="button"
					onClick={handleBack}
					className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
				>
					<Translate text={localizationConstants.customerDetailBackToList} />
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-12">
			{/* Top Header */}
			<CustomerDetailHeader
				customerNo={customer.customerNo}
				onBack={handleBack}
			/>

			{/* Horizontal Navigation Tabs */}
			<CustomerDetailTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* Active Tab View */}
			<div>
				{activeTab === "basic" && (
					<BasicInfoTab customer={customer} onEdit={handleEditSection} />
				)}
				{activeTab === "contact" && (
					<ContactTab
						customer={customer}
						onEdit={handleEditSection}
						onDeleteContactPerson={handleDeleteContactPerson}
					/>
				)}
				{activeTab === "assessment" && (
					<AssessmentTab
						customer={customer}
						onEdit={handleEditSection}
						onDeleteDocument={handleDeleteDocument}
					/>
				)}
				{activeTab === "invoice" && (
					<InvoiceTab customer={customer} onEdit={handleEditSection} />
				)}
			</div>
		</div>
	);
};
