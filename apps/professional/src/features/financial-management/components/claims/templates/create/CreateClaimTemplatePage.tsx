"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ClaimTemplateFormCard } from "./ClaimTemplateFormCard";
import { useCreateClaimTemplate } from "./useCreateClaimTemplate";

interface CreateClaimTemplatePageProps {
	initialTemplateId?: string;
}

export function CreateClaimTemplatePage({
	initialTemplateId,
}: CreateClaimTemplatePageProps) {
	const {
		isEditMode,
		generatedId,
		formData,
		errors,
		handleFieldChange,
		handleCancel,
		handleSave,
	} = useCreateClaimTemplate({ templateId: initialTemplateId });

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen">
			{/* Top Header with Back Arrow & Title */}
			<div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0">
				<div className="flex items-center gap-3 mb-6">
					<button
						type="button"
						onClick={handleCancel}
						className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
						title="Tillbaka"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<h1 className="text-xl font-bold text-slate-900">
						<Translate
							text={
								isEditMode
									? localizationConstants.claimTplEditMall
									: localizationConstants.claimTplNyttMall
							}
						/>
					</h1>
				</div>

				{/* Sub-tab: Grunduppgifter */}
				<div className="flex items-center gap-8">
					<button
						type="button"
						className="pb-3 text-sm font-semibold text-slate-900 border-b-2 border-slate-900 transition-all cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplTabGrunduppgifter} />
					</button>
				</div>
			</div>

			{/* Main Form Content */}
			<div className="p-8 max-w-4xl w-full flex-1">
				<ClaimTemplateFormCard
					templateId={generatedId}
					formData={formData}
					errors={errors}
					onChange={handleFieldChange}
				/>
			</div>

			{/* Sticky Bottom Action Bar */}
			<div className="sticky bottom-0 bg-white border-t border-slate-200 py-3 px-8 shadow-xs">
				<div className="max-w-4xl flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						className="h-9 px-5 text-sm font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplBtnAvbryt} />
					</Button>

					<Button
						type="button"
						onClick={handleSave}
						className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md shadow-2xs flex items-center gap-2 cursor-pointer"
					>
						<Translate text={localizationConstants.claimTplBtnSpara} />
						<Save className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CreateClaimTemplatePage;
