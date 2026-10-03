"use client";

import React from "react";
import { User } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PersonalDocumentMetadata } from "@/features/personnel/types/personalDocument.types";

interface PersonalDocumentHeaderCardProps {
	metadata: PersonalDocumentMetadata;
}

export function PersonalDocumentHeaderCard({
	metadata,
}: PersonalDocumentHeaderCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
			{/* Card Title */}
			<div className="flex items-center gap-2">
				<div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
					<User className="w-3.5 h-3.5" />
				</div>
				<h3 className="text-xs font-bold text-slate-900">
					<Translate text={localizationConstants.personalDocOverviewTitle} />
				</h3>
			</div>

			{/* 3 Fields Layout matching Figma */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
				{/* Personal handbok */}
				<div className="space-y-1">
					<p className="text-[11px] text-slate-500 font-medium">
						<Translate text={localizationConstants.personalDocFieldHandbook} />
					</p>
					<p className="text-xs font-bold text-slate-800">
						{metadata.employeeHandbook || "-"}
					</p>
				</div>

				{/* Policy */}
				<div className="space-y-1">
					<p className="text-[11px] text-slate-500 font-medium">
						<Translate text={localizationConstants.personalDocFieldPolicy} />
					</p>
					<p className="text-xs font-bold text-slate-800">
						{metadata.policy || "-"}
					</p>
				</div>

				{/* Arbetsbeskrivning */}
				<div className="space-y-1">
					<p className="text-[11px] text-slate-500 font-medium">
						<Translate text={localizationConstants.personalDocFieldJobDesc} />
					</p>
					<p className="text-xs font-bold text-slate-800">
						{metadata.jobDescription || "-"}
					</p>
				</div>
			</div>
		</div>
	);
}
