"use client";

import React from "react";
import { Edit2, FileText, MessageSquare } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem } from "../../../types/cases.types";
import { getCategoryLabelKey } from "../shared";

interface CaseBasicInfoViewProps {
	caseItem: CaseItem;
	onEdit?: () => void;
}

export function CaseBasicInfoView({
	caseItem,
	onEdit,
}: CaseBasicInfoViewProps) {
	const message = caseItem.messages[0]?.content?.trim() ?? "";

	return (
		<div className="space-y-6">
			{/* Card 1: Grundläggande info matching Figma Image 5 Left */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<div className="flex items-center gap-2">
						<FileText className="w-4 h-4 text-slate-700" />
						<h2 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.casesCardBasicInfo} />
						</h2>
					</div>

					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="h-7 px-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
						>
							<Edit2 className="w-3 h-3 text-slate-500" />
							<Translate text={localizationConstants.casesBtnEdit} />
						</button>
					)}
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs pt-1">
					<div className="space-y-1">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldId} />
						</p>
						<p className="text-slate-900 font-mono font-medium">
							{caseItem.caseNumber || caseItem.id}
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldCategory} />
						</p>
						<p className="text-slate-900 font-medium">
							<Translate text={getCategoryLabelKey(caseItem.category)} />
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldTitle} />
						</p>
						<p className="text-slate-900 font-medium">{caseItem.title}</p>
					</div>

					<div className="space-y-1">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldCreatedBy} />
						</p>
						<p className="text-slate-900 font-medium">{caseItem.createdBy}</p>
					</div>

					<div className="space-y-1 col-span-2">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldDescription} />
						</p>
						<p className="text-slate-800 leading-relaxed">
							{caseItem.description || "-"}
						</p>
					</div>

					<div className="space-y-1 col-span-2">
						<p className="font-medium text-slate-500">
							<Translate text={localizationConstants.casesFieldDate} />
						</p>
						<p className="text-slate-900 font-medium">{caseItem.date}</p>
					</div>
				</div>
			</div>

			{/* Card 2: the case's own message */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<div className="flex items-center gap-2">
						<MessageSquare className="w-4 h-4 text-slate-700" />
						<h2 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.casesCardMessages} />
						</h2>
					</div>

					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="h-7 px-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
						>
							<Edit2 className="w-3 h-3 text-slate-500" />
							<Translate text={localizationConstants.casesBtnEdit} />
						</button>
					)}
				</div>

				<div className="space-y-1.5 text-xs pt-1">
					<p className="font-medium text-slate-500">
						<Translate text={localizationConstants.casesFieldYourMessage} />
					</p>
					<div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg leading-relaxed text-xs">
						{message ? (
							<span className="text-slate-800">{message}</span>
						) : (
							<span className="text-slate-400 italic">
								<Translate text={localizationConstants.casesNoMessageYet} />
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CaseBasicInfoView;
