"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../types/medarbetarsamtal.types";
import { DetailInfoCards } from "./detail/DetailInfoCards";
import { DetailGoalsWellbeingCards } from "./detail/DetailGoalsWellbeingCards";
import { DetailFeedbackActionsCard } from "./detail/DetailFeedbackActionsCard";
import { DetailProtocolDocsCard } from "./detail/DetailProtocolDocsCard";

interface MedarbetarsamtalDetailViewProps {
	review: MedarbetarsamtalItem;
	onBack: () => void;
	onEditSection?: (sectionNumber: number) => void;
	onPreviewDoc?: (name: string) => void;
}

export function MedarbetarsamtalDetailView({
	review,
	onBack,
	onEditSection,
	onPreviewDoc,
}: MedarbetarsamtalDetailViewProps) {
	return (
		<div className="space-y-5">
			{/* Back Link */}
			<button
				type="button"
				onClick={onBack}
				className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				<Translate text={localizationConstants.medarbetarsamtalDropdownLabel} />
			</button>

			{/* 2-Column Responsive Card Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<DetailInfoCards
					review={review}
					onEditSection={onEditSection}
				/>
				<DetailGoalsWellbeingCards
					review={review}
					onEditSection={onEditSection}
				/>
				<DetailFeedbackActionsCard
					review={review}
					onEditSection={onEditSection}
				/>
			</div>

			{/* 7. Protokoll dokument Card */}
			<DetailProtocolDocsCard
				review={review}
				onEditSection={onEditSection}
				onPreviewDoc={onPreviewDoc}
			/>
		</div>
	);
}
