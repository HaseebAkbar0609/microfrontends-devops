"use client";

import React from "react";
import {
	SYSTEM_DETAIL_TAB_BASIC,
	SYSTEM_DETAIL_TAB_ASSIGNMENT,
} from "@/features/data-it/constants/dataItSystem.constants";
import { useDataItSystemCreate } from "@/features/data-it/hooks/useDataItSystemCreate";
import { SystemCreateHeader } from "./SystemCreateHeader";
import { SystemCreateTabs } from "./SystemCreateTabs";
import { SystemCreateBasicInfoCard } from "./SystemCreateBasicInfoCard";
import { SystemCreateDocumentsCard } from "./SystemCreateDocumentsCard";
import { SystemCreateAssignmentCard } from "./SystemCreateAssignmentCard";
import { SystemCreateActionBar } from "./SystemCreateActionBar";
import { SystemCreateCancelDialog } from "./SystemCreateCancelDialog";

export const DataItSystemCreateView: React.FC = () => {
	const {
		form,
		activeTab,
		setActiveTab,
		showPassword,
		togglePasswordVisibility,
		errors,
		isCancelDialogOpen,
		setIsCancelDialogOpen,
		updateField,
		addDocument,
		removeDocument,
		addAssigneeFromCandidate,
		removeAssignee,
		handleNext,
		handleSave,
		handleCancel,
		confirmCancel,
	} = useDataItSystemCreate();

	const hasBasicErrors = Boolean(errors.program || errors.systemId || errors.email);

	return (
		<div className="flex flex-1 flex-col gap-6 px-6 py-5">
			{/* Top Header: ← Ny system */}
			<SystemCreateHeader onBack={handleCancel} />

			{/* Sub Tabs: Grundläggande info | Tilldelning */}
			<SystemCreateTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				hasErrorsTabBasic={hasBasicErrors}
			/>

			{/* Tab 1 Content: Grundläggande info */}
			{activeTab === SYSTEM_DETAIL_TAB_BASIC && (
				<div className="flex flex-col gap-6">
					<SystemCreateBasicInfoCard
						form={form}
						errors={errors}
						showPassword={showPassword}
						onTogglePassword={togglePasswordVisibility}
						onFieldChange={updateField}
					/>
					<SystemCreateDocumentsCard
						documents={form.documents}
						onAddDocument={addDocument}
						onRemoveDocument={removeDocument}
					/>
				</div>
			)}

			{/* Tab 2 Content: Tilldelning */}
			{activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT && (
				<div className="flex flex-col gap-6">
					<SystemCreateAssignmentCard
						assignedUsers={form.assignedUsers}
						onAssignUser={addAssigneeFromCandidate}
						onRemoveAssignee={removeAssignee}
					/>
				</div>
			)}

			{/* Bottom Action Bar */}
			<SystemCreateActionBar
				activeTab={activeTab}
				onCancel={handleCancel}
				onSave={handleSave}
				onNext={handleNext}
			/>

			{/* Discard Confirmation Dialog */}
			<SystemCreateCancelDialog
				isOpen={isCancelDialogOpen}
				onClose={() => setIsCancelDialogOpen(false)}
				onConfirm={confirmCancel}
			/>
		</div>
	);
};

export default DataItSystemCreateView;
