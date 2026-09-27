"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface CreateArticleActionsBarProps {
	readonly currentStep: number;
	readonly totalSteps: number;
	readonly isSubmitting: boolean;
	readonly isEdit: boolean;
	readonly onNext: () => void;
	readonly onCancel: () => void;
}

export function CreateArticleActionsBar({
	currentStep,
	totalSteps,
	isSubmitting,
	isEdit,
	onNext,
	onCancel,
}: CreateArticleActionsBarProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
			>
				<Translate text={localizationConstants.cancelButton} />
			</Button>

			{currentStep < totalSteps ? (
				<Button
					type="button"
					onClick={onNext}
					className="bg-[#111721] hover:bg-slate-800 text-white cursor-pointer px-6"
				>
					<Translate text={localizationConstants.nextButton} />
				</Button>
			) : (
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-[#111721] hover:bg-slate-800 text-white cursor-pointer px-6"
				>
					{isSubmitting ? (
						<Translate text={localizationConstants.saveButton} />
					) : isEdit ? (
						<Translate text={localizationConstants.saveButton} />
					) : (
						<Translate text={localizationConstants.articleCreateButton} />
					)}
				</Button>
			)}
		</div>
	);
}
