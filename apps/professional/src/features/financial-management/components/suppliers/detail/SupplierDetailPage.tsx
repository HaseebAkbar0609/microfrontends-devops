"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierDetail } from "../../../hooks/useSupplierDetail";
import { SupplierDetailHeader } from "./SupplierDetailHeader";
import { SupplierDetailTabs } from "./SupplierDetailTabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { ContactTab } from "./tabs/ContactTab";
import { AssessmentTab } from "./tabs/AssessmentTab";

interface SupplierDetailPageProps {
	id: string;
}

export function SupplierDetailPage({ id }: SupplierDetailPageProps) {
	const {
		supplier,
		isLoading,
		activeTab,
		setActiveTab,
		handleBack,
		updateSupplier,
		handleDeleteContactPerson,
		handleAddContactPerson,
		handleDeleteDocument,
		handleAddDocument,
	} = useSupplierDetail(id);

	if (isLoading) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
			</div>
		);
	}

	if (!supplier) {
		return (
			<div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.supplierDetailNotFound} />
				</p>
				<button
					type="button"
					onClick={handleBack}
					className="text-xs font-semibold text-slate-900 underline hover:text-blue-600 cursor-pointer"
				>
					<Translate text={localizationConstants.supplierDetailBackToList} />
				</button>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6 p-6">
			{/* Header */}
			<SupplierDetailHeader
				levNr={supplier.levNr}
				onBack={handleBack}
			/>

			{/* Tabs */}
			<SupplierDetailTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* Tab Contents */}
			<div>
				{activeTab === "basic" && (
					<BasicInfoTab
						supplier={supplier}
						onUpdate={updateSupplier}
					/>
				)}

				{activeTab === "contact" && (
					<ContactTab
						supplier={supplier}
						onUpdate={updateSupplier}
						onAddPerson={handleAddContactPerson}
						onDeletePerson={handleDeleteContactPerson}
					/>
				)}

				{activeTab === "assessment" && (
					<AssessmentTab
						supplier={supplier}
						onUpdate={updateSupplier}
						onAddDocument={handleAddDocument}
						onDeleteDocument={handleDeleteDocument}
					/>
				)}
			</div>
		</div>
	);
}

export default SupplierDetailPage;
