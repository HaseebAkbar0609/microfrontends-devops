"use client";

import React from "react";
import { Paperclip, User } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseItem } from "../../../types/cases.types";
import { getCategoryLabelKey } from "../shared";

interface CaseInfoSidebarProps {
	caseItem: CaseItem;
}

export function CaseInfoSidebar({ caseItem }: CaseInfoSidebarProps) {
	const attachments = [...(caseItem.documents || []), ...(caseItem.images || [])];

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesCardCaseInfo} />
			</h2>

			{/* Skapad av */}
			<div className="space-y-2">
				<p className="text-xs font-semibold text-slate-500">
					<Translate text={localizationConstants.casesFieldCreatedBy} />
				</p>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 overflow-hidden">
						{caseItem.createdBy.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
					</div>
					<div className="min-w-0">
						<p className="text-xs font-bold text-slate-900 truncate">
							{caseItem.createdBy}
						</p>
						<p className="text-[11px] text-slate-500 truncate">
							{caseItem.createdRole || "Pelles Måleri"}
						</p>
					</div>
				</div>
			</div>

			{/* Kategori */}
			<div className="space-y-1.5">
				<p className="text-xs font-semibold text-slate-500">
					<Translate text={localizationConstants.casesFieldCategory} />
				</p>
				<div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs text-slate-800">
					<Translate text={getCategoryLabelKey(caseItem.category)} />
				</div>
			</div>

			{/* Bilagor */}
			<div className="space-y-2">
				<p className="text-xs font-semibold text-slate-500">
					<Translate text={localizationConstants.casesFieldAttachments} />
				</p>
				{attachments.length === 0 ? (
					<p className="text-xs text-slate-400 italic">Inga bilagor</p>
				) : (
					<div className="space-y-2">
						{attachments.map((file) => (
							<div
								key={file.id}
								className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
								onClick={() => alert(`Öppnar bilaga: ${file.name}`)}
							>
								<Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
								<span className="truncate font-mono text-[11px]">{file.name}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default CaseInfoSidebar;
