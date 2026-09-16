"use client";

import React from "react";
import { ClaimConnectionCard } from "./ClaimConnectionCard";
import { ClaimDeficiencyCard } from "./ClaimDeficiencyCard";
import { ClaimDemandCard } from "./ClaimDemandCard";
import { ClaimTextCard } from "./ClaimTextCard";
import { ClaimDocumentsStepCard } from "./ClaimDocumentsStepCard";
import { ClaimFormActions } from "./ClaimFormActions";
import { StepProgressCard } from "./StepProgressCard";
import { CreateClaimHeader } from "./CreateClaimHeader";
import { DocumentViewerModal } from "../DocumentViewerModal";
import { useCreateClaim } from "./useCreateClaim";

interface CreateClaimPageProps {
	initialClaimId?: string;
	initialTemplateId?: string;
}

export function CreateClaimPage({
	initialClaimId,
	initialTemplateId,
}: CreateClaimPageProps) {
	const {
		activeTab,
		setActiveTab,
		handleNext,
		handlePrevious,
		templates,
		isEditMode,
		errors,
		viewingDoc,
		setViewingDoc,
		formData,
		handleFieldChange,
		handleTemplateSelect,
		handleAddDocument,
		handleRemoveDocument,
		handleViewDocument,
		handleSave,
		handleCancel,
	} = useCreateClaim({ initialClaimId, initialTemplateId });

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Header matching Figma Screenshots 2 & 3 */}
			<CreateClaimHeader
				isEditMode={isEditMode}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onCancel={handleCancel}
			/>

			{/* Main 2-Column Content Layout matching Figma */}
			<div className="p-6 max-w-7xl mx-auto w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Left Column: Form Cards */}
					<div className="lg:col-span-8 space-y-5">
						{activeTab === "basic" ? (
							<>
								<ClaimConnectionCard
									formData={formData}
									onChange={handleFieldChange}
									errors={errors}
								/>

								<ClaimDeficiencyCard
									formData={formData}
									onChange={handleFieldChange}
									errors={errors}
								/>

								<ClaimDemandCard
									formData={formData}
									onChange={handleFieldChange}
									errors={errors}
								/>

								<ClaimTextCard
									formData={formData}
									templates={templates}
									onChange={handleFieldChange}
									onTemplateSelect={handleTemplateSelect}
									errors={errors}
								/>
							</>
						) : (
							<ClaimDocumentsStepCard
								documents={formData.documents || []}
								onAddDocument={handleAddDocument}
								onRemoveDocument={handleRemoveDocument}
								onViewDocument={handleViewDocument}
								error={errors.documents}
							/>
						)}
					</div>

					{/* Right Column: Step 1/2 Progress Card matching Figma */}
					<div className="lg:col-span-4">
						<StepProgressCard currentStep={activeTab === "basic" ? 1 : 2} />
					</div>
				</div>

				{/* Action Buttons underneath spanning full container width, right aligned to match Figma */}
				<ClaimFormActions
					activeTab={activeTab}
					onCancel={handleCancel}
					onNext={handleNext}
					onPrevious={handlePrevious}
					onSave={handleSave}
				/>
			</div>

			<DocumentViewerModal
				isOpen={viewingDoc !== null}
				document={viewingDoc}
				onClose={() => setViewingDoc(null)}
			/>
		</div>
	);
}

export default CreateClaimPage;
