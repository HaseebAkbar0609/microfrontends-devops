"use client";

import React from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateWageTypeForm } from "../../../hooks/useCreateWageTypeForm";
import { CreateWageTypeFormCard } from "./cards/CreateWageTypeFormCard";
import { WAGE_TYPES_BASE_ROUTE } from "../../../constants/wageTypes.constants";

export function CreateWageTypePage() {
	const router = useRouter();
	const {
		formData,
		errors,
		isSubmitting,
		updateField,
		submitForm,
		cancel,
	} = useCreateWageTypeForm();

	return (
		<div className="flex flex-col min-h-full bg-slate-50/50">
			{/* Main Form Content */}
			<div className="p-6 w-full space-y-6 flex-1 max-w-5xl">
				{/* Header with Back Arrow */}
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.push(WAGE_TYPES_BASE_ROUTE)}
						className="h-8 w-8 text-slate-900 hover:bg-slate-100 cursor-pointer"
						aria-label={localizationConstants.goBackToWageTypeListLabel}
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-xl font-bold text-slate-900">
						<Translate text={localizationConstants.wageTypeCreatePageHeaderTitle} />
					</h1>
				</div>

				{/* Sub-tab: Grund Information */}
				<div className="border-b border-slate-200">
					<Tabs defaultValue="grund">
						<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
							<TabsTrigger
								value="grund"
								className="pb-3 pt-1 text-sm font-semibold cursor-pointer"
							>
								<Translate text={localizationConstants.grundInformationSection} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Form Card */}
				<CreateWageTypeFormCard
					formData={formData}
					errors={errors}
					onUpdateField={updateField}
				/>
			</div>

			{/* Sticky Bottom Action Footer matching Figma Image 2 */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 shadow-sm">
				<div className="flex items-center justify-end gap-3 max-w-5xl mx-auto">
					<Button
						type="button"
						variant="outline"
						onClick={cancel}
						className="h-10 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg text-sm"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>
					<Button
						type="button"
						disabled={isSubmitting}
						onClick={submitForm}
						className="h-10 px-6 bg-[#111721] text-white hover:bg-slate-800 gap-2 cursor-pointer rounded-lg text-sm shadow-2xs"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CreateWageTypePage;
