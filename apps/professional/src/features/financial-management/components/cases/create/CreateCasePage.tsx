"use client";

import React from "react";

import { useCreateCaseForm } from "../../../hooks/useCreateCaseForm";
import { BasicInfoCard } from "./BasicInfoCard";
import { CreateCaseHeader } from "./CreateCaseHeader";
import { CreateCaseTabs } from "./CreateCaseTabs";
import { DocumentsTab } from "./DocumentsTab";
import { FormActions } from "./FormActions";
import { MessageCard } from "./MessageCard";

export interface CreateCasePageProps {
	/** Which module the screen is mounted in; every link is built from it. */
	basePath?: string;
}

/**
 * Skapa Ärende, which also serves editing through `?edit=`.
 *
 * The form lives in `useCreateCaseForm`; this is the two tabs it fills and the
 * bar that files it.
 */
export function CreateCasePage({ basePath }: CreateCasePageProps = {}) {
	const form = useCreateCaseForm(basePath);

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Header with consistent back navigation */}
			<CreateCaseHeader title={form.pageTitle} onBack={form.leave} basePath={basePath} />

			{/* Sub Tabs matching Figma */}
			<CreateCaseTabs activeTab={form.activeTab} onTabChange={form.setActiveTab} />

			{form.activeTab === "basic_info" ? (
				<div className="space-y-6">
					<BasicInfoCard formData={form.formData} errors={form.errors} onChange={form.setField} />
					<MessageCard
						message={form.formData.initialMessage || ""}
						error={form.errors.initialMessage}
						onChange={(value) => form.setField("initialMessage", value)}
					/>
				</div>
			) : (
				<DocumentsTab
					documents={form.formData.documents}
					images={form.formData.images}
					onAddDocument={form.addDocument}
					onRemoveDocument={form.removeDocument}
					onAddImage={form.addImage}
					onRemoveImage={form.removeImage}
				/>
			)}

			{/* Bottom Action Buttons with consistent cancel handler */}
			<FormActions
				activeTab={form.activeTab}
				isSubmitting={form.isSubmitting}
				isEditMode={form.isEditMode}
				onCancel={form.leave}
				onPrevious={() => form.setActiveTab("basic_info")}
				onSave={form.save}
				onNext={form.next}
			/>
		</div>
	);
}

export default CreateCasePage;
